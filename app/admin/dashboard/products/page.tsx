"use client";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import React, { memo, useEffect, useRef, useState } from "react";
import SizesDrawer from "./_components/sizes/SizesDrawer";
import GrindsDrawer from "./_components/grinds/GrindsDrawer";
import AddOnsDrawer from "./_components/add-ons/AddOnsDrawer";
import SearchBar from "./_components/SearchBar";
import AddProduct from "./_components/AddProduct";
import ProductsTable from "./_components/table/ProductsTable";
import { CategoryTypes, ProductTypes } from "@/lib/types";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import PaginationProvider from "./_components/table/PaginationProvider";
import FilterProducts from "./_components/product/FilterProducts";

function page() {
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const totalPagesRef = useRef(1);

  // Filter state
  const [currentFilters, setCurrentFilters] = useState({
    search: "",
    category_id: null as number | null,
  });

  // Page start from 1
  const fetchData = async (
    page: number,
    search: string = "",
    category_id?: number | null
  ) => {
    setLoading(true);
    try {
      // Build the query dynamically
      let productsQuery = supabase.from("products").select(
        `*,
        category: categories(*)`,
        { count: "exact" }
      );

      // Apply search filter if provided
      if (search && search.trim()) {
        productsQuery = productsQuery.ilike("title", `%${search}%`);
      }

      // Apply category filter if provided (and not "all")
      if (category_id && category_id !== null) {
        productsQuery = productsQuery.eq("category_id", category_id);
      }

      // Apply ordering and pagination
      productsQuery = productsQuery
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      const [productsRes, categoriesRes]: any = await Promise.all([
        productsQuery,
        supabase.from("categories").select(),
      ]);

      setCategories(categoriesRes.data || []);

      totalPagesRef.current = Math.ceil((productsRes.count || 0) / 10);
      return productsRes.data;
    } catch (error) {
      console.log(error);
      toast("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const refetch = (
    page: number = currPage,
    search?: string,
    category_id?: number | null
  ) => {
    // Update current filters
    const newFilters = {
      search: search !== undefined ? search : currentFilters.search,
      category_id:
        category_id !== undefined ? category_id : currentFilters.category_id,
    };

    setCurrentFilters(newFilters);

    fetchData(page, newFilters.search, newFilters.category_id).then(
      (data: any) => setProducts(data)
    );
  };

  // Handle filter changes - reset to page 1 when filters change
  const handleFilterChange = (search?: string, category_id?: number | null) => {
    setCurrPage(1);
    refetch(1, search, category_id);
  };

  useEffect(() => {
    refetch(currPage, currentFilters.search, currentFilters.category_id);
  }, [currPage]);

  const MemoSizesDrawer = memo(SizesDrawer);
  const MemoGrindsDrawer = memo(GrindsDrawer);
  const MemoAddOnsDrawer = memo(AddOnsDrawer);

  return (
    <>
      <DashboardPageHeader title="المنتجات" />

      <div className="page-body">
        <div className="flex gap-2 items-stretch flex-col md:flex-row">
          <div className="flex gap-2 w-[302px]">
            <MemoSizesDrawer />
            <MemoGrindsDrawer />
            <MemoAddOnsDrawer />
          </div>
          <SearchBar
            onSearch={(search) =>
              handleFilterChange(search, currentFilters.category_id)
            }
          />
        </div>

        <div className="mt-4 flex-between flex-col lg:flex-row">
          <AddProduct
            onSuccess={() => {
              setCurrPage(1);
              if (currPage === 1) {
                refetch(1, currentFilters.search, currentFilters.category_id);
              }
            }}
          />
          <FilterProducts
            categories={categories}
            onFilter={(category_id) =>
              handleFilterChange(currentFilters.search, category_id)
            }
            currentCategoryId={currentFilters.category_id}
          />
        </div>

        <div>
          <ProductsTable
            products={products}
            refetch={(page = currPage) =>
              refetch(page, currentFilters.search, currentFilters.category_id)
            }
            loading={loading}
          />
          <PaginationProvider
            currPage={currPage}
            totalPages={totalPagesRef.current}
            onPageChange={setCurrPage}
          />
        </div>
      </div>
    </>
  );
}

export default page;
