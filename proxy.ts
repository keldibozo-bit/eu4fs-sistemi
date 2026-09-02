import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Mbron çdo rrugë (route) të aplikacionit përveç /login dhe /api/auth/*.
// (Në Next.js 16 ky file quhet "proxy.ts" — ish "middleware.ts".)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth");

  if (isPublic) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
