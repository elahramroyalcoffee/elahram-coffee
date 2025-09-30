"use client";
import React, { useState } from "react";
import { Bell, Clock, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";

export const NotificationBell = () => {
  const {
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notificationId: string, orderId: number) => {
    markAsRead(notificationId);
    setIsOpen(false);
    // Navigation will happen via Link component
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuHeader className="flex items-center justify-between p-4">
          <h3 className="font-semibold">الإشعارات</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                تعيين الكل كمقروء
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </DropdownMenuHeader>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-0">
                <Link
                  href={`/admin/dashboard/orders?highlight=${notification.orderId}`}
                  className="w-full p-3 block hover:bg-gray-50"
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.orderId
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        notification.type === "new_order"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 truncate">
                        {notification.customerName}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-medium text-green-600">
                          {notification.amount} جنيه
                        </p>

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link href="/admin/dashboard/orders">
                <Button variant="ghost" className="w-full text-sm">
                  عرض جميع الطلبات
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
