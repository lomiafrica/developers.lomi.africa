import { createBrowserClient } from "@supabase/ssr";

// Use NEXT_PUBLIC_ variables for client-side code in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Basic check for variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create and export the browser client instance with cookie options for SSO
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookieOptions: {
    // Conditionally set domain ONLY in production builds for SSO
    domain: process.env.BUN_ENV === "production" ? ".lomi.africa" : undefined,
    path: "/",
    sameSite: "lax",
    // Ensure 'secure' is true ONLY in production (requires HTTPS)
    secure: process.env.BUN_ENV === "production",
    maxAge: 50 * 60, // Match the website app's setting
  },
});