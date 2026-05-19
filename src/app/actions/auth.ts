"use server";

import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "owj-admin-2026";
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "owj-secret-salt-2026";

/** ساخت یک token امن: hash(password + secret + random) */
function generateAdminToken(): string {
    const random = randomBytes(16).toString("hex");
    const hash = createHash("sha256")
        .update(`${ADMIN_PASSWORD}:${TOKEN_SECRET}:${random}`)
        .digest("hex");
    // فرمت: random.hash — هر دو برای verify نگه داشته می‌شوند
    return `${random}.${hash}`;
}

/** اعتبارسنجی token بدون نگه‌داری state */
function verifyAdminToken(token: string): boolean {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [random, hash] = parts;
    const expected = createHash("sha256")
        .update(`${ADMIN_PASSWORD}:${TOKEN_SECRET}:${random}`)
        .digest("hex");
    // مقایسه ایمن برای جلوگیری از timing attack
    return hash === expected;
}

export async function adminLogin(password: string) {
    if (password === ADMIN_PASSWORD) {
        const token = generateAdminToken();
        const cookieStore = await cookies();
        cookieStore.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 ساعت
            path: "/",
        });
        return { success: true };
    }
    return { success: false, error: "رمز عبور نادرست است." };
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return { success: true };
}

/** تابع کمکی برای بررسی وضعیت ادمین (برای server components) */
export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return false;
    return verifyAdminToken(token);
}
