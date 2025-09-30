// Custom Auth API Route for security compliance
import { NextRequest, NextResponse } from "next/server";

// This route helps Chrome understand your login is legitimate
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: "Authentication endpoint active",
      secure: true,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Use the main login form",
    },
    { status: 405 }
  );
}
