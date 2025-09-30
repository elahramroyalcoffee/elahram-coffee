"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/utils/database";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { Loader } from "lucide-react";
import Loading from "@/components/global/ui/Loading";

function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await supabase.from("products").select(`*,
        category: categories(*)`);

      setProducts(response.data);
    } catch (error) {
      console.log(error);
      toast("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Table className="mt-4">
      <TableCaption>المنتجات الحالية</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>الرقم التعريفي</TableHead>
          <TableHead>اسم المنتج</TableHead>
          <TableHead>وصف المنتج</TableHead>
          <TableHead>تصنيف المنتج</TableHead>
          <TableHead>تاريخ الإنشاء</TableHead>
          <TableHead>الأدوات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading && (
          <TableRow>
            <TableCell colSpan={10}>
              <Loading />
            </TableCell>
          </TableRow>
        )}
        {!loading &&
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">#{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category?.title}</TableCell>
              <TableCell>{product.created_at}</TableCell>
              <TableCell>
                <div className="flex-center gap-4">
                  <FaRegEdit className="cursor-pointer text-blue-500 hover:text-blue-950 transition text-lg" />
                  <AiOutlineDelete className="cursor-pointer text-red-500 hover:text-red-950 transition text-lg" />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default ProductsTable;
