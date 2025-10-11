"use client";
import { useProducts } from "@/hooks/web/useProducts";
import { ProductTypes } from "@/lib/types";
import ProductsFilter from "./ProductsFilter";
import ProductCard from "@/components/web/products/ProductCard";
import LoadingProductCatd from "@/components/web/products/LoadingProductCatd";
import PaginationProvider from "@/components/web/products/PaginationProvider";
import { useEffect } from "react";

function ProductsSection({ searchCategory }: any) {
  const { data, loading, filters, setFilters, refetch, totalPages } =
    useProducts();

  const onPageChange = (page: number) => {
    setFilters({ ...filters, page });

    setTimeout(() => {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }, 500);
  };

  const defaultSearch = () => {
    const getId = () => {
      switch (searchCategory) {
        case "turkish": {
          return 3;
        }
        case "spresso": {
          return 5;
        }
        case "beans": {
          return 1;
        }
        default: {
          return "all";
        }
      }
    };

    return searchCategory ? getId() : "all";
  };

  useEffect(() => {
    if (searchCategory && defaultSearch() && defaultSearch() != "all") {
      setFilters({ ...filters, category: defaultSearch()?.toString() || "" });
    }
  }, []);

  // console.log(data?.products);
  // console.log(data?.categories);
  // console.log(defaultSearch());
  return (
    <section className="container flex flex-col lg:flex-row gap-[70px] py-[50px] mt-[50px] relative">
      <ProductsFilter
        filters={filters}
        setFilters={setFilters}
        categories={data?.categories}
        defaultSearch={defaultSearch}
      />

      <div>
        <h5 className="text-[23px] font-bold">
          المنتجات المتاحة {!!data?.count && <b>({data?.count})</b>}
        </h5>
        <div className="hidden lg:flex gap-8 flex-wrap mt-8 justify-center md:justify-start items-stretch ">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingProductCatd key={index} />
            ))}
          {!loading &&
            data?.products?.map((product: ProductTypes, index: number) => (
              <ProductCard
                key={index}
                product={product}
                className="h-fit w-[calc(33%-2rem)] min-w-[300px] bg-beige-100"
              />
            ))}
        </div>

        <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingProductCatd key={index} />
            ))}
          {!loading &&
            data?.products?.map((product: ProductTypes, index: number) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>

        <PaginationProvider
          currPage={filters.page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}

export default ProductsSection;
