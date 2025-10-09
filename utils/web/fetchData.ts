"use server";

import { supabase } from "../supabase";

export const getProducts = async () => {
  try {
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
  }
};
