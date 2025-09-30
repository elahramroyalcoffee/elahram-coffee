"use client";
import React, { useState } from "react";
import { RefundTypes } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface RefundsTableProps {
  refunds: RefundTypes[];
  refetch: () => void;
  loading: boolean;
}

const RefundsTable: React.FC<RefundsTableProps> = ({
  refunds,
  refetch,
  loading,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const updateRefundStatus = async (refundId: number, newStatus: string) => {
    setUpdatingStatus(refundId);
    try {
      const { error } = await supabase
        .from("refunds")
        .update({ refund_status: newStatus })
        .eq("id", refundId);

      if (error) throw error;

      toast.success("تم تحديث حالة المرتجع بنجاح");
      refetch();
    } catch (error) {
      console.error("Error updating refund status:", error);
      toast.error("خطأ في تحديث حالة المرتجع");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">قيد الانتظار</Badge>;
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
      locale: ar,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لا توجد مرتجعات</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">رقم المرتجع</TableHead>
            <TableHead className="text-right">رقم الطلب</TableHead>
            <TableHead className="text-right">رقم الهاتف</TableHead>
            <TableHead className="text-right">اسم العميل</TableHead>
            <TableHead className="text-right">قيمة الطلب</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">تاريخ الطلب</TableHead>
            <TableHead className="text-right">تاريخ طلب المرتجع</TableHead>
            <TableHead className="text-right">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund.id}>
              <TableCell className="font-medium">#{refund.id}</TableCell>
              <TableCell>#{refund.order_id}</TableCell>
              <TableCell>{refund.customer_phone}</TableCell>
              <TableCell>{refund.order?.customer_name || "غير محدد"}</TableCell>
              <TableCell>
                {refund.order?.total_amount
                  ? `${refund.order.total_amount} جنيه`
                  : "غير محدد"}
              </TableCell>
              <TableCell>{getStatusBadge(refund.refund_status)}</TableCell>
              <TableCell>
                {refund.order?.created_at
                  ? formatDate(refund.order.created_at)
                  : "غير محدد"}
              </TableCell>
              <TableCell>{formatDate(refund.created_at)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {refund.refund_status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          updateRefundStatus(refund.id, "approved")
                        }
                        disabled={updatingStatus === refund.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updatingStatus === refund.id ? "..." : "موافقة"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateRefundStatus(refund.id, "rejected")
                        }
                        disabled={updatingStatus === refund.id}
                      >
                        {updatingStatus === refund.id ? "..." : "رفض"}
                      </Button>
                    </>
                  )}
                  {refund.refund_status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRefundStatus(refund.id, "completed")}
                      disabled={updatingStatus === refund.id}
                      className="bg-blue-50 hover:bg-blue-100"
                    >
                      {updatingStatus === refund.id ? "..." : "تم الاسترداد"}
                    </Button>
                  )}
                  {(refund.refund_status === "completed" ||
                    refund.refund_status === "rejected") && (
                    <span className="text-sm text-gray-500">
                      {refund.refund_status === "completed" ? "مكتمل" : "مرفوض"}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RefundsTable;
