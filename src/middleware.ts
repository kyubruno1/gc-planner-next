import { getToken } from "next-auth/jwt"; // PARA middleware
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Use getToken para pegar o token JWT da sessão
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  const protectedPaths = ["/planner", "/equip", "/minha-conta"];

  if (protectedPaths.some(path => url.pathname.startsWith(path))) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/planner/:path*", "/equip/:path*", "/minha-conta/:path*"],
};
