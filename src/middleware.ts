import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "owj-admin-2026";
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "owj-secret-salt-2026";

/** اعتبارسنجی token ادمین در edge middleware با Web Crypto API */
async function verifyAdminToken(token: string): Promise<boolean> {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [random, hash] = parts;
    const data = new TextEncoder().encode(`${ADMIN_PASSWORD}:${TOKEN_SECRET}:${random}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expected = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hash === expected;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Update Supabase Session
    const { supabaseResponse, user } = await updateSession(request);

    // 2. Protect /admin routes (except /admin/login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const adminToken = request.cookies.get("admin_token")?.value;

        if (!adminToken || !(await verifyAdminToken(adminToken))) {
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
