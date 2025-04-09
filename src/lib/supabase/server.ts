import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Define shared cookie options function/object
const getCookieOptions = (): CookieOptions => ({
  path: "/",
  domain: process.env.NODE_ENV === "production" ? ".lomi.africa" : undefined,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 50 * 60, // Optional: Consistent with client/middleware
});

export function createClient() {
  const cookieStore = cookies();

  // Create a server client instance specific to this request
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Merge shared options
            cookieStore.set({ name, value, ...getCookieOptions(), ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Merge shared options and ensure deletion
            cookieStore.set({ name, value: "", ...getCookieOptions(), ...options, maxAge: -1 });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      // Pass cookieOptions here as well if the library supports it directly
      // cookieOptions: getCookieOptions(), // Check @supabase/ssr docs
    },
  );
}
