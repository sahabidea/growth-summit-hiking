"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-32 pt-32 px-4 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

            <main className="max-w-4xl mx-auto relative z-10 w-full">
                <header className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 shadow-2xl">
                        <ShieldAlert className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6">حریم خصوصی کاربر</h1>
                    <p className="text-white/60 text-lg">ما برای داده‌های شما ارزش قائلیم</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
                >
                    <section>
                        <h2 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-white/10 pb-4">حفاظت از اطلاعات شخصی</h2>
                        <p className="text-white/70 leading-loose text-justify font-medium">
                            باشگاه اوج رشد متعهد می‌شود که اطلاعات ثبت شده در سیستم، نظیر کد ملی، شماره موبایل و سوابق پزشکی را کاملاً محرمانه نگه دارد و از آن‌ها تنها به منظور خدمات‌دهی بهتر و پوشش بیمه حوادث در تورهای کوهنوردی استفاده نماید.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-emerald-400 mb-4 border-b border-white/10 pb-4">استفاده از کوکی‌ها (Cookies)</h2>
                        <p className="text-white/70 leading-loose text-justify font-medium">
                            برای بهبود تجربه کاربری و آنالیز رفتار کاربران بر روی وب‌سایت، ما از کوکی‌های استاندارد استفاده می‌کنیم. شما این امکان را دارید که از طریق تنظیمات مرورگر، ذخیره کوکی‌ها را مسدود کنید.
                        </p>
                    </section>
                </motion.div>
            </main>
        </div>
    );
}
