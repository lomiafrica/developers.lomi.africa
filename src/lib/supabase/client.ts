import { createBrowserClient } from '@supabase/ssr'

// Create and export the browser client instance directly
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
); 