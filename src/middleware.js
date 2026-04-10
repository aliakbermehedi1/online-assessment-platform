import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const isEmployerPath =
    path.startsWith("/employer") && !path.includes("/login");
  const isCandidatePath =
    path.startsWith("/candidate") && !path.includes("/login");

  if (isEmployerPath || isCandidatePath) {
    if (!token) {
      const loginPath = isEmployerPath ? "/employer/login" : "/candidate/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      const loginPath = isEmployerPath ? "/employer/login" : "/candidate/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    if (isEmployerPath && decoded.role !== "employer") {
      return NextResponse.redirect(
        new URL("/candidate/dashboard", request.url),
      );
    }

    if (isCandidatePath && decoded.role !== "candidate") {
      return NextResponse.redirect(new URL("/employer/dashboard", request.url));
    }
  }

  // Already logged in, redirect away from login pages
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      if (path === "/employer/login" && decoded.role === "employer") {
        return NextResponse.redirect(
          new URL("/employer/dashboard", request.url),
        );
      }
      if (path === "/candidate/login" && decoded.role === "candidate") {
        return NextResponse.redirect(
          new URL("/candidate/dashboard", request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/employer/:path*", "/candidate/:path*"],
};
