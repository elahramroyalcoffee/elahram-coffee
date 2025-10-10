"use client";
import { CartCountContext } from "@/contexts/CartCountContext";
import { useOneProduct } from "@/hooks/web/useProducts";
import { ProductTypes } from "@/lib/types";
import React, { use, useContext } from "react";
import ProductOrder from "./_components/ProductOrder";

function page({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { count, setCount } = useContext(CartCountContext);
  const { data, loading } = useOneProduct({ productId });
  const product: ProductTypes = data?.product;

  console.log(data);
  if (data)
    return (
      <section className="pt-[180px]">
        <ProductOrder data={data} />
      </section>
    );
}

export default page;
