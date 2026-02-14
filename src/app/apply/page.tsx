"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Send, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GatekeeperAgent, type VettingResult } from "@/lib/ai/gatekeeper";
import { supabase } from "@/lib/supabase";

export default function ApplyPage() {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [vettingResult, setVettingResult] = useState<VettingResult | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        goal: "",
        politicsAgreement: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAnalyzing(true);

        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = GatekeeperAgent.vetApplication(formData);
        setVettingResult(result);
        setIsAnalyzing(false);

        if (result.approved) {
            // Submit to Supabase
            const { error } = await supabase
                .from('applications')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        goal: formData.goal,
                        score: result.score,
                        approved: result.approved
                    }
                ]);

            if (error) {
                console.error("Supabase Error:", error);
                // We logicially show the result anyway but log the DB error
            } else {
                console.log("Application saved to Supabase!");
            }
        }
    };

    return (
        <div className="min-h-screen bg-forest-50/50 flex flex-col font-sans text-right" dir="rtl">
            <div className="p-6">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-forest-800 transition-colors">
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /> بازگشت به صفحه اصلی
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-background w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden"
                >
                    <div className="h-2 bg-gray-100 w-full">
                        <div
                            className="h-full bg-forest-800 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-2">به اوج بپیوندید</h2>
                        <p className="text-muted-foreground mb-8 text-sm">
                            ما تمام اعضا را بررسی می‌کنیم تا از کیفیت و ذهنیت رشد در جامعه اطمینان حاصل کنیم.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">نام و نام خانوادگی</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-forest-800 focus:outline-none"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">ایمیل</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-forest-800 focus:outline-none"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full mt-6 bg-forest-800 text-white py-2 rounded-lg font-medium hover:bg-forest-900 transition-colors"
                                    >
                                        مرحله بعد
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">مهم‌ترین هدف رشد شما در حال حاضر چیست؟</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-forest-800 focus:outline-none"
                                                placeholder="مثلاً: توسعه استارتاپم، یادگیری رهبری، آمادگی برای ماراتن..."
                                                value={formData.goal}
                                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-100 text-foreground py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            قبلی
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="flex-1 bg-forest-800 text-white py-2 rounded-lg font-medium hover:bg-forest-900 transition-colors"
                                        >
                                            مرحله بعد
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                    <div className="p-4 bg-forest-50 rounded-lg border border-forest-800/20 mb-6">
                                        <h3 className="font-bold text-forest-900 mb-2 flex items-center">
                                            <ShieldCheck className="w-5 h-5 ml-2" /> پیمان‌نامه جامعه
                                        </h3>
                                        <ul className="text-sm text-forest-800 space-y-2 list-disc pr-5">
                                            <li>من موافقم که بحث‌ها را روی رشد شخصی و حرفه‌ای متمرکز نگه دارم.</li>
                                            <li>من از بحث‌های سیاسی یا تفرقه‌انگیز پرهیز می‌کنم.</li>
                                            <li>من متعهد می‌شوم که از رشد سایر اعضا حمایت کنم.</li>
                                        </ul>
                                    </div>

                                    <label className="flex items-center space-x-3 space-x-reverse mb-6 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            required
                                            className="w-5 h-5 text-forest-800 rounded focus:ring-forest-800"
                                            checked={formData.politicsAgreement}
                                            onChange={(e) => setFormData({ ...formData, politicsAgreement: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium">من با پیمان‌نامه جامعه موافقم</span>
                                    </label>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="flex-1 bg-gray-100 text-foreground py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                            disabled={isAnalyzing || !!vettingResult}
                                        >
                                            قبلی
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isAnalyzing || !!vettingResult}
                                            className="flex-1 bg-forest-800 text-white py-2 rounded-lg font-medium hover:bg-forest-900 transition-colors flex justify-center items-center disabled:opacity-70"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> در حال تحلیل...
                                                </>
                                            ) : (
                                                <>
                                                    ثبت نهایی <Send className="mr-2 h-4 w-4 rotate-180" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {vettingResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "mt-6 p-4 rounded-lg border",
                                                vettingResult.approved ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                                            )}
                                        >
                                            <h4 className="font-bold mb-1">
                                                {vettingResult.approved ? "درخواست پذیرفته شد!" : "درخواست رد شد"}
                                            </h4>
                                            <p className="text-sm">{vettingResult.reason}</p>
                                            {vettingResult.approved && (
                                                <p className="text-xs mt-2 opacity-80">لینک پرداخت برای شما ایمیل خواهد شد.</p>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
