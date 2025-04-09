import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
// Note: Importing 'cookies' from 'next/headers' is crucial for server components/routes
// import { cookies } from "next/headers"; // No longer needed directly here if createClient handles it

export async function GET() {
  // Create a new Supabase client instance for each request.
  // createClient from server.ts uses cookies() internally.
  // const cookieStore = cookies(); // No longer needed
  const supabase = createClient(); // Correct: Call without arguments

  try {
    // Attempt to get the authenticated user from the session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // If there's an authentication error or no user is found, return Unauthorized
    if (authError || !user) {
      console.error(
        "API Route /api/developer-info: Auth error or no user found.",
        authError,
      );
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated or session expired." },
        { status: 401 },
      );
    }

    // User is authenticated, proceed to fetch developer-specific IDs
    const userId = user.id; // Get user ID
    console.log(
      `API Route /api/developer-info: Authenticated user ID: ${userId}`,
    );

    // Call the Supabase RPC function 'fetch_developer_ids'
    const { data: developerData, error: rpcError } = await supabase.rpc(
      "fetch_developer_ids",
      {
        p_user_id: userId, // Pass the authenticated user's ID
      },
    );

    // Handle errors from the RPC call
    if (rpcError) {
      console.error(
        "API Route /api/developer-info: Error calling fetch_developer_ids RPC:",
        rpcError,
      );
      return NextResponse.json(
        { error: `Failed to fetch developer data: ${rpcError.message}` },
        { status: 500 }, // Use 500 for server-side errors during data fetching
      );
    }

    // Initialize IDs with defaults
    // The user's own ID always serves as their primary merchant ID.
    let merchantId: string = userId; // Use userId here as well
    let organizationId: string | null = null; // Default to null if no organization is found

    // Process the data returned from the RPC function
    if (developerData && developerData.length > 0) {
      // Extract IDs from the first result (assuming one result per user)
      const {
        merchant_id: fetchedMerchantId,
        organization_id: fetchedOrganizationId,
      } = developerData[0];

      // Use fetched merchant_id if available, otherwise stick to user.id
      merchantId = fetchedMerchantId ?? userId; // Use userId fallback
      // Use fetched organization_id if available
      organizationId = fetchedOrganizationId ?? null;

      console.log(
        `API Route /api/developer-info: Fetched IDs - Merchant: ${merchantId}, Organization: ${organizationId}`,
      );
    } else {
      // Log if no specific data was found, indicating fallback to user ID as merchant ID
      console.warn(
        `API Route /api/developer-info: No specific developer data found for user ${userId}. Using user ID as merchant ID.`,
      );
    }

    // Return the determined IDs successfully, including the userId
    return NextResponse.json({ userId, merchantId, organizationId });
  } catch (error) {
    // Catch any unexpected errors during the process
    console.error("API Route /api/developer-info: Unexpected error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// Optional: Add basic OPTIONS handler for CORS preflight requests if needed,
// although usually handled by Next.js or hosting infrastructure.
// export async function OPTIONS() {
//   return new Response(null, {
//     status: 204,
//     headers: {
//       'Allow': 'GET, OPTIONS', // Specify allowed methods
//       // Add CORS headers if required and not handled elsewhere
//       // 'Access-Control-Allow-Origin': '*',
//       // 'Access-Control-Allow-Methods': 'GET, OPTIONS',
//       // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }
