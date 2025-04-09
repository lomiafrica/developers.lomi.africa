import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define shared cookie options function/object if needed, or define inline
const getCookieOptions = (): CookieOptions => ({
  path: "/",
  domain: process.env.NODE_ENV === "production" ? ".lomi.africa" : undefined,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 50 * 60, // Optional: Align with client if necessary
});

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Merge shared options with any specific options passed by Supabase client
          res.cookies.set({
            name,
            value,
            ...getCookieOptions(), // Apply shared domain/path/secure
            ...options, // Supabase might provide httpOnly, etc.
          });
        },
        remove(name: string, options: CookieOptions) {
          // Merge shared options
          res.cookies.set({
            name,
            value: "",
            ...getCookieOptions(), // Apply shared domain/path/secure
            ...options,
            maxAge: -1, // Ensure deletion
          });
        },
      },
      // Pass cookieOptions here as well if the library supports it directly
      // cookieOptions: getCookieOptions(), // Check @supabase/ssr docs if this top-level option exists/is needed
    },
  );

  // Refresh session potentially setting the cookie with correct options
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
