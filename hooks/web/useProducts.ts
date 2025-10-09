import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";

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

  const getProducts = async (filters: Filters) => {
    try {
      setLoading(true);
      const { data } = await supabase
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
    `
        )
        .limit(10);
      return data;
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
  };
}

export default useProducts;
