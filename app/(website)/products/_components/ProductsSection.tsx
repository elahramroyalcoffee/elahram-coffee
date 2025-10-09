"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useProducts from "@/hooks/web/useProducts";
import { supabase } from "@/utils/supabase";
import React, { use, useEffect, useState } from "react";

const getCategories = async () => {
  try {
    const { data } = await supabase.from("categories").select("*");
    return data;
  } catch (error) {
    console.log(error);
  }
};

function ProductsSection() {
  const { data, loading, filters, setFilters, refetch } = useProducts();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res))
      .catch((err) => console.log(err));
  }, []);

  console.log(categories);
  return (
    <section className="container flex gap-[70px] py-[50px] mt-[50px] ">
      <div>
        <div>
          <Label htmlFor="search" className="text-xl font-semibold font-cairo">
            بحث عن منتج
          </Label>
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="بحث"
            className="mt-2 w-[200px]"
          />
        </div>

        <div className="mt-10">
          <Label htmlFor="search" className="text-xl font-semibold font-cairo">
            التصنيفات
          </Label>
          {/* <Input
            type="text"
            name="search"
            id="search"
            placeholder="بحث"
            className="mt-2 w-[200px]"
          /> */}
        </div>
      </div>

      <div>Products</div>
    </section>
  );
}

export default ProductsSection;
