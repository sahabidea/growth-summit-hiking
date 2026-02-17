"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Loader2, Minimize2, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { createChatSession, getSessionMessages, sendMessage } from "@/app/actions/live-chat";

export default function LiveChatWidget() {
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);

    // User data state
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState(""); // Optional, for callbacks
    const [hasStarted, setHasStarted] = useState(false);

    // Chat ui state
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load from local storage if available
    useEffect(() => {
        const storedSession = localStorage.getItem("or_chat_session");
        if (storedSession) {
            setSessionId(storedSession);
            setHasStarted(true);
            loadMessages(storedSession);
            subscribeToMessages(storedSession);
        }
    }, []);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const loadMessages = async (sid: string) => {
        const res = await getSessionMessages(sid);
        if (res.success) {
            setMessages(res.messages || []);
        }
    };

    const subscribeToMessages = (sid: string) => {
        const channel = supabase
            .channel(`chat_room:${sid}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `session_id=eq.${sid}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleStartChat = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);

        // Create session
        const res = await createChatSession(name, phone);
        if (res.success && res.sessionId) {
            setSessionId(res.sessionId);
            localStorage.setItem("or_chat_session", res.sessionId);
            setHasStarted(true);
            subscribeToMessages(res.sessionId);

            // Send initial bot message
            // Ideally triggered via trigger/db, but client side is faster for UX here
            setTimeout(() => {
                setMessages([{
                    id: 'welcome',
                    sender: 'admin',
                    content: `سلام ${name || 'دوست عزیز'}! 👋\nچطور می‌تونم کمکتون کنم؟`,
                    created_at: new Date().toISOString()
                }]);
            }, 500);
        }
        setIsConnecting(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId) return;

        setIsSending(true);
        const msg = input.trim();
        setInput(""); // Clear immediately for UX

        // Optimistic update
        const tempId = Date.now().toString();
        // Since we subscribe to changes, we perform the write via server action 
        // AND wait for subscription. OR we add optimistically and dedupe?
        // Let's rely on subscription for simplicity, but showing "Sending..." state via input disable is good.

        await sendMessage(sessionId, "user", msg);
        setIsSending(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans" dir="rtl">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[320px] md:w-[380px] h-[500px] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-500/20 p-2 rounded-full border border-amber-500/20">
                                    <User className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">پشتیبانی آنلاین</h3>
                                    <span className="text-[10px] opacity-60 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
                                        هم‌اکنون آنلاین
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full text-white/60 hover:text-white transition-colors">
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden flex flex-col">
                            {/* Chat Pattern BG opacity */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />

                            {!hasStarted ? (
                                <div className="flex-1 flex flex-col justify-center p-6 text-center relative z-10">
                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                                        <h4 className="font-black text-lg mb-2 text-slate-800 dark:text-white">شروع گفتگو</h4>
                                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">برای اینکه بتونیم بهتر راهنماییتون کنیم، لطفا نام خودتون رو وارد کنید.</p>

                                        <form onSubmit={handleStartChat} className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="نام شما"
                                                className="w-full bg-slate-100 dark:bg-slate-950 px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-amber-500 outline-none text-sm font-bold text-slate-800 dark:text-white transition-all"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                            <input // Optional phone to contact back later if admin offline
                                                type="tel"
                                                placeholder="شماره موبایل (اختیاری)"
                                                className="w-full bg-slate-100 dark:bg-slate-950 px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-amber-500 outline-none text-sm font-bold text-slate-800 dark:text-white transition-all text-left ltr placeholder:text-right"
                                                dir="ltr"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                disabled={isConnecting || !name.trim()}
                                                className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isConnecting ? <Loader2 className="animate-spin w-4 h-4" /> : "شروع چت"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                                    {messages.map((msg, idx) => {
                                        const isUser = msg.sender === 'user';
                                        return (
                                            <div key={msg.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`
                                                    max-w-[85%] p-3 text-sm rounded-2xl relative shadow-sm
                                                    ${isUser
                                                        ? 'bg-amber-500 text-white rounded-tl-none'
                                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-tr-none border border-slate-100 dark:border-slate-700'}
                                                `}>
                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                    <span className={`text-[10px] block mt-1 text-left opacity-70 ${isUser ? 'text-amber-100' : 'text-slate-400'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {hasStarted && (
                            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                <div className="flex gap-2 relative">
                                    <input
                                        type="text"
                                        placeholder="پیام خود را بنویسید..."
                                        className="flex-1 text-sm p-3 pl-10 bg-slate-50 dark:bg-slate-950/50 rounded-xl border-none focus:ring-1 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-300 font-medium"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || !input.trim()}
                                        className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-amber-500/20 absolute left-1 top-1 bottom-1 w-10"
                                    >
                                        {isSending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4 rtl:rotate-180" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative z-50 flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-amber-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                <div className="bg-slate-900 text-white p-4 rounded-full shadow-2xl border border-white/10 relative z-10 flex items-center justify-center w-14 h-14 hover:bg-slate-800 transition-colors">
                    {isOpen ? <X className="w-6 h-6" /> : (
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-bounce" />
                            <MessageCircle className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </motion.button>
        </div>
    );
}
