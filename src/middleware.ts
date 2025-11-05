import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Only protect dashboard pages
  if (isProtectedRoute(req)) auth().protect();

  // Preserve your x-current-path header
  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.pathname);

  return NextResponse.next({ headers });
});

export const config = {
  matcher: [
    // Everything except _next/static, public assets, Clerk auth pages
    "/((?!_next|.*\\..*|sign-in|sign-up).*)",
    // Explicitly include API and tRPC routes
    "/(api|trpc)(.*)",
  ],
};
