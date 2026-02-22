"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error("App Error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white font-sans bg-transparent selection:bg-rose-500/30" dir="rtl">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-lg w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

                <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                </div>

                <h2 className="text-3xl md:text-4xl font-display mb-4 text-white">متأسفانه خطایی رخ داد!</h2>
                <p className="text-white/60 mb-10 text-lg leading-relaxed font-medium">
                    در روند پردازش این سیستم مشکلی پیش آمده است. ما در حال بررسی آن هستیم.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-rose-600 transition-all flex items-center justify-center gap-3 active:scale-95 group shadow-lg shadow-rose-500/20"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" /> تلاش مجدد
                    </button>

                    <Link
                        href="/"
                        className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/5"
                    >
                        <Home className="w-5 h-5" /> بازگشت به خانه
                    </Link>
                </div>
            </div>
        </div>
    );
}
