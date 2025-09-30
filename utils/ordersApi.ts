import { supabase } from "./supabase";

// ============================================
// ORDERS MANAGEMENT
// ============================================

export interface Order {
  id?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  total_amount: number;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  size_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
  product?: any;
  size?: any;
}

// Get all orders with items
export const getOrders = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(*),
          size:product_sizes(*)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get orders with pagination
export const getOrdersPaginated = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(*),
          size:product_sizes(*)
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get orders by status
export const getOrdersByStatus = async (status: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(*),
          size:product_sizes(*)
        )
      `
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get single order
export const getOrder = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(*),
          size:product_sizes(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Create new order with items
export const createOrder = async (orderData: {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  notes?: string;
  items: Array<{
    product_id: number;
    size_id: number;
    quantity: number;
    unit_price: number;
  }>;
}) => {
  try {
    // Calculate total amount
    const total_amount = orderData.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          notes: orderData.notes,
          total_amount,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      size_id: item.size_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) throw itemsError;

    return { success: true, data: { ...order, order_items: items } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Update order status
export const updateOrderStatus = async (
  id: number,
  status: Order["status"]
) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Update order details
export const updateOrder = async (id: number, orderData: Partial<Order>) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        ...orderData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Delete order (and cascade delete items)
export const deleteOrder = async (id: number) => {
  try {
    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// ============================================
// ORDER ANALYTICS
// ============================================

// Get order statistics
export const getOrderStats = async () => {
  try {
    // Total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Total revenue
    const { data: revenueData } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "delivered");

    const totalRevenue =
      revenueData?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ) || 0;

    // Orders by status
    const { data: statusData } = await supabase.from("orders").select("status");

    const ordersByStatus =
      statusData?.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    return {
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        ordersByStatus,
        recentOrders: recentOrders || 0,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get daily sales data (for charts)
export const getDailySales = async (days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("orders")
      .select("created_at, total_amount, status")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date
    const salesByDate =
      data?.reduce((acc: any, order) => {
        const date = new Date(order.created_at).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, sales: 0, orders: 0 };
        }
        if (order.status === "delivered") {
          acc[date].sales += Number(order.total_amount);
        }
        acc[date].orders += 1;
        return acc;
      }, {}) || {};

    return {
      success: true,
      data: Object.values(salesByDate),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
