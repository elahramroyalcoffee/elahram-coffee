import { AiOutlineProduct } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { MdOutlineCategory } from "react-icons/md";
import { BanknoteArrowDown, Truck } from "lucide-react";
import { MdOutlineAttachMoney } from "react-icons/md";

type dashboardLinksProps = {
  name: string;
  path: string;
  icon: any;
}[];

export const dashboardLinks: dashboardLinksProps = [
  {
    name: "الرئيسية",
    path: "/admin/dashboard",
    icon: ImStatsDots,
  },
  {
    name: "التصنيفات",
    path: "/admin/dashboard/categories",
    icon: MdOutlineCategory,
  },
  {
    name: "المنتجات",
    path: "/admin/dashboard/products",
    icon: AiOutlineProduct,
  },
  {
    name: "الطلبات",
    path: "/admin/dashboard/orders",
    icon: BsCart2,
  },
  {
    name: "المرتجعات",
    path: "/admin/dashboard/refunds",
    icon: BanknoteArrowDown,
  },
  {
    name: "الشحن",
    path: "/admin/dashboard/shipments",
    icon: Truck,
  },
  {
    name: "وسائل الدفع",
    path: "/admin/dashboard/payments",
    icon: MdOutlineAttachMoney,
  },
];
