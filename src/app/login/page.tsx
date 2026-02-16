"use client";

import { useState } from "react";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth-user";
import { Mountain, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Pending states are handled by the transition of the action, 
    // but simpler to use local loading state for UI feedback if using standard forms
    // For now using simple client-side wrapping or just form actions.
    // Next.js 15+ has useActionState, Next.js 14 has useFormState.
    // Assuming Next.js 14/15 env based on package.json (Next 16 alpha/beta was in package.json? Step 30: "next": "16.1.6")
    // Next 16 uses functions directly.

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                const res = await login(formData);
                if (res?.error) setMessage(res.error);
            } else {
                const res = await signup(formData);
                if (res?.error) setMessage(res.error);
                else if (res?.success) setMessage(res.message);
            }
        } catch (e) {
            setMessage("یک خطای غیرمنتظره رخ داد.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <Link href="/" className="mb-8 flex items-center gap-3 hover:scale-105 transition-transform">
                <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Mountain className="h-8 w-8 text-slate-950" />
                </div>
                <span className="font-display text-4xl text-white">اوجِ رشد</span>
            </Link>

            <div className="bg-slate-900 border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="flex gap-4 mb-8 bg-slate-950/50 p-1 rounded-xl relative z-10">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-center rounded-lg text-sm font-bold transition-all ${isLogin ? "bg-emerald-500 text-slate-950 shadow-lg" : "text-white/50 hover:text-white"
                            }`}
                    >
                        ورود
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-center rounded-lg text-sm font-bold transition-all ${!isLogin ? "bg-emerald-500 text-slate-950 shadow-lg" : "text-white/50 hover:text-white"
                            }`}
                    >
                        ثبت‌نام
                    </button>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-4 relative z-10">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="text-xs text-white/50 mb-1.5 block pr-1">نام و نام خانوادگی</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    placeholder="مثال: علی رضایی"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/50 mb-1.5 block pr-1">شماره تماس</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-left dir-ltr"
                                    placeholder="0912..."
                                    style={{ direction: 'ltr' }}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="text-xs text-white/50 mb-1.5 block pr-1">ایمیل</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-left dir-ltr"
                            placeholder="example@mail.com"
                            style={{ direction: 'ltr' }}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-white/50 mb-1.5 block pr-1">رمز عبور</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-left dir-ltr"
                            placeholder="••••••••"
                            style={{ direction: 'ltr' }}
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl text-sm ${message.includes("تایید") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-emerald-500 text-slate-950 py-3.5 rounded-xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "ورود به حساب" : "ایجاد حساب")}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors">
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    );
}
