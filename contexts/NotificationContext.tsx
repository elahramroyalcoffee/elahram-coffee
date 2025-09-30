"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  subscribeToOrders,
  unsubscribeFromRealtime,
  RealtimeOrder,
} from "@/utils/realtime";

interface NotificationContextType {
  unreadCount: number;
  notifications: OrderNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

interface OrderNotification {
  id: string;
  orderId: number;
  type: "new_order" | "order_update";
  message: string;
  customerName: string;
  amount: number;
  timestamp: Date;
  isRead: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Handle new order
  const handleNewOrder = (order: RealtimeOrder) => {
    const notification: OrderNotification = {
      id: `new-order-${order.id}-${Date.now()}`,
      orderId: order.id,
      type: "new_order",
      message: `طلب جديد رقم #${order.id}`,
      customerName: order.customer_name || "غير معروف",
      amount: order.total_amount,
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
    setUnreadCount((prev) => prev + 1);
  };

  // Handle order update
  const handleOrderUpdate = (order: RealtimeOrder) => {
    const notification: OrderNotification = {
      id: `update-order-${order.id}-${Date.now()}`,
      orderId: order.id,
      type: "order_update",
      message: `تم تحديث الطلب #${order.id}`,
      customerName: order.customer_name || "غير معروف",
      amount: order.total_amount,
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);
  };

  // Handle order delete
  const handleOrderDelete = (orderId: number) => {
    // Remove notifications for deleted order
    setNotifications((prev) => prev.filter((n) => n.orderId !== orderId));
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Set up realtime subscription
  useEffect(() => {
    const channel = subscribeToOrders(
      handleNewOrder,
      handleOrderUpdate,
      handleOrderDelete
    );

    // Cleanup on unmount
    return () => {
      unsubscribeFromRealtime(channel);
    };
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin-notifications");
    if (stored) {
      try {
        const parsedNotifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(parsedNotifications);
        setUnreadCount(
          parsedNotifications.filter((n: any) => !n.isRead).length
        );
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem("admin-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const value: NotificationContextType = {
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
