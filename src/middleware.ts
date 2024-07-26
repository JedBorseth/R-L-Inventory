import {
  clerkMiddleware,
  createRouteMatcher,
  Session,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  const headers = new Headers(req.headers);
  // Add a new header x-current-path which passes the path to downstream components
  headers.set("x-current-path", req.nextUrl.pathname);
  return NextResponse.next({ headers });
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
