"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="fa" dir="rtl">
            <body className={`bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 selection:bg-rose-500/30`}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                    <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-4 font-sans text-white">خطای سیستمی رخ داد</h2>
                    <p className="text-white/60 mb-8 font-sans">
                        متأسفانه با یک خطای غیرمنتظره روبرو شدیم.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="w-full bg-rose-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 active:scale-95 font-sans"
                    >
                        <RefreshCcw className="w-5 h-5" /> تلاش مجدد
                    </button>
                </div>
            </body>
        </html>
    );
}
