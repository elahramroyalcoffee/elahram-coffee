"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import ServerDrawer from "@/components/global/ui/ServerDrawer";
import ProductForm from "../product/ProductForm";
import { ProductTypes } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmButton from "@/components/global/form/ConfirmButtonForm";
import { changeStockAction, deleteProductAction } from "@/utils/actions";
import Loading from "@/components/global/ui/Loading";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

function ProductsTable({ products, refetch, loading }: any) {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>الرقم التعريفي</TableHead>
          <TableHead>اسم المنتج</TableHead>
          <TableHead>وصف المنتج</TableHead>
          <TableHead>تصنيف المنتج</TableHead>
          <TableHead>متوفر</TableHead>
          <TableHead>تاريخ الإنشاء</TableHead>
          <TableHead>الأدوات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!products.length && !loading && (
          <TableRow>
            <TableCell colSpan={6}>لا يوجد نتائج</TableCell>
          </TableRow>
        )}
        {loading && (
          <TableRow>
            <TableCell colSpan={6}>
              <Loading />
            </TableCell>
          </TableRow>
        )}
        {!loading &&
          products?.map((product: ProductTypes) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">#{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category?.title}</TableCell>
              <TableCell>
                <Switch
                  id="product-in-stock"
                  dir="ltr"
                  defaultChecked={product.in_stock}
                  onCheckedChange={(checked) =>
                    changeStockAction(product.id, checked)
                  }
                />
              </TableCell>
              <TableCell>{product.created_at}</TableCell>
              <TableCell>
                <div className="flex-center gap-4">
                  <ServerDrawer
                    className="!p-0"
                    trigger={
                      <FaRegEdit className="cursor-pointer text-blue-500 hover:text-blue-950 transition text-lg" />
                    }
                    title="تعديل المنتج"
                    varient={"ghost"}
                    key={`key-${products}`}
                  >
                    <ProductForm
                      defaultProduct={product}
                      mode="edit"
                      onSuccess={() => refetch(1)}
                    />
                  </ServerDrawer>
                  <Dialog key={`product-${product}`}>
                    <DialogTrigger>
                      <AiOutlineDelete className="cursor-pointer text-red-500 hover:text-red-950 transition text-lg" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>هل أنت متأكد</DialogTitle>
                        <DialogDescription>
                          هذه العملية ستقوم بمسح نهائي لهذا المنتج
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <ConfirmButton
                          action={deleteProductAction}
                          onSuccess={() => refetch(1)}
                          title="مسح"
                        >
                          <input
                            type="text"
                            hidden
                            name={"product_id"}
                            defaultValue={product?.id}
                          />
                        </ConfirmButton>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default ProductsTable;
