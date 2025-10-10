import PageHeader from "@/components/web/global/PageHeader";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductsSection from "./_components/ProductsSection";

async function ProductsPage({ searchParams }: any) {
  const { category: searchCategory } = await searchParams;
  return (
    <main className="bg-beige-50">
      <PageHeader
        title="المنتجات"
        description="تشكيلة البن المختارة بعناية لإسعادكم"
      />

      <ProductsSection searchCategory={searchCategory} />
    </main>
  );
}

export default ProductsPage;
