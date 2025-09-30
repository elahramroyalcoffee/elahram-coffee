"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/global/ui/Loading";
import { OrderTypes, OrderItemTypes } from "@/lib/types";

interface OrdersTableProps {
  orders: OrderTypes[];
  refetch: (page?: number) => void;
  loading: boolean;
}

function OrdersTable({ orders, refetch, loading }: OrdersTableProps) {
  const formatCustomerDetails = (order: OrderTypes) => {
    return (
      <div className="space-y-1">
        <div className="font-medium text-gray-900">{order.customer_name}</div>
        <div className="text-sm text-gray-600">{order.customer_phone}</div>
        {order.customer_email && (
          <div className="text-sm text-gray-500">{order.customer_email}</div>
        )}
      </div>
    );
  };

  const formatOrderItems = (orderItems?: OrderItemTypes[]) => {
    if (!orderItems || orderItems.length === 0) {
      return <span className="text-gray-400">لا يوجد عناصر</span>;
    }

    return (
      <div className="space-y-2 max-w-xs">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="text-sm border-b border-gray-100 last:border-b-0 pb-1 last:pb-0"
          >
            <div className="font-medium text-gray-900">
              {item.product?.title}
            </div>
            <div className="font-bold flex flex-wrap justify-center gap-1 text-xs text-gray-600 mt-2">
              {item.size && <span>الحجم: {item.size.size}g</span>}
              {item.grind && <span>• الطحنة: {item.grind.name}</span>}
              <span>• الكمية: {item.quantity}</span>
            </div>

            <div className="mt-2">إضافات: </div>
            <div className="flex flex-wrap justify-center gap-4">
              {item.add_ons && item.add_ons.length > 0 && (
                <div className="text-xs text-green-600 flex gap-1  mt-2 flex-col">
                  <div className="flex gap-1 justify-center flex-col">
                    {item.add_ons.map((addon: any) => (
                      <>
                        <div>اسم الإضافة: {addon.add_ons_name}</div>
                        <div>العدد المطلوب: {addon.quantity}</div>
                        <div>الإجمالي: {addon.total_price} </div>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatShipmentInfo = (order: OrderTypes) => {
    const shipmentData = order.shipments || order.shipment;
    if (!shipmentData) {
      return <span className="text-gray-400">غير محدد</span>;
    }

    return (
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-900">
          {shipmentData.governorate_name_ar}
        </div>
        <div className="text-sm text-gray-600">
          {order.shipment_cost || shipmentData.price} جنيه
        </div>
      </div>
    );
  };

  const formatPaymentMethod = (order: OrderTypes) => {
    if (order.payment_settings) {
      return order.payment_settings.method_name_ar;
    }

    // Fallback for legacy data
    switch (order.payment_method) {
      case "cash_on_delivery":
        return "الدفع عند الاستلام";
      case "kashier_visa":
        return "الدفع بالفيزا - كاشير";
      default:
        return "الدفع عند الاستلام";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "confirmed":
        return "مؤكد";
      case "preparing":
        return "قيد التحضير";
      case "delivered":
        return "تم التسليم";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">الرقم والعميل</TableHead>
          <TableHead className="text-right">عناصر الطلب</TableHead>
          <TableHead className="text-right">العنوان</TableHead>
          <TableHead className="text-right">المبلغ الإجمالي</TableHead>
          <TableHead className="text-right">الشحن</TableHead>
          <TableHead className="text-right">طريقة الدفع</TableHead>
          {/* <TableHead className="text-right">الحالة</TableHead> */}
          <TableHead className="text-right">تاريخ الإنشاء</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading && (
          <TableRow>
            <TableCell colSpan={8}>
              <Loading />
            </TableCell>
          </TableRow>
        )}
        {!loading &&
          orders?.map((order: OrderTypes) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-blue-600">
                    #{order.id}
                  </div>
                  {formatCustomerDetails(order)}
                </div>
              </TableCell>
              <TableCell>{formatOrderItems(order.order_items)}</TableCell>
              <TableCell>
                <div className="max-w-xs text-sm text-gray-700">
                  {order.customer_address}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {order.total_amount} جنيه
              </TableCell>
              <TableCell>{formatShipmentInfo(order)}</TableCell>
              <TableCell>
                <div className="text-sm text-gray-700">
                  {formatPaymentMethod(order)}
                </div>
              </TableCell>
              {/* <TableCell>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
              </TableCell> */}
              <TableCell className="text-sm text-gray-500">
                {formatDate(order.created_at)}
              </TableCell>
            </TableRow>
          ))}
        {!loading && orders?.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
              لا توجد طلبات
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;
