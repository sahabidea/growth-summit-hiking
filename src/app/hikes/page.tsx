"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mountain, Cloud, Users, MapPin, Clock, Activity } from "lucide-react";
import Link from "next/link";
import { PathfinderAgent, type Route } from "@/lib/ai/pathfinder";
import { SageAgent, type Topic } from "@/lib/ai/sage";
import { cn } from "@/lib/utils";

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
        <div className="min-h-screen bg-background font-sans text-right" dir="rtl">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2 space-x-reverse text-foreground hover:text-forest-800 transition-colors">
                            <ArrowLeft className="h-5 w-5 rotate-180" />
                            <span className="font-medium">بازگشت</span>
                        </Link>
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Mountain className="h-6 w-6 text-forest-800" />
                            <span className="font-bold text-xl tracking-tighter">برنامه‌ها</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-forest-50 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-forest-800/10">
                            هوش مصنوعی راهنما
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">مسیر مناسب خود را پیدا کنید</h1>
                        <p className="text-muted-foreground text-lg">
                            بر اساس شرایط آب‌وهوایی و تعداد گروه، بهترین مسیر را برای رشد و گفتگو پیشنهاد می‌دهیم.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-forest-50/50 p-8 rounded-2xl border border-forest-800/10"
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center">
                                        <Cloud className="ml-2 h-4 w-4 text-forest-800" /> وضعیت آب‌وهوا
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Sunny", "Cloudy", "Rainy"].map((w) => (
                                            <button
                                                key={w}
                                                onClick={() => setWeather(w)}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                                    weather === w
                                                        ? "bg-forest-800 text-white border-forest-800"
                                                        : "bg-white text-muted-foreground border-input hover:border-forest-800/50"
                                                )}
                                            >
                                                {w === "Sunny" ? "آفتابی" : w === "Cloudy" ? "ابری" : "بارانی"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center">
                                        <Users className="ml-2 h-4 w-4 text-forest-800" /> تعداد گروه
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={groupSize}
                                            onChange={(e) => setGroupSize(parseInt(e.target.value))}
                                            className="w-full accent-forest-800 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="font-mono w-8 text-center">{groupSize}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {groupSize < 5 ? "مناسب برای گفتگوهای عمیق" : "مناسب برای شبکه‌سازی و انرژی گروهی"}
                                    </p>
                                </div>

                                <button
                                    onClick={handleFindRoute}
                                    className="w-full bg-forest-800 text-white py-3 rounded-xl font-medium hover:bg-forest-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    پیشنهاد مسیر
                                </button>
                            </div>
                        </motion.div>

                        {/* Result Area */}
                        <div className="relative min-h-[300px]">
                            {suggestedRoute ? (
                                <motion.div
                                    key={suggestedRoute.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-8 rounded-2xl border border-border shadow-xl h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-forest-900 mb-1">{suggestedRoute.name}</h3>
                                                <span className={cn(
                                                    "inline-block px-2 py-0.5 rounded text-xs font-medium border",
                                                    suggestedRoute.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" :
                                                        suggestedRoute.difficulty === "Moderate" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                            "bg-red-50 text-red-700 border-red-200"
                                                )}>
                                                    {suggestedRoute.difficulty === "Easy" ? "ساده" : suggestedRoute.difficulty === "Moderate" ? "متوسط" : "سخت"}
                                                </span>
                                            </div>
                                            <div className="bg-forest-50 p-3 rounded-full">
                                                <MapPin className="h-6 w-6 text-forest-800" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="ml-3 h-5 w-5 text-forest-800/70" />
                                                <span>مدت زمان: {suggestedRoute.duration.replace('h', ' ساعت')}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <Activity className="ml-3 h-5 w-5 text-forest-800/70" />
                                                <span>حال و هوا: {
                                                    suggestedRoute.vibe === "Social" ? "اجتماعی و شاد" :
                                                        suggestedRoute.vibe === "Focus" ? "کم‌حاشیه و متمرکز" : "چالشی و استقامتی"
                                                }</span>
                                            </div>
                                        </div>

                                        {suggestedTopic && (
                                            <div className="bg-forest-50/50 border border-forest-800/10 p-4 rounded-xl mb-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-forest-800 text-white text-[10px] px-2 py-0.5 rounded-full">پیشنهاد حکیم (The Sage)</span>
                                                    <span className="text-xs text-muted-foreground border border-forest-800/20 px-1.5 py-0.5 rounded">{suggestedTopic.category}</span>
                                                </div>
                                                <h4 className="font-bold text-forest-900 mb-1 text-sm">{suggestedTopic.title}</h4>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{suggestedTopic.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button className="w-full border border-forest-800 text-forest-800 py-3 rounded-xl font-medium hover:bg-forest-50 transition-colors">
                                        مشاهده جزئیات مسیر
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl p-8">
                                    <Mountain className="h-12 w-12 mb-4 opacity-20" />
                                    <p>تنظیمات را انتخاب کنید و دکمه پیشنهاد مسیر را بزنید</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
