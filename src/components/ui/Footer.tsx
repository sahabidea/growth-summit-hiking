import { Mountain } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-20 md:py-32 bg-slate-950 border-t border-white/5 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-right">
                    <div>
                        <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                            <div className="bg-emerald-500 p-1.5 rounded-lg">
                                <Mountain className="h-6 w-6 text-slate-950" />
                            </div>
                            <span className="font-display text-3xl tracking-tighter text-white">اوجِ رشد</span>
                        </div>
                        <p className="text-white/30 font-bold max-w-sm">
                            جایی که قله‌ها شاهد رشد شما هستند. <br /> طراحی شده برای صعودهای معنادار.
                        </p>
                    </div>

                    <div className="flex gap-12 md:gap-24 font-bold text-sm tracking-widest text-white/40">
                        <Link href="#" className="hover:text-white transition-colors underline decoration-emerald-500/30 underline-offset-8">
                            اینستاگرام
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors underline decoration-emerald-500/30 underline-offset-8">
                            تلگرام
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors underline decoration-emerald-500/30 underline-offset-8">
                            تماس
                        </Link>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] md:text-xs font-black tracking-[0.4em] text-white/10">
                    ۲۰۲۶ اوجِ رشد. بدون سیاست، فقط صعود.
                </div>
            </div>
        </footer>
    );
}
