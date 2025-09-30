"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";

interface DashboardStatsData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  // totalCustomers: number; // Commented for now as requested
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    // totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [ordersRes, productsRes] = await Promise.all([
        // Orders count and total revenue
        supabase.from("orders").select("total_amount", { count: "exact" }),
        // Products count
        supabase.from("products").select("*", { count: "exact" }),
      ]);

      // Calculate totals
      const totalOrders = ordersRes.count || 0;
      const totalRevenue =
        ordersRes.data?.reduce(
          (sum, order) => sum + (parseFloat(order.total_amount) || 0),
          0
        ) || 0;
      const totalProducts = productsRes.count || 0;

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };

  const statsCards = [
    {
      title: "إجمالي الطلبات",
      value: loading ? "..." : stats.totalOrders.toLocaleString("ar-EG"),
      icon: ShoppingCart,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      link: "/admin/dashboard/orders",
    },
    {
      title: "إجمالي الإيرادات",
      value: loading ? "..." : formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      link: "/admin/dashboard/orders",
    },
    {
      title: "إجمالي المنتجات",
      value: loading ? "..." : stats.totalProducts.toLocaleString("ar-EG"),
      icon: Package,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      link: "/admin/dashboard/products",
    },
    // Commented out customers card as requested
    // {
    //   title: "العملاء",
    //   value: loading ? "..." : stats.totalCustomers.toLocaleString("ar-EG"),
    //   icon: Users,
    //   color: "bg-orange-500",
    //   hoverColor: "hover:bg-orange-600",
    //   link: "/admin/dashboard/customers",
    // },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsCards.map((card, index) => {
        const IconComponent = card.icon;

        return (
          <Link key={index} href={card.link}>
            <Card
              className={`transition-all duration-200 ${card.hoverColor} hover:shadow-lg cursor-pointer group`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground group-hover:text-white transition-colors mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${card.color} group-hover:bg-white/20 transition-colors`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
