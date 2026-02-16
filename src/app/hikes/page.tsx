"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Mountain, MapPin,
    Clock, Activity, Sparkles, Navigation,
    Cloud, Users
} from "lucide-react";
import Link from "next/link";
import { PathfinderAgent, type Route } from "@/lib/ai/pathfinder";
import { SageAgent, type Topic } from "@/lib/ai/sage";
import { cn } from "@/lib/utils";

// Note: Lucide icons can sometimes fail to import if they are misspelled, 
// using correctly spelled icons for the UI.


export default function HikesPage() {
    const [weather, setWeather] = useState("Sunny");
    const [groupSize, setGroupSize] = useState(5);
    const [suggestedRoute, setSuggestedRoute] = useState<Route | null>(null);
    const [suggestedTopic, setSuggestedTopic] = useState<Topic | null>(null);

    const handleFindRoute = () => {
        const route = PathfinderAgent.suggestRoute(weather, groupSize);
        const topic = SageAgent.suggestTopic(route.vibe);
        setSuggestedRoute(route);
        setSuggestedTopic(topic);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-12 selection:bg-emerald-500/30 text-white" dir="rtl">
            {/* Decorative Ridge Line */}
            <div className="fixed top-0 right-0 w-full h-[30vh] bg-white/5 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />

            {/* Navigation */}
            <nav className="fixed w-full z-50 px-6 py-6">
                <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 rounded-3xl px-8 py-4 flex justify-between items-center border border-white/10">
                    <Link href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors font-black text-sm group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <span>کمپ اصلی</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-1 rounded-lg">
                            <Mountain className="h-6 w-6 text-slate-950" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">برنامه‌ها</span>
                    </div>
                </div>
            </nav>

            <main className="pt-48 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <header className="text-center mb-20 md:mb-24">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-emerald-400 px-6 py-2 rounded-full text-xs font-black mb-8 shadow-sm"
                        >
                            <Navigation className="h-4 w-4" /> هوش مصنوعی مسیر
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">مسیر ایده‌آل شما</h1>
                        <p className="text-white/50 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                            تحلیل هوشمند روت‌های کوهنوردی بر اساس شرایط جوی و تعداد همنوردان.
                        </p>
                    </header>

                    <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                        {/* Control Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-12 xl:col-span-5 bg-white/5 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl"
                        >
                            <div className="space-y-12">
                                <div>
                                    <label className="block text-xs font-black mb-6 text-white/30 uppercase tracking-[0.2em] mr-1">وضعیت جوی</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: "Sunny", label: "آفتابی", icon: "☀️" },
                                            { id: "Cloudy", label: "ابری", icon: "☁️" },
                                            { id: "Rainy", label: "بارانی", icon: "🌧️" }
                                        ].map((w) => (
                                            <button
                                                key={w.id}
                                                onClick={() => setWeather(w.id)}
                                                className={cn(
                                                    "relative flex items-center justify-between p-6 rounded-2xl transition-all border-2 group font-black",
                                                    weather === w.id
                                                        ? "bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                                        : "bg-white/5 border-white/5 text-white/50 hover:border-white/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <span className="text-2xl">{w.icon}</span>
                                                    <span className="text-xl">{w.label}</span>
                                                </div>
                                                {weather === w.id && (
                                                    <div className="bg-emerald-500 w-2 h-2 rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mr-1">تعداد همنوردان</label>
                                        <span className="font-black text-2xl text-emerald-400 tabular-nums">{groupSize} نفر</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={groupSize}
                                        onChange={(e) => setGroupSize(parseInt(e.target.value))}
                                        className="w-full accent-emerald-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={handleFindRoute}
                                    className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 group"
                                >
                                    پیشنهاد مسیر <Sparkles className="h-6 w-6 text-emerald-500 group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Results Area */}
                        <div className="lg:col-span-12 xl:col-span-7 min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {suggestedRoute ? (
                                    <motion.div
                                        key={suggestedRoute.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-12">
                                                <div className="text-right">
                                                    <div className="flex gap-3 mb-4">
                                                        <span className={cn(
                                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                            suggestedRoute.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                                                                suggestedRoute.difficulty === "Moderate" ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                                                                    "bg-rose-500/20 text-rose-400 border-rose-500/20"
                                                        )}>
                                                            {suggestedRoute.difficulty === "Easy" ? "ساده" : suggestedRoute.difficulty === "Moderate" ? "متوسط" : "چالشی"}
                                                        </span>
                                                        <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black text-white/30 uppercase tracking-widest border border-white/5">
                                                            سطح حرفه‌ای
                                                        </span>
                                                    </div>
                                                    <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">{suggestedRoute.name}</h3>
                                                </div>
                                                <div className="bg-emerald-500 p-4 rounded-[2rem] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                                    <MapPin className="h-8 w-8 text-slate-950" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                                    <div className="flex items-center gap-3 text-white/30 mb-3">
                                                        <Clock className="h-5 w-5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">زمان صعود</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{suggestedRoute.duration.replace('h', ' ساعت')}</span>
                                                </div>
                                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                                    <div className="flex items-center gap-3 text-white/30 mb-3">
                                                        <Activity className="h-5 w-5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">حال و هوا</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-white">
                                                        {suggestedRoute.vibe === "Social" ? "اجتماعی" :
                                                            suggestedRoute.vibe === "Focus" ? "تمرکز عمیق" : "استقامتی"}
                                                    </span>
                                                </div>
                                            </div>

                                            {suggestedTopic && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 15 }}
                                                    className="bg-white p-8 md:p-10 rounded-[2.5rem] text-slate-950 mb-12 shadow-2xl relative z-10"
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Sparkles className="h-5 w-5 text-emerald-600" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">پیشنهاد حکیم (The Sage)</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black mb-3 leading-tight underline decoration-emerald-500/20 decoration-8 underline-offset-2">{suggestedTopic.title}</h4>
                                                    <p className="font-bold text-slate-600 leading-relaxed text-lg">{suggestedTopic.description}</p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <button className="w-full bg-white/5 text-white/40 py-6 rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-white/5">
                                            مشاهده گزارش فنی و نقشه
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="h-full bg-white/5 backdrop-blur-sm rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-20 text-center">
                                        <div className="bg-white/5 p-10 rounded-full shadow-2xl border border-white/5 mb-10">
                                            <Mountain className="h-20 w-20 text-white/5" />
                                        </div>
                                        <h3 className="font-black text-3xl text-white/10 mb-4 uppercase italic">آماده تحلیل</h3>
                                        <p className="text-white/20 font-bold max-w-sm">تنظیمات را از پنل سمت راست انتخاب کنید تا هوش مصنوعی بهترین مسیر را برای شما ترسیم کند.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
