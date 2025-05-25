import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pagePaths from "./urlPaths/pagePaths";
export async function middleware(req: NextRequest) {
	const token = req.cookies.has("refresh-token");
	const { pathname } = req.nextUrl;

	// Allow the requests if the token exists
	if (token) {
		return NextResponse.next();
	}

	// Redirect them to login if they don't have a token AND are requesting a protected route
	if (!token && pathname !== "/login") {
		return NextResponse.redirect(new URL(pagePaths.loginPage, req.url));
	}
}

export const config = {
	matcher: "/user/:path*",
};
