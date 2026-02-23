"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-32 pt-32 px-4 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

            <main className="max-w-5xl mx-auto relative z-10 w-full">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6">تماس با ما</h1>
                    <p className="text-white/60 text-lg">آماده پاسخگویی به سوالات شما هستیم</p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
                    >
                        <h2 className="text-2xl font-bold text-amber-400 mb-8 border-b border-white/10 pb-4">ارسال پیام مستقیم</h2>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">نام و نام خانوادگی</label>
                                <input type="text" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="علی حسینی" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">شماره تماس یا ایمیل</label>
                                <input type="text" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" placeholder="0912..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">متن پیام</label>
                                <textarea className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors h-32 resize-none" placeholder="چگونه می‌توانم..."></textarea>
                            </div>
                            <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors">
                                <Send className="w-5 h-5" /> ارسال پیام
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex items-start gap-4 hover:border-amber-500/30 transition-colors">
                            <div className="bg-amber-500/10 p-3 rounded-2xl">
                                <Phone className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-bold text-lg mb-1">تلفن پشتیبانی</p>
                                <p className="text-white/60 text-sm font-mono">+98 912 000 0000</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex items-start gap-4 hover:border-amber-500/30 transition-colors">
                            <div className="bg-amber-500/10 p-3 rounded-2xl">
                                <Mail className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-bold text-lg mb-1">ایمیل</p>
                                <p className="text-white/60 text-sm font-mono">info@ouj-roshd.ir</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex items-start gap-4 hover:border-amber-500/30 transition-colors">
                            <div className="bg-amber-500/10 p-3 rounded-2xl">
                                <MapPin className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-bold text-lg mb-1">دفتر مرکزی (با هماهنگی قبلی)</p>
                                <p className="text-white/60 text-sm leading-relaxed">تهران، ابتدای جاده فشم، مجتمع کوهسار</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
