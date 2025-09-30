"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface MonthlyData {
  month: string;
  orders: number;
  revenue: number;
}

export default function MonthlyChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);

      // Get orders from the last 12 months
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);

      const { data: orders, error } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .gte("created_at", startDate.toISOString())
        .order("created_at");

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      // Group data by month
      const monthlyStats: {
        [key: string]: { orders: number; revenue: number };
      } = {};

      // Initialize the last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "short",
        });
        monthlyStats[monthKey] = { orders: 0, revenue: 0 };
      }

      // Aggregate orders data
      orders?.forEach((order) => {
        const orderDate = new Date(order.created_at);
        const monthKey = orderDate.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "short",
        });

        if (monthlyStats[monthKey]) {
          monthlyStats[monthKey].orders += 1;
          monthlyStats[monthKey].revenue += parseFloat(order.total_amount) || 0;
        }
      });

      // Convert to array format for chart
      const chartData: MonthlyData[] = Object.entries(monthlyStats).map(
        ([month, data]) => ({
          month,
          orders: data.orders,
          revenue: data.revenue,
        })
      );

      setMonthlyData(chartData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الطلبات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "orders" ? "عدد الطلبات" : "الإيرادات",
                ]}
                labelStyle={{ direction: "rtl" }}
              />
              <Bar
                dataKey="orders"
                fill="#3b82f6"
                name="عدد الطلبات"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الإيرادات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  "الإيرادات",
                ]}
                labelStyle={{ direction: "rtl" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                name="الإيرادات"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
