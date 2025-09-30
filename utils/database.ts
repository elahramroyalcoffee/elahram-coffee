import { supabase } from "./supabase";

// ============================================
// CATEGORIES MANAGEMENT
// ============================================

export interface Category {
  id?: number;
  title: string;
  image?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Get all categories
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get categories with pagination
export const getCategoriesPaginated = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("categories")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get single category
export const getCategory = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Add new category
export const addCategory = async (
  category: Omit<Category, "id" | "created_at" | "updated_at">
) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Update category
export const updateCategory = async (
  id: number,
  category: Partial<Category>
) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Delete category
export const deleteCategory = async (id: number) => {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

export interface Product {
  id?: number;
  title: string;
  image?: string;
  description?: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface ProductSize {
  id?: number;
  product_id: number;
  size: string;
  price: number;
  created_at?: string;
}

// Get all products with categories
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get products with pagination
export const getProductsPaginated = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        product_sizes(*)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Get single product with sizes
export const getProduct = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        product_sizes(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Add new product
export const addProduct = async (
  product: Omit<Product, "id" | "created_at" | "updated_at">
) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Update product
export const updateProduct = async (id: number, product: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Delete product
export const deleteProduct = async (id: number) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// ============================================
// PRODUCT SIZES MANAGEMENT
// ============================================

// Get sizes for a product
export const getProductSizes = async (productId: number) => {
  try {
    const { data, error } = await supabase
      .from("product_sizes")
      .select("*")
      .eq("product_id", productId)
      .order("price", { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Add product size
export const addProductSize = async (
  size: Omit<ProductSize, "id" | "created_at">
) => {
  try {
    const { data, error } = await supabase
      .from("product_sizes")
      .insert([size])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Update product size
export const updateProductSize = async (
  id: number,
  size: Partial<ProductSize>
) => {
  try {
    const { data, error } = await supabase
      .from("product_sizes")
      .update(size)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Delete product size
export const deleteProductSize = async (id: number) => {
  try {
    const { error } = await supabase
      .from("product_sizes")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export default {
  // Categories
  getCategories,
  getCategoriesPaginated,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,

  // Products
  getProducts,
  getProductsPaginated,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,

  // Product Sizes
  getProductSizes,
  addProductSize,
  updateProductSize,
  deleteProductSize,
};
