import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    console.log("🔧 Debug API - Testing login for:", email);

    // Test environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "✅ Set"
        : "❌ Missing",
      SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "✅ Set"
        : "❌ Missing",
    };

    console.log("🌍 Environment check:", envCheck);

    // Test Supabase connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (connectionError) {
      console.error("❌ Supabase connection failed:", connectionError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: connectionError.message,
          env: envCheck,
        },
        { status: 500 }
      );
    }

    // Test user lookup
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, password")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        {
          error: "User not found",
          details: userError?.message || "No user with this email",
          env: envCheck,
        },
        { status: 404 }
      );
    }

    // Test password comparison
    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("🔐 Password test result:", passwordMatch);

    return NextResponse.json({
      success: passwordMatch,
      message: passwordMatch ? "Login would succeed" : "Password mismatch",
      user: { id: user.id, email: user.email },
      env: envCheck,
      bcryptTest: {
        provided: password.length + " chars",
        stored: user.password.length + " chars",
        startsWithBcrypt: user.password.startsWith("$2"),
      },
    });
  } catch (error: any) {
    console.error("❌ Debug API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check environment
export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "✅ Set"
      : "❌ Missing",
    timestamp: new Date().toISOString(),
  });
}
