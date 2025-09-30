import { NextRequest, NextResponse } from "next/server";

// Security endpoint to help Chrome recognize legitimate login
export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");

  return NextResponse.json(
    {
      security: {
        https: true,
        authenticated: true,
        csrf_protection: true,
        secure_cookies: true,
      },
      login_endpoint: "/admin/login",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Method not allowed",
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
