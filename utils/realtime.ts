"use client";
import { supabase } from "./supabase";
import { OrderTypes } from "@/lib/types";
import { toast } from "sonner";

export interface RealtimeOrder extends OrderTypes {
  // Extended order type for realtime
}

// Notification sound (optional)
const playNotificationSound = () => {
  const audio = new Audio("/notification-sound.mp3"); // Add this file to public folder
  audio.play().catch(() => {
    // Handle audio play error silently
  });
};

// Initialize realtime subscription for orders
export const subscribeToOrders = (
  onNewOrder: (order: RealtimeOrder) => void,
  onOrderUpdate: (order: RealtimeOrder) => void,
  onOrderDelete: (orderId: number) => void
) => {
  const channel = supabase
    .channel("orders-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        const newOrder = payload.new as RealtimeOrder;
        console.log("New order received:", newOrder);

        // Play notification sound
        playNotificationSound();

        // Show toast notification
        toast.success(`طلب جديد من ${newOrder.customer_name}`, {
          description: `القيمة: ${newOrder.total_amount} جنيه`,
          duration: 8000,
          action: {
            label: "عرض الطلب",
            onClick: () => {
              window.location.href = `/admin/dashboard/orders?highlight=${newOrder.id}`;
            },
          },
        });

        onNewOrder(newOrder);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        const updatedOrder = payload.new as RealtimeOrder;
        console.log("Order updated:", updatedOrder);
        onOrderUpdate(updatedOrder);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        const deletedOrder = payload.old as RealtimeOrder;
        console.log("Order deleted:", deletedOrder.id);
        onOrderDelete(deletedOrder.id);
      }
    )
    .subscribe();

  return channel;
};

// Initialize realtime subscription for order items (for detailed updates)
export const subscribeToOrderItems = (onOrderItemChange: () => void) => {
  const channel = supabase
    .channel("order-items-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "order_items",
      },
      () => {
        onOrderItemChange();
      }
    )
    .subscribe();

  return channel;
};

// Cleanup subscription
export const unsubscribeFromRealtime = (channel: any) => {
  supabase.removeChannel(channel);
};
