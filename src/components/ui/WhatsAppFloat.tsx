"use client";

import { useState } from "react";
import { MessageCircle, X, Send, User, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitChatInquiry } from "@/app/actions/chat";

// Custom WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function WhatsAppFloat() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setIsSending(true);

        const formData = new FormData();
        formData.append("name", name || "مهمان");
        formData.append("message", message);

        // Log to database first
        // We don't await strictly for UI speed, but better to await to ensure log
        await submitChatInquiry(formData);

        // Open WhatsApp
        const phoneNumber = "989222453571";
        const text = `سلام، ${name ? `من ${name} هستم.` : ""} \n\n${message}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

        window.open(url, '_blank');

        setIsSending(false);
        setIsOpen(false);
        setMessage("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4" dir="rtl">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[320px] md:w-[360px] overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="bg-[#128C7E] p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">پشتیبانی آنلاین</h3>
                                    <span className="text-[10px] opacity-80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        پاسخگویی سریع
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full text-white/80 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-[#e5ddd5] dark:bg-slate-950/50 min-h-[200px] flex flex-col gap-3 relative">
                            {/* Chat Pattern BG opacity */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }} />

                            {/* Bot Message */}
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-tr-none rounded-2xl shadow-sm self-start max-w-[85%] text-sm text-slate-800 dark:text-slate-200 relative z-10 border border-slate-100 dark:border-slate-700">
                                <p className="leading-relaxed">سلام! 👋 <br /> چطور می‌تونم کمکتون کنم؟ پیامتون رو بنویسید تا مستقیماً به واتس‌اپ پشتیبانی متصل بشید.</p>
                                <span className="text-[10px] text-slate-400 block mt-1 text-left">همین الان</span>
                            </div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <input
                                type="text"
                                placeholder="نام شما (اختیاری)"
                                className="w-full text-xs p-2 mb-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg border-none focus:ring-1 focus:ring-[#128C7E] outline-none text-slate-700 dark:text-slate-300"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="پیام خود را بنویسید..."
                                    className="flex-1 text-sm p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border-none focus:ring-1 focus:ring-[#128C7E] outline-none text-slate-700 dark:text-slate-300"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || !message.trim()}
                                    className="bg-[#128C7E] hover:bg-[#075E54] text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5 rtl:rotate-180" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_5px_20px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center relative z-50"
            >
                {isOpen ? <X className="w-8 h-8" /> : (
                    <>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900" />
                        <WhatsAppIcon className="w-8 h-8" />
                    </>
                )}
            </motion.button>
        </div>
    );
}
