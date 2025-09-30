"use client";
import ImageInput from "@/components/admin/ui/ImageInput";
import FormGroup from "@/components/global/form/FormGroup";
import FormProvider from "@/components/global/form/FormProvider";
import SubmitButton from "@/components/global/form/SubmitButton";
import NotFound from "@/components/global/ui/NotFound";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProductAction, editProductAction } from "@/utils/actions";
import { ProductTypes } from "@/lib/types";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { toast } from "sonner";
import { ProductSize } from "@/utils/database";

function ProductForm({
  setOpen,
  mode,
  defaultProduct,
  onSuccess,
}: {
  setOpen?: any;
  mode?: "add" | "edit";
  defaultProduct?: ProductTypes;
  onSuccess?: any;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [loading, setLoading] = useState(true);
  const isEdit = mode == "edit";
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, sizesRes, productSizesRes]: any =
          await Promise.all([
            supabase.from("categories").select(),
            supabase.from("sizes").select().order("created_at"),
            defaultProduct &&
              supabase
                .from("product_sizes")
                .select()
                .eq("product_id", defaultProduct.id),
          ]);

        if (categoriesRes?.data && sizesRes?.data) {
          setCategories(categoriesRes.data);
          setSizes(sizesRes.data);
          defaultProduct &&
            productSizesRes?.data &&
            setProductSizes(productSizesRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [defaultProduct]);

  if (loading) return <div>جاري التحميل...</div>;
  if (!categories.length || !sizes.length) return <NotFound />;

  return (
    <div className=" overflow-x-clip !max-h-[88vh]">
      <FormProvider
        action={isEdit ? editProductAction : addProductAction}
        className="p-4 pb-0 flex flex-col"
        onSuccess={() => {
          setOpen && setOpen(false);
          onSuccess && onSuccess();
        }}
      >
        <input
          type="text"
          hidden
          name={"product_id"}
          defaultValue={defaultProduct?.id}
        />
        <ImageInput
          className="mx-auto"
          defaultValue={
            defaultProduct?.image
              ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${defaultProduct.image}`
              : undefined
          }
        />
        <FormGroup
          label="إسم المنتج"
          name="title"
          type="text"
          required
          defaultValue={defaultProduct?.title}
        />

        <div className="mt-4">
          <Label htmlFor={"category_id"} className="block text-sm mb-1">
            تصنيف المنتج
            <span className="text-black/40">*</span>
          </Label>
          <select
            name="category_id"
            id="category_id"
            className="w-full"
            defaultValue={defaultProduct?.category_id}
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <Label htmlFor={"category_id"} className="block text-sm mb-1">
            تسعير المنتج
            <span className="text-black/40">*</span>
          </Label>
          {sizes.map((size) => (
            <div
              key={size.id}
              className="flex gap-4 mt-2  border items-center rounded p-2"
            >
              <div className="flex-1 flex-center gap-1">
                <span>{size.weight}</span>
                <span>{size.size == "gm" ? "جرام" : "كيلو"}</span>
              </div>
              <FaMoneyBillTransfer className="flex-1 text-primary text-xl" />
              <Input
                className="flex-1"
                type="text"
                name={`size_id-${size.id}`}
                id=""
                placeholder="السعر"
                required
                defaultValue={
                  productSizes.find((ps: any) => ps.size_id == size.id)?.price
                }
              />
            </div>
          ))}
        </div>

        <FormGroup
          label="وصف المنتج"
          name="description"
          type="text"
          isTextArea
          required
          defaultValue={defaultProduct?.description}
        />

        <SubmitButton
          text={isEdit ? "تعديل المنتج" : "إضافة المنتج"}
          className="mt-4 mb-4"
        />
      </FormProvider>
    </div>
  );
}

export default ProductForm;
