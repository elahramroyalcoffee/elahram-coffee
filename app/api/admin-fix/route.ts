import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json();

    if (action === "check") {
      // Check if admin user exists and password format
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email, password")
        .eq("email", email)
        .single();

      if (error || !user) {
        return NextResponse.json({
          exists: false,
          error: "User not found",
        });
      }

      return NextResponse.json({
        exists: true,
        user: { id: user.id, email: user.email },
        passwordFormat: {
          length: user.password.length,
          isBcrypt: user.password.startsWith("$2"),
          sample: user.password.substring(0, 10) + "...",
        },
      });
    }

    if (action === "fix") {
      // Create or update admin user with proper password hash
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        // Update existing user
        const { error } = await supabase
          .from("users")
          .update({ password: hashedPassword })
          .eq("email", email);

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: "Admin password updated successfully",
          action: "updated",
        });
      } else {
        // Create new admin user
        const { error } = await supabase.from("users").insert({
          email,
          password: hashedPassword,
          created_at: new Date().toISOString(),
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: "Admin user created successfully",
          action: "created",
        });
      }
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'check' or 'fix'" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin fix error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Admin Fix Utility",
    usage: {
      check: "POST with { action: 'check', email: 'admin@example.com' }",
      fix: "POST with { action: 'fix', email: 'admin@example.com', password: 'newpassword' }",
    },
  });
}
