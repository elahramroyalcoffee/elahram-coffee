import page from "@/app/admin/page";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useRef, useState } from "react";

interface Filters {
  search: string;
  category: null | string;
  page: number;
}

function useProducts() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: null,
    page: 1,
  });

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const totalPagesRef = useRef(1);

  const getProducts = async (filters: Filters) => {
    try {
      setLoading(true);

      const categoriesQuery = supabase.from("categories").select("*");

      const query = supabase
        .from("products")
        .select(
          `
      id,
      title,
      description,
      image,
      in_stock,
      product_sizes (
        price,
        size: sizes (
          id,
          size,
          weight
        )
      )
    `,
          { count: "exact" }
        )
        .eq("in_stock", true);

      if (
        filters.category &&
        filters.category.length > 0 &&
        filters.category != "all"
      ) {
        query.in("category_id", Array(filters.category));
      }

      if (filters.search && !!filters.search.length) {
        query.ilike("title", `%${filters.search}%`);
      }

      // query.limit(6);
      query.order("created_at", { ascending: false });
      query.range(6 * filters.page - 6, 6 * filters.page - 1);

      const [categoriesResponse, productsResonse] = await Promise.all([
        categoriesQuery,
        query,
      ]);

      // const { data } = await query;
      totalPagesRef.current = Math.ceil((productsResonse.count || 0) / 6);

      return {
        categories: categoriesResponse.data,
        products: productsResonse.data,
        count: productsResonse.count,
      };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(filters)
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, [filters]);

  return {
    data,
    loading,
    filters,
    setFilters,
    refetch: () => getProducts(filters),
    totalPages: totalPagesRef.current,
  };
}

export default useProducts;
