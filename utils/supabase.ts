import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";

// Create a single supabase client for interacting with your database
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);

// Generate a simple token
// const generateToken = () => {
//   return Math.random().toString(36).substring(2) + Date.now().toString(36);
// };

// Simple auth functions
// export const signIn = async (email: string, password: string) => {
//   try {
//     // Get user from database
//     const { data: user, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();

//     if (error || !user) {
//       return { success: false, error: "Invalid email or password" };
//     }

//     // Check password
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return { success: false, error: "Invalid email or password" };
//     }

//     // Generate token
//     const token = generateToken();

//     // Update user with token
//     await supabase.from("users").update({ token }).eq("id", user.id);

//     // Save token to cookies (accessible on server)
//     Cookies.set("admin_token", token, { expires: 7 }); // 7 days
//     Cookies.set(
//       "admin_user",
//       JSON.stringify({ id: user.id, email: user.email }),
//       { expires: 7 }
//     );

//     return { success: true, user: { id: user.id, email: user.email }, token };
//   } catch (error) {
//     return { success: false, error: "Login failed" };
//   }
// };

export const signOut = () => {
  // Remove cookies
  Cookies.remove("admin_token");
  Cookies.remove("admin_user");
};

export const isAuthenticated = () => {
  // Check if token exists in cookies
  return Cookies.get("admin_token") !== undefined;
};

export const getCurrentUser = () => {
  const userStr = Cookies.get("admin_user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return Cookies.get("admin_token");
};

// Server-side auth check (for middleware and server components)
export const verifyToken = async (token: string) => {
  if (!token) return null;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("token", token)
      .single();

    return error ? null : user;
  } catch {
    return null;
  }
};

// Function to hash password (for creating admin user)
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
