import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
	const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

	// Protect routes that start with /admin
	if (isAdminRoute) {
		// Check for NextAuth session cookie (NextAuth v5 uses authjs.session-token)
		// Also check for __Secure- prefix in production and other common patterns
		const sessionToken =
			req.cookies.get("authjs.session-token")?.value ||
			req.cookies.get("__Secure-authjs.session-token")?.value ||
			req.cookies.get("next-auth.session-token")?.value ||
			req.cookies.get("__Secure-next-auth.session-token")?.value;

		if (!sessionToken) {
			const loginUrl = new URL("/login", req.url);
			loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
