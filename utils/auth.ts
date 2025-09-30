"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: number;
  email: string;
}

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return { message: error.message };
    // redirect("/error");
  }
  // revalidatePath("/admin", "layout");
  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  console.log(error);
  redirect("/admin/login");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export const getAdminUser = async (): Promise<AdminUser | null> => {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("admin_user");

    if (!userCookie?.value) {
      return null;
    }

    const user = JSON.parse(userCookie.value) as AdminUser;
    return user;
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
};

export const getAdminToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("admin_token");

    return tokenCookie?.value || null;
  } catch (error) {
    console.error("Error getting admin token:", error);
    return null;
  }
};
