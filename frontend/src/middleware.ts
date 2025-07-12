import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pagePaths from "./urlPaths/pagePaths";

export async function middleware(req: NextRequest) {
	const token = req.cookies.has("refresh-token");
	const { pathname } = req.nextUrl;

	// Redirect logged-in users away from login and signup pages
	if (token && (pathname === "/login" || pathname === "/signup")) {
		return NextResponse.redirect(
			new URL(pagePaths.homePage || "/user", req.url)
		);
	}

	// Allow the requests if the token exists
	if (token) {
		return NextResponse.next();
	}

	// Redirect them to login if they don't have a token AND are requesting a protected route
	if (!token && pathname !== "/login" && pathname !== "/signup") {
		return NextResponse.redirect(new URL(pagePaths.loginPage, req.url));
	}
}

export const config = {
	matcher: ["/user/:path*", "/login", "/signup"],
};
