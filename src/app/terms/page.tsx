"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-32 pt-32 px-4 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

            <main className="max-w-4xl mx-auto relative z-10 w-full">
                <header className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 shadow-2xl">
                        <Scale className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6">قوانین و مقررات</h1>
                    <p className="text-white/60 text-lg">آخرین بروزرسانی: اسفند ۱۴۰۲</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
                >
                    <section>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-white/10 pb-4">۱. شرایط عمومی</h2>
                        <p className="text-white/70 leading-loose text-justify font-medium">
                            استفاده از خدمات باشگاه اوج رشد به منزله پذیریش کامل این قوانین است. تمامی اعضا موظفند ضمن احترام به قوانین جمهوری اسلامی ایران، شئونات اخلاقی و ورزشی را در كافة برنامه‌های برگزار شده رعایت نمایند.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-white/10 pb-4">۲. سلامت و آمادگی جسمانی</h2>
                        <ul className="list-disc list-inside text-white/70 leading-loose space-y-2 font-medium">
                            <li>شرکت در برنامه‌های سخت و صعودهای بلند مستلزم تاییدیه پزشکی یا احراز آمادگی از سوی مربیان باشگاه است.</li>
                            <li>پنهان کردن هرگونه بیماری قلبی، تنفسی و زمینه‌ای بر عهده خود شرکت‌کننده است.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-white/10 pb-4">۳. شرایط انصراف و کنسلی</h2>
                        <p className="text-white/70 leading-loose text-justify font-medium">
                            در صورت انصراف از برنامه تا ۴۸ ساعت قبل از حرکت، مبلغ پرداختی بدون کسر جریمه به کیف پول کاربر در سایت عودت داده می‌شود. در صورت انصراف در کمتر از ۴۸ ساعت، به دلیل رزرو خدمات پیش از موعد پرداخت وجه امکان‌پذیر نیست مگر در شرایط اضطراری پزشکی (با ارائه مدرک معتبر).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-white/10 pb-4">۴. تجهیزات و ایمنی</h2>
                        <p className="text-white/70 leading-loose text-justify font-medium">
                            رعایت دستورات سرپرست برنامه الزامی است. در صورتی که شرکت‌کننده‌ای تجهیزات حداقل اعلام شده در برنامه را به همراه نداشته باشد، سرپرست می‌تواند برای حفظ سلامت وی و تیم، از همراهی ایشان جلوگیری نماید.
                        </p>
                    </section>
                </motion.div>
            </main>
        </div>
    );
}
