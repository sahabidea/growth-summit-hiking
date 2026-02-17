"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2, Sparkles, User, Mail, ShieldCheck, Mountain, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GatekeeperAgent, type VettingResult } from "@/lib/ai/gatekeeper";
import { submitApplication } from "@/app/actions/applications";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export default function ApplyPage() {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [vettingResult, setVettingResult] = useState<VettingResult | null>(null);
    const [serverError, setServerError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        goal: "",
        politicsAgreement: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "نام الزامی است.";
        if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "فرمت ایمیل نامعتبر است.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.goal.trim()) newErrors.goal = "لطفاً هدف خود را بنویسید.";
        else if (formData.goal.trim().length < 10) newErrors.goal = "لطفاً بیشتر توضیح دهید (حداقل ۱۰ کاراکتر).";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAnalyzing(true);
        setServerError("");
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = GatekeeperAgent.vetApplication(formData);
        setVettingResult(result);

        // Save ALL applications (not just approved)
        const response = await submitApplication({
            name: formData.name,
            email: formData.email,
            goal: formData.goal,
            score: result.score,
            approved: result.approved,
        });

        if (!response.success) {
            setServerError(response.error || "خطایی در ثبت درخواست رخ داد.");
        }

        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pt-28 pb-12 px-4 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            {/* Energetic Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
            <FloatingParticles count={15} color="bg-amber-200" glowColor="rgba(245,158,11,0.4)" />

            <div className="max-w-xl mx-auto relative z-10">
                <Link href="/" className="inline-flex items-center gap-3 text-sm font-black text-white/50 hover:text-white transition-colors mb-12 group bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/5 hover:border-amber-500/30 hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    بازگشت به کمپ اصلی
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative"
                >
                    {/* Glow behind the card */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-800 w-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        />
                    </div>

                    <div className="p-8 md:p-14 relative z-10">
                        <div className="flex justify-between items-start mb-12 text-right">
                            <div>
                                <h1 className="text-3xl font-black text-white mb-2 leading-none drop-shadow-md">ثبت درخواست</h1>
                                <p className="text-amber-400/80 font-bold text-xs tracking-widest uppercase">مسیر رشد شخصی</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10 text-right">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="group">
                                                <label className="block text-xs font-black text-white/50 mb-3 mr-1 uppercase tracking-wider">هویت شما</label>
                                                <div className="relative">
                                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="نام و نام خانوادگی"
                                                        className={cn(
                                                            "w-full bg-slate-950/50 pr-14 pl-6 py-5 rounded-2xl border focus:bg-slate-900 transition-all font-bold text-lg text-white placeholder:text-white/10 outline-none hover:border-white/20 focus:shadow-[0_0_20px_rgba(251,191,36,0.1)]",
                                                            errors.name ? "border-rose-500" : "border-white/10 focus:border-amber-500"
                                                        )}
                                                        value={formData.name}
                                                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                                                    />
                                                </div>
                                                {errors.name && <p className="text-rose-400 text-xs font-bold mt-2 mr-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                                            </div>

                                            <div className="group">
                                                <label className="block text-xs font-black text-white/50 mb-3 mr-1 uppercase tracking-wider">ارتباط مستقیم</label>
                                                <div className="relative">
                                                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                                    <input
                                                        type="email"
                                                        placeholder="آدرس ایمیل"
                                                        className={cn(
                                                            "w-full bg-slate-950/50 pr-14 pl-6 py-5 rounded-2xl border focus:bg-slate-900 transition-all font-bold text-lg text-white placeholder:text-white/10 outline-none hover:border-white/20 focus:shadow-[0_0_20px_rgba(251,191,36,0.1)]",
                                                            errors.email ? "border-rose-500" : "border-white/10 focus:border-amber-500"
                                                        )}
                                                        value={formData.email}
                                                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                                                    />
                                                </div>
                                                {errors.email && <p className="text-rose-400 text-xs font-bold mt-2 mr-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => { if (validateStep1()) setStep(2); }}
                                            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl hover:shadow-2xl hover:bg-amber-50"
                                        >
                                            مرحله بعد
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                                        <div>
                                            <label className="block text-xs font-black text-white/50 mb-4 mr-1 uppercase tracking-wider">چشم‌انداز رشد</label>
                                            <textarea
                                                rows={6}
                                                className={cn(
                                                    "w-full bg-slate-950/50 p-8 rounded-[2rem] border focus:bg-slate-900 transition-all font-bold text-lg leading-relaxed text-white placeholder:text-white/10 outline-none focus:shadow-[0_0_20px_rgba(251,191,36,0.1)]",
                                                    errors.goal ? "border-rose-500" : "border-white/10 focus:border-amber-500"
                                                )}
                                                placeholder="بزرگ‌ترین هدف رشد شما در حال حاضر چیست؟"
                                                value={formData.goal}
                                                onChange={(e) => { setFormData({ ...formData, goal: e.target.value }); setErrors({ ...errors, goal: "" }); }}
                                            />
                                            {errors.goal && <p className="text-rose-400 text-xs font-bold mt-2 mr-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.goal}</p>}
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/5 text-white/60 border border-white/5 py-5 rounded-2xl font-black text-lg hover:bg-white/10 hover:text-white transition-all">
                                                قبلی
                                            </button>
                                            <button type="button" onClick={() => { if (validateStep2()) setStep(3); }} className="flex-1 bg-white text-slate-950 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all hover:bg-amber-50 shadow-lg">
                                                تایید نهایی
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                                        <div className="bg-slate-950/60 p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden text-right">
                                            <div className="absolute top-0 right-0 w-full h-1 bg-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                                            <h3 className="font-black text-2xl text-white mb-6 flex items-center gap-3">
                                                <Sparkles className="w-6 h-6 text-amber-500" /> پیمان‌نامه جامعه
                                            </h3>
                                            <ul className="text-sm text-white/70 space-y-4 font-bold leading-relaxed">
                                                <li className="flex gap-3">
                                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                                    <span>تعهد به حفظ آرامش و پرهیز از مباحث تفرقه‌انگیز.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                                    <span>تمرکز روی رشد شخصی، حرفه‌ای و ذهن‌آگاهی.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <label className="flex items-center gap-4 cursor-pointer group text-right p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    required
                                                    className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/20 checked:bg-amber-500 checked:border-amber-500 transition-all cursor-pointer"
                                                    checked={formData.politicsAgreement}
                                                    onChange={(e) => setFormData({ ...formData, politicsAgreement: e.target.checked })}
                                                />
                                                <Check className="absolute w-4 h-4 text-slate-950 opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity font-black" />
                                            </div>
                                            <span className="text-sm font-black text-white/50 group-hover:text-white transition-colors">
                                                من با تمام بندهای پیمان‌نامه موافقم.
                                            </span>
                                        </label>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(2)} className="flex-1 bg-white/5 text-white/60 border border-white/5 py-5 rounded-2xl font-black text-lg disabled:opacity-50 hover:bg-white/10 hover:text-white transition-all" disabled={isAnalyzing || !!vettingResult}>
                                                قبلی
                                            </button>
                                            <button type="submit" disabled={isAnalyzing || !!vettingResult} className="flex-[2] bg-gradient-to-r from-amber-500 to-orange-600 text-white py-5 rounded-2xl font-black text-xl hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all flex justify-center items-center active:scale-[0.98] disabled:opacity-70 disabled:grayscale">
                                                {isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : "ثبت و ارسال"}
                                            </button>
                                        </div>

                                        {serverError && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl font-bold text-sm text-center">
                                                {serverError}
                                            </motion.div>
                                        )}

                                        {vettingResult && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={cn(
                                                    "p-8 rounded-[2rem] border-2 text-center relative overflow-hidden",
                                                    vettingResult.approved
                                                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                                        : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                                )}
                                            >
                                                {vettingResult.approved && (
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none mix-blend-overlay" />
                                                )}
                                                <h4 className="text-2xl mb-2 font-black relative z-10">
                                                    {vettingResult.approved ? "تبریک، پذیرفته شدید" : "درخواست تایید نشد"}
                                                </h4>
                                                <p className="font-bold opacity-80 relative z-10">{vettingResult.reason}</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

