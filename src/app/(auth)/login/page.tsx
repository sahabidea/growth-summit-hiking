"use client";

import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { loginWithPassword } from "@/app/actions/auth-password";
import { sendOtp, verifyOtp } from "@/app/actions/auth-otp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Smartphone, Mail, Loader2, Play, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"password" | "sms">("password");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // SMS specific state
    const [phone, setPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordLogin = async (formData: FormData) => {
        setLoading(true);
        setMessage("");

        const res = await loginWithPassword(formData);

        if (res.success) {
            router.push("/dashboard");
        } else {
            setMessage(res.error || "Login failed");
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!phone) return setMessage("شماره موبایل را وارد کنید.");
        setLoading(true);
        setMessage("");

        const res = await sendOtp(phone, "login");
        setLoading(false);

        if (res.success) {
            setOtpSent(true);
            setMessage("کد با موفقیت ارسال شد.");
        } else {
            setMessage(res.error || "خطا در ارسال کد.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode) return setMessage("کد را وارد کنید.");
        setLoading(true);

        const res = await verifyOtp(phone, otpCode, "login");

        if (res.success) {
            router.push("/dashboard");
        } else {
            setMessage(res.error || "خطا در بررسی کد.");
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="خوش آمدید"
            subtitle="برای شروع صعود، وارد حساب کاربری خود شوید."
        >
            <div className="flex gap-3 mb-8 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 relative">
                <button
                    onClick={() => setMode("password")}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${mode === "password"
                        ? "bg-white text-slate-950 shadow-lg shadow-white/10"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                >
                    رمز عبور
                </button>
                <button
                    onClick={() => setMode("sms")}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${mode === "sms"
                        ? "bg-white text-slate-950 shadow-lg shadow-white/10"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                >
                    پیامک (OTP)
                </button>
            </div>

            {mode === "password" ? (
                <form action={handlePasswordLogin} className="space-y-6">
                    <div className="space-y-5">
                        <div className="relative group">
                            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                            <input
                                name="identifier"
                                type="text"
                                placeholder="ایمیل یا شماره موبایل"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-14 py-5 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all text-white placeholder:text-white/20 font-bold text-lg"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="رمز عبور"
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-14 py-5 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all text-white placeholder:text-white/20 font-bold text-lg"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm font-bold">
                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-md border border-white/20 bg-slate-950 checked:bg-amber-500 checked:border-amber-500 transition-all" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none text-slate-950">
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>
                                </div>
                            </div>
                            <span className="text-white/40 group-hover:text-white transition-colors">مرا به خاطر بسپار</span>
                        </label>
                        <a href="#" className="text-white/40 hover:text-amber-400 transition-colors">فراموشی رمز؟</a>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)] text-white font-black text-xl py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:grayscale flex items-center justify-center gap-3 group"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                            <>
                                <span>ورود به حساب</span>
                                <Play className="w-5 h-5 fill-current rotate-180 group-hover:-translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <div className="space-y-6">
                    {!otpSent ? (
                        <div className="space-y-5">
                            <div className="relative group">
                                <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="شماره موبایل (مثلا 0912...)"
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-14 py-5 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all text-white placeholder:text-white/20 font-bold text-lg text-left ltr"
                                    dir="ltr"
                                />
                            </div>
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-white text-slate-950 font-black text-xl py-5 rounded-2xl shadow-lg hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "ارسال کد تایید"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-white/60 mb-2 font-bold text-sm">کد ارسال شده به <span className="text-white font-mono dir-ltr inline-block">{phone}</span></p>
                                <button onClick={() => setOtpSent(false)} className="text-amber-400 text-xs font-black hover:text-amber-300 transition-colors border-b border-amber-400/30 pb-0.5">تغییر شماره</button>
                            </div>
                            <div className="flex justify-center gap-3" dir="ltr">
                                <input
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full tracking-[1.5rem] text-center text-4xl font-black bg-slate-950/50 border border-white/10 rounded-2xl py-6 focus:outline-none focus:border-amber-500 focus:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all text-amber-400 placeholder-white/5"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)] text-white font-black text-xl py-5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "تایید و ورود"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {message && (
                <div className={`p-4 rounded-2xl text-center text-sm font-bold border ${message.includes("موفق") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                    {message}
                </div>
            )}

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-slate-900 px-4 text-white/20">یا ثبت نام با</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-center px-4 py-4 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all gap-3 text-white/60 font-bold group">
                    <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    حساب گوگل
                </button>
            </div>

            <div className="text-center text-sm font-bold text-white/40 mt-10">
                حساب کاربری ندارید؟{" "}
                <Link href="/register" className="text-amber-400 hover:text-amber-300 transition-colors border-b border-amber-400/30 pb-0.5 hover:border-amber-400">
                    ثبت نام کنید
                </Link>
            </div>
        </AuthLayout>
    );
}
