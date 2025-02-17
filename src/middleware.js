import { NextResponse } from "next/server";

const redirects = {
  "/introduction/getting-started": "/introduction/what-is-lomi",
  "/license-management/license-management": "/license-management/overview",
};

export function middleware(request) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (redirects[path]) {
    url.pathname = redirects[path];
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/introduction/getting-started", "/license-management/license-management"]
};
