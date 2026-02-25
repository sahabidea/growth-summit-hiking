"use client";

import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { sendOtp, verifyOtp } from "@/app/actions/auth-otp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Smartphone, Mail, User, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { registerWithPassword } from "@/app/actions/auth-password"; // Ensure import is correct

export default function RegisterPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"otp" | "password">("password"); // Default to Password mode as requested
    const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: OTP
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Form State
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState(""); // Optional
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || !fullName) return setMessage("لطفا نام و موبایل را وارد کنید.");

        if (mode === "password" && !password) return setMessage("لطفا رمز عبور را وارد کنید.");

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("fullName", fullName);

        if (mode === "password") {
            // Register with Password (No OTP)
            const res = await registerWithPassword(formData);
            setLoading(false);

            if (res.success) {
                setMessage("ثبت نام با موفقیت انجام شد.");
                // Redirect immediately or after short delay
                setTimeout(() => router.push("/dashboard"), 1000);
            } else {
                setMessage(res.error || "خطا در ثبت نام.");
            }
        } else {
            // Register with OTP (Existing flow)
            // Just send OTP first
            const res = await sendOtp(phone, "register");
            setLoading(false);

            if (res.success) {
                setStep(2);
                setMessage("کد تایید به شماره شما ارسال شد.");
            } else {
                setMessage(res.error || "خطا در ارسال کد.");
            }
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode) return setMessage("کد را وارد کنید.");
        setLoading(true);

        const res = await verifyOtp(phone, otpCode, "register");
        setLoading(false);

        if (res.success) {
            router.push("/dashboard");
        } else {
            setMessage(res.error || "کد اشتباه است.");
        }
    };

    return (
        <AuthLayout
            title="عضویت در باشگاه"
            subtitle="به جمع حرفه‌ای‌ها بپیوندید و مسیر رشد خود را آغاز کنید."
        >
            {/* Toggle Mode */}
            <div className="flex gap-3 mb-8 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 relative">
                <button
                    onClick={() => { setMode("password"); setStep(1); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${mode === "password"
                        ? "bg-white text-slate-950 shadow-lg shadow-white/10"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                >
                    ثبت نام با رمز (سریع)
                </button>
                <button
                    onClick={() => { setMode("otp"); setStep(1); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${mode === "otp"
                        ? "bg-white text-slate-950 shadow-lg shadow-white/10"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                >
                    ثبت نام با پیامک
                </button>
            </div>

            {mode === "otp" && (
                <>
                    {/* Steps Indicator for OTP */}
                    <div className="flex justify-between mb-8 px-4 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= 1 ? "bg-emerald-500 border-emerald-500 text-slate-950" : "bg-slate-900 border-slate-700 text-slate-500"}`}>1</div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= 2 ? "bg-emerald-500 border-emerald-500 text-slate-950" : "bg-slate-900 border-slate-700 text-slate-500"}`}>2</div>
                    </div>
                </>
            )}

            {step === 1 && (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="نام و نام خانوادگی"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600 font-sans"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="شماره موبایل (0912...)"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600 font-sans text-right"
                            dir="ltr"
                            required
                        />
                    </div>

                    {mode === "password" && (
                        <div className="relative group">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="رمز عبور دلخواه"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600 font-sans"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    )}

                    <div className="relative group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ایمیل (اختیاری)"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600 font-sans"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === "password" ? "ثبت نام و ورود" : "ارسال کد تایید")}
                    </button>
                </form>
            )}

            {step === 2 && mode === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-4 text-center">
                        <p className="text-slate-300">کد ارسال شده به {phone} را وارد کنید</p>
                        <button type="button" onClick={() => setStep(1)} className="text-emerald-400 text-sm hover:underline">ویرایش اطلاعات</button>

                        <div className="flex justify-center gap-2 mt-4" dir="ltr">
                            <input
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-full max-w-[200px] tracking-[1rem] text-center text-3xl font-bold bg-slate-900/50 border border-slate-700 rounded-xl py-4 focus:outline-none focus:border-emerald-500 transition-all"
                                maxLength={6}
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "تایید کنید"}
                    </button>
                </form>
            )}

            {message && (
                <div className={`p-4 rounded-xl text-center text-sm ${message.includes("تایید") || message.includes("ارسال") || message.includes("موفق") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    {message}
                </div>
            )}

            <div className="text-center text-sm text-slate-500 mt-8">
                حساب کاربری دارید؟{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                    وارد شوید
                </Link>
            </div>
        </AuthLayout>
    );
}
