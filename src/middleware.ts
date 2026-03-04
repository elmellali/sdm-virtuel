import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAuthPage = request.nextUrl.pathname.startsWith("/admin/login");

    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return null;
    }

    if (!token) {
        let from = request.nextUrl.pathname;
        if (request.nextUrl.search) {
            from += request.nextUrl.search;
        }

        return NextResponse.redirect(
            new URL(`/admin/login?from=${encodeURIComponent(from)}`, request.url)
        );
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};
