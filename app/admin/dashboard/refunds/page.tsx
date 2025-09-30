"use client";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { RefundTypes } from "@/lib/types";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { RefundsTable, PaginationProvider } from "./_components";
import { Button } from "@/components/ui/button";

function RefundsContent() {
  const [refunds, setRefunds] = useState<RefundTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const totalPagesRef = useRef(1);
  const totalRefundsRef = useRef(0);

  // Fetch refunds with pagination
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const itemsPerPage = 5;
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("refunds")
        .select(
          `
          *,
          order:orders(
            id,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            total_amount,
            created_at
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      totalRefundsRef.current = count || 0;
      totalPagesRef.current = Math.ceil((count || 0) / itemsPerPage);
      setRefunds(data || []);
    } catch (error) {
      console.error("Error fetching refunds:", error);
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const refetch = (page: number = currPage) => {
    fetchData(page);
  };

  useEffect(() => {
    refetch(currPage);
  }, [currPage]);

  return (
    <>
      <DashboardPageHeader title="المرتجعات" />

      <div className="page-body">
        <div className="mb-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                جميع المرتجعات
              </h2>
              <div className="text-sm text-gray-500">
                المجموع: {totalRefundsRef.current} مرتجع
              </div>
              <Button
                onClick={() => {
                  refetch();
                  setCurrPage(1);
                }}
              >
                تحديث المرتجعات
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <RefundsTable refunds={refunds} refetch={refetch} loading={loading} />
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

function RefundsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <DashboardPageHeader title="المرتجعات" />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      }
    >
      <RefundsContent />
    </Suspense>
  );
}

export default RefundsPage;
