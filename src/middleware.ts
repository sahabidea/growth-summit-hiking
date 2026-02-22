import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "owj-admin-2026";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Update Supabase Session
    const { supabaseResponse, user } = await updateSession(request);

    // 2. Protect /admin routes (except /admin/login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const adminToken = request.cookies.get("admin_token")?.value;

        if (adminToken !== ADMIN_PASSWORD) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
