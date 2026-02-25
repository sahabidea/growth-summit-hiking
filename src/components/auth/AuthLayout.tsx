"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row-reverse bg-[#020617] text-white overflow-hidden font-sans" dir="rtl">
            {/* Left Side (Visuals in RTL using flex-row-reverse) */}
            <div className="w-full md:w-1/2 lg:w-[45%] relative flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-slate-900 border-r border-white/5">
                {/* Background Gradient/Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop')`, // Morning Summit
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-950/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-purple-900/20 mix-blend-overlay" />

                    <FloatingParticles count={15} color="bg-amber-200" glowColor="rgba(245,158,11,0.5)" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3 text-amber-400 font-display text-2xl mb-8 group hover:text-amber-300 transition-colors">
                            <span className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                {/* Use ArrowRight for "Back" in RTL context if meaning is "Go away from here" or ArrowLeft for "Go Home"? ArrowLeft usually points West. In RTL, "Back" is East (Right). Let's use simple Home icon or keep Arrow. Sticking to Arrow. */}
                                <ArrowLeft className="w-5 h-5" />
                            </span>
                            <span className="font-black tracking-tighter">اوجِ رشد</span>
                        </Link>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">صبح صعود</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display leading-[1.1] text-white drop-shadow-xl">
                                {title}
                            </h1>
                            <p className="text-lg text-white/60 max-w-md leading-relaxed font-medium">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center gap-4 text-sm font-bold text-white/30">
                            <span>© ۱۴۰۴ اوجِ رشد</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                            <Link href="/terms" className="hover:text-amber-400 transition-colors">قوانین و مقررات</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side (Form in RTL) */}
            <div className="w-full md:w-1/2 lg:w-[55%] flex items-center justify-center p-6 md:p-12 relative bg-slate-950">
                {/* Subtle Light Leak */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 md:p-10 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
