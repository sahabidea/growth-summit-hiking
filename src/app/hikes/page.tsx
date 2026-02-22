"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Mountain, MapPin,
    Clock, Activity, Sparkles, Navigation,
    Cloud, Users, Sun, CloudRain
} from "lucide-react";
import Link from "next/link";
import { PathfinderAgent, type Route } from "@/lib/ai/pathfinder";
import { SageAgent, type Topic } from "@/lib/ai/sage";
import { cn } from "@/lib/utils";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

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
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-12 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            {/* Energetic Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="fixed inset-0 z-0 bg-gradient-to-tr from-amber-900/20 via-transparent to-purple-900/10 pointer-events-none mix-blend-screen" />
            <div className="fixed top-0 right-0 w-full h-[40vh] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

            <FloatingParticles count={25} color="bg-amber-400" />

            {/* Navigation handled by RootLayout */}

            <main className="pt-40 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <header className="text-center mb-16 md:mb-20">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-2 rounded-full text-xs font-black mb-8 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                        >
                            <Navigation className="h-4 w-4" /> هوش مصنوعی مسیر
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl">
                            مسیر <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">ایده‌آل شما</span>
                        </h1>
                        <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            تحلیل هوشمند روت‌های کوهنوردی بر اساس شرایط جوی و تعداد همنوردان.
                        </p>
                    </header>

                    <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
                        {/* Control Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-12 xl:col-span-5 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <label className="block text-xs font-black mb-6 text-white/40 uppercase tracking-[0.2em] mr-1">وضعیت جوی</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: "Sunny", label: "آفتابی", icon: <Sun className="h-6 w-6 text-amber-400" /> },
                                            { id: "Cloudy", label: "ابری", icon: <Cloud className="h-6 w-6 text-slate-400" /> },
                                            { id: "Rainy", label: "بارانی", icon: <CloudRain className="h-6 w-6 text-blue-400" /> }
                                        ].map((w) => (
                                            <button
                                                key={w.id}
                                                onClick={() => setWeather(w.id)}
                                                className={cn(
                                                    "relative flex items-center justify-between p-5 rounded-2xl transition-all border-2 group font-black",
                                                    weather === w.id
                                                        ? "bg-slate-800 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                                                        : "bg-white/5 border-white/5 text-white/50 hover:border-white/20 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <span className="text-2xl">{w.icon}</span>
                                                    <span className={cn("text-lg", weather === w.id ? "text-white" : "text-white/60")}>{w.label}</span>
                                                </div>
                                                {weather === w.id && (
                                                    <motion.div layoutId="weather-dot" className="bg-amber-500 w-2.5 h-2.5 rounded-full shadow-[0_0_10px_#f59e0b]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mr-1">تعداد همنوردان</label>
                                        <span className="font-black text-2xl text-amber-400 tabular-nums drop-shadow-sm">{groupSize} نفر</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={groupSize}
                                        onChange={(e) => setGroupSize(parseInt(e.target.value))}
                                        className="w-full accent-amber-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer hover:accent-amber-400 transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleFindRoute}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-6 rounded-2xl font-black text-xl hover:shadow-[0_10px_40px_rgba(249,115,22,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-4 group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        پیشنهاد مسیر <Sparkles className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
                                        className="bg-slate-900/60 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between group"
                                    >
                                        <div className="absolute top-0 right-0 p-[20%] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="text-right">
                                                    <div className="flex gap-3 mb-4 flex-wrap">
                                                        <span className={cn(
                                                            "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-lg",
                                                            suggestedRoute.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" :
                                                                suggestedRoute.difficulty === "Moderate" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10" :
                                                                    "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10"
                                                        )}>
                                                            {suggestedRoute.difficulty === "Easy" ? "ساده" : suggestedRoute.difficulty === "Moderate" ? "متوسط" : "چالشی"}
                                                        </span>
                                                        <span className="bg-white/5 px-4 py-1.5 rounded-full text-[11px] font-black text-white/40 uppercase tracking-widest border border-white/5">
                                                            سطح حرفه‌ای
                                                        </span>
                                                    </div>
                                                    <h3 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2 drop-shadow-lg">{suggestedRoute.name}</h3>
                                                </div>
                                                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-[1.5rem] shadow-[0_10px_30px_rgba(245,158,11,0.3)] rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                                    <MapPin className="h-8 w-8 text-white" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors group/item">
                                                    <div className="flex items-center gap-3 text-white/40 mb-3">
                                                        <Clock className="h-5 w-5 group-hover/item:text-amber-400 transition-colors" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">زمان صعود</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-white">{suggestedRoute.duration.replace('h', ' ساعت')}</span>
                                                </div>
                                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors group/item">
                                                    <div className="flex items-center gap-3 text-white/40 mb-3">
                                                        <Activity className="h-5 w-5 group-hover/item:text-amber-400 transition-colors" />
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
                                                    className="bg-white p-8 md:p-10 rounded-[2.5rem] text-slate-950 mb-10 shadow-2xl relative z-10 overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Sparkles className="h-5 w-5 text-amber-600" />
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">پیشنهاد حکیم (The Sage)</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black mb-3 leading-tight text-slate-900">{suggestedTopic.title}</h4>
                                                    <p className="font-bold text-slate-600 leading-relaxed text-lg">{suggestedTopic.description}</p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <button className="w-full bg-white/5 text-white/60 py-6 rounded-2xl font-black text-lg hover:bg-white/10 hover:text-white transition-all border border-white/5 hover:border-amber-500/20 active:scale-[0.98]">
                                            مشاهده گزارش فنی و نقشه
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="h-full bg-white/5 backdrop-blur-sm rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-20 text-center hover:border-white/20 transition-colors group">
                                        <div className="bg-white/5 p-8 rounded-full shadow-xl border border-white/5 mb-8 group-hover:scale-110 transition-transform duration-500">
                                            <Mountain className="h-16 w-16 text-white/10 group-hover:text-amber-500/50 transition-colors" />
                                        </div>
                                        <h3 className="font-black text-3xl text-white/20 mb-4 uppercase italic group-hover:text-white/40 transition-colors">آماده تحلیل</h3>
                                        <p className="text-white/30 font-bold max-w-sm">تنظیمات را از پنل سمت راست انتخاب کنید تا هوش مصنوعی بهترین مسیر را برای شما ترسیم کند.</p>
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

