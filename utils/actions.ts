"use server";

import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import {
  addCategorySchema,
  addOnsSchema,
  editCategorySchema,
  grindsSchema,
  sizesSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const renderError = (error: any) => {
  return {
    message: error instanceof Error ? error.message : "Some error occurred!",
  };
};

const renderZodErrors = (errors: any) => {
  const errorsArray = JSON.parse(errors);
  return { message: errorsArray.map((error: any) => error.message).join(", ") };
};

const uploadFile = async (file: any) => {
  const fileResponse = await supabase.storage
    .from("categories")
    .upload(
      `/${file.name.match(/\w/g).join("")}-${new Date().getTime()}`,
      file,
      {
        cacheControl: "3600",
        upsert: false,
      }
    );

  if (fileResponse.error) throw new Error(fileResponse.error.message);

  return fileResponse.data?.fullPath || "";
};

const updateImage = async (rawData: any) => {
  const isOldImage =
    typeof rawData.image == "object" && rawData.image.size == 0;

  const isNewImage = typeof rawData.image == "object" && rawData.image.size > 0;

  if (isOldImage || !isNewImage) {
    delete rawData.image;
  }

  if (isNewImage) {
    const filePath = (await uploadFile(rawData.image)) as string;
    rawData.image = filePath;
  }
};

export const signInAction = async (prevState: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const email = rawData.email as string;
  const password = rawData.password as string;

  console.log("🔐 Sign in attempt for:", email);
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log(
    "🔗 Supabase URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..."
  );

  // Security checks
  if (!email || !password) {
    return { message: "Email and password are required" };
  }

  // Honeypot check for bot protection
  if (rawData.website) {
    return { message: "Invalid request" };
  }

  try {
    // Test Supabase connection first
    const { data: connectionTest, error: connectionError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (connectionError) {
      console.error("❌ Supabase connection error:", connectionError);
      return { message: "Database connection failed. Please try again." };
    }

    console.log("✅ Supabase connection successful");

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("👤 User query result:", {
      found: !!user,
      error: error?.message,
    });

    if (error) {
      console.error("❌ Database query error:", error);
      return { message: "Invalid email or password" };
    }

    if (!user) {
      console.log("❌ No user found with email:", email);
      return { message: "Invalid email or password" };
    }

    console.log("🔍 Found user:", { id: user.id, email: user.email });
    console.log("🔐 Comparing passwords...");

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("🔐 Password match result:", passwordMatch);

    if (!passwordMatch) {
      console.log("❌ Password mismatch for user:", email);
      return { message: "Invalid email or password" };
    }

    console.log("✅ Authentication successful for:", email);

    const token = generateToken();

    await supabase.from("users").update({ token }).eq("id", user.id);

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    cookieStore.set(
      "admin_user",
      JSON.stringify({ id: user.id, email: user.email }),
      {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      }
    );

    console.log("🍪 Cookies set successfully");
  } catch (error) {
    console.error("❌ Sign in error:", error);
    return renderError(error);
  }

  console.log("🚀 Redirecting to dashboard");
  redirect("/admin/dashboard");
};

export const signOutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("admin_user");

  redirect("/admin/login");
};

export const addCategoryAction = async (prevState: any, formData: FormData) => {
  try {
    let rawData = Object.fromEntries(formData);

    const filePath = (await uploadFile(rawData.image)) as string;
    rawData.image = filePath;

    const zodValidation = addCategorySchema.safeParse(rawData);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    await supabase.from("categories").insert(rawData);

    revalidatePath("/admin/dashboard/categories");
    return { message: "تم بنجاح اضافة التصنيف" };
  } catch (error) {
    return renderError(error);
  }
};

export const editCategoryAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    let rawData = Object.fromEntries(formData);

    const zodValidation = editCategorySchema.safeParse(rawData);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    await updateImage(rawData);

    const response = await supabase
      .from("categories")
      .update(rawData)
      .eq("id", rawData.id);

    revalidatePath("/admin/dashboard/categories");
    return { message: "تم تعديل التصنيف بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteCategoryAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const response = await supabase
      .from("categories")
      .delete()
      .eq("id", formData.get("id"));

    revalidatePath("/admin/dashboard/categories");
    return { message: "تم مسح التصنيف بنجاح." };
  } catch (error) {
    return renderError(error);
  }
};

export const editSizeAction = async (prevState: any, formData: FormData) => {
  try {
    const sizeID = JSON.parse(formData.get("size_id") as string);
    const newSize = JSON.parse(formData.get("new_size") as string);

    const zodValidation = sizesSchema.safeParse(newSize);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    const res = await supabase.from("sizes").update(newSize).eq("id", sizeID);
    // revalidatePath("/admin/dashboard/products");
    return { message: "تم تعديل الحجم بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteSizeAction = async (prevState: any, formData: FormData) => {
  try {
    const sizeID = JSON.parse(formData.get("size_id") as string);
    const res = await supabase.from("sizes").delete().eq("id", sizeID);
    return { message: "تم مسح الحجم بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const addSizeAction = async (prevState: any, formData: FormData) => {
  try {
    const newSize = JSON.parse(formData.get("new_size") as string);

    const zodValidation = sizesSchema.safeParse(newSize);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    const res = await supabase.from("sizes").insert(newSize);
    return { message: "تم إضافة الحجم بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

// Grind Actions
export const editGrindAction = async (prevState: any, formData: FormData) => {
  try {
    const grindID = JSON.parse(formData.get("grind_id") as string);
    const newGrind = JSON.parse(formData.get("new_grind") as string);

    const zodValidation = grindsSchema.safeParse(newGrind);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    const res = await supabase
      .from("grinds")
      .update(newGrind)
      .eq("id", grindID);
    revalidatePath("/admin/dashboard/products");
    return { message: "تم تعديل الطحنة بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteGrindAction = async (prevState: any, formData: FormData) => {
  try {
    const grindID = JSON.parse(formData.get("grind_id") as string);
    const res = await supabase.from("grinds").delete().eq("id", grindID);
    return { message: "تم مسح الطحنة بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const addGrindAction = async (prevState: any, formData: FormData) => {
  try {
    const newGrind = JSON.parse(formData.get("new_grind") as string);

    const zodValidation = grindsSchema.safeParse(newGrind);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    const res = await supabase.from("grinds").insert(newGrind);
    return { message: "تم إضافة الطحنة بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

// AddOn Actions
export const editAddOnAction = async (prevState: any, formData: FormData) => {
  try {
    const addOnID = JSON.parse(formData.get("addon_id") as string);
    const newAddOn = JSON.parse(formData.get("new_addon") as string);

    const zodValidation = addOnsSchema.safeParse(newAddOn);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    const res = await supabase
      .from("add_ons")
      .update(newAddOn)
      .eq("id", addOnID);
    return { message: "تم تعديل الإضافة بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteAddOnAction = async (prevState: any, formData: FormData) => {
  try {
    const addOnID = JSON.parse(formData.get("addon_id") as string);
    const res = await supabase.from("add_ons").delete().eq("id", addOnID);
    return { message: "تم مسح الإضافة بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const addAddOnAction = async (prevState: any, formData: FormData) => {
  try {
    const newAddOn = JSON.parse(formData.get("new_addon") as string);
    console.log(newAddOn);

    const zodValidation = addOnsSchema.safeParse(newAddOn);
    if (!zodValidation.success) return renderZodErrors(zodValidation.error);

    const res = await supabase.from("add_ons").insert(newAddOn);
    return { message: "تم إضافة الإضافة بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const addProductAction = async (prevState: any, formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData);
    const title = rawData.title as string;
    const description = rawData.description as string;
    const category_id = rawData.category_id as string;
    const image = (await uploadFile(rawData.image)) as string;
    const sizesPricing: {
      product_id: string;
      size_id: string;
      price: string;
    }[] = [];

    const { data } = await supabase
      .from("products")
      .insert({ image, title, description, category_id })
      .select()
      .single();

    const product_id = data.id;

    Object.keys(rawData).forEach((key) => {
      if (key.startsWith("size_id-")) {
        const size_id = key.split("size_id-")[1];
        const price = rawData[key] as string;
        sizesPricing.push({ product_id, size_id, price });
      }
    });

    const response = await supabase
      .from("product_sizes")
      .insert([...sizesPricing]);

    revalidatePath("/admin/dashboard/products");
    return { message: "تم إضافة منتج جديد بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const changeStockAction = async (productId: any, inStock: boolean) => {
  try {
    console.log(productId, inStock);
    const { data } = await supabase
      .from("products")
      .update({ in_stock: inStock })
      .eq("id", productId);

    return { message: "تم تغيير حالة المنتج بنجاح" };
  } catch (error) {
    console.log(error);
    return renderError(error);
  }
};

export const editProductAction = async (prevState: any, formData: FormData) => {
  try {
    let rawData = Object.fromEntries(formData);
    const title = rawData.title as string;
    const description = rawData.description as string;
    const category_id = rawData.category_id as string;
    const product_id = rawData.product_id as string;
    // const image = (await uploadFile(rawData.image)) as string;
    await updateImage(rawData);
    const sizesPricing: {
      product_id: string;
      size_id: string;
      price: string;
    }[] = [];

    const { data } = await supabase
      .from("products")
      .update({ image: rawData.image, title, description, category_id })
      .eq("id", product_id);

    // const product_id = data.id;

    Object.keys(rawData).forEach((key) => {
      if (key.startsWith("size_id-")) {
        const size_id = key.split("size_id-")[1];
        const price = rawData[key] as string;
        sizesPricing.push({ product_id, size_id, price });
      }
    });

    const response = await supabase
      .from("product_sizes")
      .upsert([...sizesPricing]);

    revalidatePath("/admin/dashboard/products");
    return { message: "تم تعديل المنتج بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const deleteProductAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const id = rawData.product_id as string;

    await supabase.from("products").delete().eq("id", id);
    revalidatePath("/admin/dashboard/products");
    return { message: "تم مسح المنتج بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

// Shipment Actions
export const updateShipmentPriceAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const id = rawData.shipment_id as string;
    const price = parseFloat(rawData.price as string);

    if (isNaN(price) || price < 0) {
      return { message: "يرجى إدخال سعر صحيح" };
    }

    await supabase
      .from("shipments")
      .update({
        price,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    revalidatePath("/admin/dashboard/settings");
    return { message: "تم تحديث سعر الشحن بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateAllShipmentPricesAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const price = parseFloat(rawData.price as string);

    if (isNaN(price) || price < 0) {
      return { message: "يرجى إدخال سعر صحيح" };
    }

    await supabase
      .from("shipments")
      .update({
        price,
        updated_at: new Date().toISOString(),
      })
      .neq("id", 0); // Update all records

    revalidatePath("/admin/dashboard/settings");
    return { message: "تم تحديث جميع أسعار الشحن بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const toggleShipmentStatusAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const id = rawData.shipment_id as string;
    const isActive = rawData.is_active === "true";

    await supabase
      .from("shipments")
      .update({
        is_active: !isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    revalidatePath("/admin/dashboard/settings");
    return { message: `تم ${!isActive ? "تفعيل" : "إلغاء"} الشحن بنجاح` };
  } catch (error) {
    return renderError(error);
  }
};

// Payment Actions
export const updatePaymentMethodAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const id = rawData.payment_method_id as string;
    const settings = JSON.parse(rawData.settings as string);

    await supabase
      .from("payment_settings")
      .update({
        settings,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    revalidatePath("/admin/dashboard/payments");
    return { message: "تم تحديث إعدادات الدفع بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const togglePaymentMethodAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const id = rawData.payment_method_id as string;
    const isEnabled = rawData.is_enabled === "true";

    await supabase
      .from("payment_settings")
      .update({
        is_enabled: !isEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    revalidatePath("/admin/dashboard/payments");
    return {
      message: `تم ${!isEnabled ? "تفعيل" : "إلغاء تفعيل"} وسيلة الدفع بنجاح`,
    };
  } catch (error) {
    return renderError(error);
  }
};

// Refund Actions
export const updateRefundStatusAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const refundId = rawData.refund_id as string;
    const newStatus = rawData.new_status as string;

    const { error } = await supabase
      .from("refunds")
      .update({
        refund_status: newStatus,
      })
      .eq("id", refundId);

    if (error) throw error;

    revalidatePath("/admin/dashboard/refunds");
    return { message: "تم تحديث حالة المرتجع بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

export const createRefundAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const orderId = rawData.order_id as string;
    const customerPhone = rawData.customer_phone as string;

    if (!orderId || !customerPhone) {
      return { message: "رقم الطلب ورقم الهاتف مطلوبان" };
    }

    // Check if order exists and belongs to the phone number
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_phone")
      .eq("id", orderId)
      .eq("customer_phone", customerPhone)
      .single();

    if (orderError || !order) {
      return { message: "الطلب غير موجود أو رقم الهاتف غير صحيح" };
    }

    // Check if refund already exists
    const { data: existingRefund } = await supabase
      .from("refunds")
      .select("id")
      .eq("order_id", orderId)
      .single();

    if (existingRefund) {
      return { message: "يوجد بالفعل طلب استرداد لهذا الطلب" };
    }

    // Create refund
    const { error } = await supabase.from("refunds").insert({
      order_id: orderId,
      customer_phone: customerPhone,
      refund_status: "pending",
    });

    if (error) throw error;

    revalidatePath("/admin/dashboard/refunds");
    return { message: "تم إنشاء طلب الاسترداد بنجاح" };
  } catch (error) {
    return renderError(error);
  }
};

// Order Status Actions
export const updateOrderStatusAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const orderId = rawData.order_id as string;
    const newStatus = rawData.new_status as "pending" | "done";

    if (!["pending", "done"].includes(newStatus)) {
      return { message: "حالة غير صحيحة" };
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
      })
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/dashboard/orders");
    return {
      message: `تم تحديث حالة الطلب إلى ${
        newStatus === "done" ? "مكتمل" : "قيد الانتظار"
      }`,
    };
  } catch (error) {
    return renderError(error);
  }
};
