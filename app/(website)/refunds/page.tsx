"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  created_at: string;
  refunds: Array<{ id: number; refund_status: string }>;
}

export default function RefundsPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchOrders = async () => {
    if (!phone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      // Fetch orders for the last 3 months (refund eligibility period)
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_name,
          customer_phone,
          total_amount,
          created_at,
          refunds:refunds(id, refund_status)
        `)
        .eq("customer_phone", phone.trim())
        .gte("created_at", threeMonthsAgo.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("خطأ في البحث عن الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const requestRefund = async (orderId: number) => {
    try {
      const { error } = await supabase
        .from("refunds")
        .insert({
          order_id: orderId,
          customer_phone: phone,
          refund_status: "pending",
        });

      if (error) throw error;

      toast.success("تم إرسال طلب الاسترداد بنجاح");
      // Refresh orders to show the new refund status
      searchOrders();
    } catch (error: any) {
      console.error("Error creating refund:", error);
      if (error.code === "23505") {
        toast.error("يوجد بالفعل طلب استرداد لهذا الطلب");
      } else {
        toast.error("خطأ في إرسال طلب الاسترداد");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", {
      locale: ar,
    });
  };

  const getRefundStatus = (refunds: Array<{ id: number; refund_status: string }>) => {
    if (refunds.length === 0) return null;
    const refund = refunds[0];
    switch (refund.refund_status) {
      case "pending":
        return <Badge variant="outline">قيد المراجعة</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>;
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>;
      default:
        return <Badge variant="outline">{refund.refund_status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            طلب استرداد
          </h1>
          <p className="text-gray-600">
            أدخل رقم هاتفك للبحث عن طلباتك وطلب الاسترداد
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>البحث عن الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="tel"
                placeholder="رقم الهاتف (مثل: 01012345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
                dir="ltr"
              />
              <Button onClick={searchOrders} disabled={loading}>
                {loading ? "جاري البحث..." : "بحث"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchPerformed && (
          <div>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    لم يتم العثور على طلبات لهذا الرقم في الأشهر الثلاثة الماضية
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  طلباتك ({orders.length})
                </h2>
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-lg">
                              طلب رقم #{order.id}
                            </h3>
                            {getRefundStatus(order.refunds)}
                          </div>
                          <p className="text-gray-600">
                            العميل: {order.customer_name}
                          </p>
                          <p className="text-gray-600">
                            المبلغ: {order.total_amount} جنيه
                          </p>
                          <p className="text-gray-600">
                            تاريخ الطلب: {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div>
                          {order.refunds.length === 0 ? (
                            <Button
                              onClick={() => requestRefund(order.id)}
                              variant="outline"
                            >
                              طلب استرداد
                            </Button>
                          ) : (
                            <div className="text-sm text-gray-500">
                              تم طلب الاسترداد
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}