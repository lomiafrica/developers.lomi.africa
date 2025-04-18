import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Determine if in production based on standard Node.js env or Vercel env
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

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
            // Explicitly add domain and path for cross-subdomain SSO
            cookieStore.set({
              name,
              value,
              ...options,
              domain: IS_PRODUCTION ? ".lomi.africa" : undefined,
              path: "/",
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Explicitly add domain and path for cross-subdomain SSO
            cookieStore.set({
              name,
              value: "",
              ...options,
              domain: IS_PRODUCTION ? ".lomi.africa" : undefined,
              path: "/",
            });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
