"use client";
import { useOneProduct } from "@/hooks/web/useProducts";
import { ProductTypes } from "@/lib/types";
import React, { use } from "react";
import ProductOrder from "./_components/ProductOrder";
import SpecialProductsSection from "../../_components/home/SpecialProductsSection";
import ProductPageSkeleton from "@/components/web/products/ProductPageSkeleton";

function page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { data, loading } = useOneProduct({ productId });

  if (loading || !data) return <ProductPageSkeleton />;
  if (data)
    return (
      <section className="pt-[180px]">
        <ProductOrder data={data} />

        <div className="product-information-section">
          <div className="container">
            <div className="font-bold text-center text-2xl text-brown-500">
              الاسترداد والاسترجاع
            </div>

            <div className="text-gray-500 font-cairo text-center mt-8">
              عزيزي العميل, البضاعة المباعة ترد وتستبدل حتى لو فتحت الكيس عادي
              جدا في خلال 3 أيام
            </div>
          </div>
        </div>

        <SpecialProductsSection
          data={data.products}
          title="قد يعجبك أيضًا"
          className="!bg-beige-50 !mt-[74px]"
        />
      </section>
    );
}

export default page;
