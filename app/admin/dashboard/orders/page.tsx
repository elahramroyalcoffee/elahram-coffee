"use client";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { OrderTypes } from "@/lib/types";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import OrdersTable from "./_components/OrdersTable";
import PaginationProvider from "./_components/PaginationProvider";
import { subscribeToOrders, unsubscribeFromRealtime } from "@/utils/realtime";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function OrdersContent() {
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const totalPagesRef = useRef(1);
  const totalOrdersRef = useRef(0);
  const searchParams = useSearchParams();
  const highlightOrderId = searchParams?.get("highlight");

  useEffect(() => {
    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => console.log(payload)
      )
      .subscribe();

    console.log(changes);
  }, []);

  // Fetch orders with pagination
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const itemsPerPage = 5;
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items(
            *,
            product:products(*),
            size:sizes(*),
            grind:grinds(*)
          ),
          shipments(*),
          payment_settings(*)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      totalOrdersRef.current = count || 0;
      totalPagesRef.current = Math.ceil((count || 0) / itemsPerPage);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const refetch = (page: number = currPage) => {
    fetchData(page);
  };

  // Handle realtime updates
  const handleNewOrder = (newOrder: OrderTypes) => {
    // Only update if we're on the first page
    if (currPage === 1) {
      refetch(1);
    }
    totalOrdersRef.current += 1;
    // Scroll to top to show new order notification
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderUpdate = (updatedOrder: OrderTypes) => {
    // Refetch current page to get updated data
    refetch(currPage);
  };

  const handleOrderDelete = (orderId: number) => {
    // Refetch current page
    refetch(currPage);
    totalOrdersRef.current -= 1;
  };

  useEffect(() => {
    refetch(currPage);
  }, [currPage]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = subscribeToOrders(
      handleNewOrder,
      handleOrderUpdate,
      handleOrderDelete
    );

    return () => {
      unsubscribeFromRealtime(channel);
    };
  }, [currPage]);

  return (
    <>
      <DashboardPageHeader title="الطلبات" />

      <div className="page-body">
        <div className="mb-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                جميع الطلبات
              </h2>
              <div className="text-sm text-gray-500">
                المجموع: {totalOrdersRef.current} طلب
              </div>
              <Button
                onClick={() => {
                  refetch();
                  setCurrPage(1);
                }}
              >
                تحديث الطلبات{" "}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <OrdersTable orders={orders} refetch={refetch} loading={loading} />
          <div className="px-4 pb-4">
            <PaginationProvider
              currPage={currPage}
              totalPages={totalPagesRef.current}
              onPageChange={setCurrPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div>
          <DashboardPageHeader title="الطلبات" />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}

export default OrdersPage;
