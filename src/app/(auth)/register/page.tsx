"use client";

import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { sendOtp, verifyOtp } from "@/app/actions/auth-otp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Smartphone, Mail, User, CheckCircle, Loader2 } from "lucide-react";

import { registerWithPassword } from "@/app/actions/auth-password";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: OTP
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Form State
    const [phone, setPhone] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState(""); // Optional
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || !password || !fullName) return setMessage("لطفا نام، موبایل و رمز عبور را وارد کنید.");
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("fullName", fullName);

        // This action handles creation + custom SMS sending
        const res = await registerWithPassword(formData);

        setLoading(false);

        if (res.success) {
            setStep(2);
            setMessage("کد تایید به شماره شما ارسال شد.");
        } else {
            setMessage(res.error || "خطا در ثبت نام.");
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
            {/* Steps Indicator */}
            <div className="flex justify-between mb-8 px-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= 1 ? "bg-emerald-500 border-emerald-500 text-slate-950" : "bg-slate-900 border-slate-700 text-slate-500"}`}>1</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= 2 ? "bg-emerald-500 border-emerald-500 text-slate-950" : "bg-slate-900 border-slate-700 text-slate-500"}`}>2</div>
            </div>

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
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600 font-sans text-left ltr"
                            dir="ltr"
                            required
                        />
                    </div>

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

                    <div className="relative group">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="رمز عبور"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder:text-slate-600 font-sans"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading && <Loader2 className="animate-spin w-5 h-5" />}
                        ثبت نام
                    </button>
                </form>
            )}

            {step === 2 && (
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
                <div className={`p-4 rounded-xl text-center text-sm ${message.includes("تایید") || message.includes("ارسال") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
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
