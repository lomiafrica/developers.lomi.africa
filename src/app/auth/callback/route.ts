import { createClient } from "@/lib/supabase/server"; // Use the server client
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  // Log the received code and origin for debugging
  console.log("Callback received code:", code);
  console.log("Callback origin:", origin);

  if (code) {
    const supabase = createClient(); // Create server client instance
    try {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError);
        // Redirect back to an error page or the sign-in page with an error message
        return NextResponse.redirect(
          `${origin}/error?message=Authentication failed: ${encodeURIComponent(exchangeError.message)}`,
        );
      }
      // Session cookie should be set automatically by the server client + middleware
      console.log("Session successfully exchanged and cookie should be set.");

      // Redirect to the desired page after successful login
      // TODO: Check if user needs onboarding or other specific redirects
      return NextResponse.redirect(`${origin}/docs/introduction/what-is-lomi`);
    } catch (error) {
      console.error("Unexpected error during code exchange:", error);
      return NextResponse.redirect(
        `${origin}/error?message=An unexpected error occurred during authentication.`,
      );
    }
  }

  // Redirect if no code is present (e.g., user navigated here directly)
  console.warn("Callback route accessed without a code.");
  return NextResponse.redirect(`${origin}/`); // Redirect to home or sign-in
}
