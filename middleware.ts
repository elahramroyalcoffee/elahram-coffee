import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyToken } from "@/utils/supabase";
// import { updateSession } from "./utils/supabase/middleware";

// export async function middleware(request: NextRequest) {
//   // Check if accessing admin routes
//   // if (request.nextUrl.pathname.startsWith("/admin")) {
//   //   // Allow access to login page
//   //   if (request.nextUrl.pathname === "/admin/login") {
//   //     return NextResponse.next();
//   //   }

//   //   // Check for auth token in cookies
//   //   const token = request.cookies.get("admin_token")?.value;

//   //   if (!token) {
//   //     // Redirect to login if no token
//   //     return NextResponse.redirect(new URL("/admin/login", request.url));
//   //   }

//   //   // Verify token with database
//   //   const user = await verifyToken(token);

//   //   if (!user) {
//   //     // Redirect to login if invalid token
//   //     const response = NextResponse.redirect(
//   //       new URL("/admin/login", request.url)
//   //     );
//   //     // Clear invalid token
//   //     response.cookies.delete("admin_token");
//   //     response.cookies.delete("admin_user");
//   //     return response;
//   //   }
//   // }

//   return await updateSession(request);
//   // return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
