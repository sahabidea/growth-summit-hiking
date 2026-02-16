"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mountain, Lock, Loader2, ShieldCheck } from "lucide-react";
import { adminLogin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await adminLogin(password);

        if (result.success) {
            router.push("/admin");
        } else {
            setError(result.error || "خطایی رخ داد.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-white" dir="rtl">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
                <Mountain className="w-[60vw] h-[60vw] text-white" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[3rem] p-12 md:p-16 w-full max-w-md border border-white/5 shadow-2xl relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="bg-emerald-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <ShieldCheck className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-display mb-2">ورود ادمین</h1>
                    <p className="text-white/40 font-bold text-sm">پنل مدیریت اوجِ رشد</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-black text-white/40 mb-3 mr-1">رمز عبور</label>
                        <div className="relative">
                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="password"
                                required
                                placeholder="رمز عبور مدیریت"
                                className="w-full bg-slate-950 pr-14 pl-6 py-5 rounded-2xl border border-white/5 focus:border-emerald-500 transition-all font-bold text-lg text-white placeholder:text-white/10 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-rose-500 font-bold text-sm text-center bg-rose-500/10 py-3 rounded-xl"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 text-slate-950 py-5 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            "ورود به پنل"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
