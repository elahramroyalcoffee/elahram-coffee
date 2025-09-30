import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Grid, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function QuickLinks() {
  const quickLinks = [
    {
      title: "إدارة المنتجات",
      description: "إضافة، تعديل، أو حذف منتجات القهوة",
      icon: Package,
      href: "/admin/dashboard/products",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "عرض الطلبات",
      description: "متابعة الطلبات الحديثة وحالتها",
      icon: ShoppingCart,
      href: "/admin/dashboard/orders",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "الفئات",
      description: "تنظيم فئات حبوب القهوة",
      icon: Grid,
      href: "/admin/dashboard/categories",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "التقارير",
      description: "عرض الإحصائيات والتقارير",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>روابط سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;

            return (
              <Link key={index} href={link.href}>
                <div
                  className={`p-6 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer ${link.color} group`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-white/20 mb-3 group-hover:bg-white/30 transition-colors">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{link.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
