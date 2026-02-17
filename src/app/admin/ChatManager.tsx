"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, User, Loader2, ArrowLeft, RefreshCw, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getChatSessions, getSessionMessages, sendMessage } from "@/app/actions/live-chat";
import { createClient } from "@/lib/supabase/client";

interface ChatSession {
    id: string;
    user_name: string;
    user_phone: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ChatMessage {
    id: string;
    session_id: string;
    sender: "user" | "admin";
    content: string;
    created_at: string;
    is_read: boolean;
}

export const ChatManager = () => {
    const supabase = createClient();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSessions();

        // Subscribe to NEW sessions globally
        const sessionsChannel = supabase
            .channel('admin_sessions_list')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'chat_sessions' },
                () => { fetchSessions(); } // Re-fetch on any change for simplicity
            )
            .subscribe();

        return () => { supabase.removeChannel(sessionsChannel); };
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchMessages(selectedSessionId);

            // Subscribe to messsages for selected session
            const messagesChannel = supabase
                .channel(`admin_chat_room:${selectedSessionId}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSessionId}` },
                    (payload) => {
                        setMessages(prev => [...prev, payload.new as ChatMessage]);
                    }
                )
                .subscribe();

            return () => { supabase.removeChannel(messagesChannel); };
        }
    }, [selectedSessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchSessions = async () => {
        // Optimistically set loading only on first load ideally
        const res = await getChatSessions();
        if (res.success && res.sessions) {
            setSessions(res.sessions);
        }
        setLoadingSessions(false);
    };

    const fetchMessages = async (sid: string) => {
        setLoadingMessages(true);
        const res = await getSessionMessages(sid);
        if (res.success && res.messages) {
            setMessages(res.messages);
        }
        setLoadingMessages(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedSessionId) return;

        setIsSending(true);
        const msg = input.trim();
        setInput("");

        await sendMessage(selectedSessionId, "admin", msg);
        setIsSending(false);
    };

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden h-[600px] flex backdrop-blur-md">
            {/* Sidebar List */}
            <div className={cn(
                "w-full md:w-80 border-l border-white/5 flex flex-col bg-slate-950/50 transition-all duration-300 absolute md:relative z-10 h-full",
                selectedSessionId ? "-translate-x-full md:translate-x-0 hidden md:flex" : "translate-x-0 flex"
            )}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display text-lg px-2">گفتگوها</h3>
                    <button onClick={fetchSessions} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <RefreshCw className={cn("w-4 h-4", loadingSessions && "animate-spin")} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
                    {loadingSessions ? (
                        <div className="text-center py-10 opacity-50 text-sm">در حال بارگذاری...</div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-10 opacity-30 text-sm">هیچ گفتگویی یافت نشد.</div>
                    ) : (
                        sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                className={cn(
                                    "w-full text-right p-4 rounded-xl mb-1 transition-all group relative overflow-hidden",
                                    selectedSessionId === session.id
                                        ? "bg-emerald-500/10 border border-emerald-500/20"
                                        : "hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={cn(
                                        "font-bold text-sm",
                                        selectedSessionId === session.id ? "text-emerald-400" : "text-white"
                                    )}>
                                        {session.user_name}
                                    </span>
                                    <span className="text-[10px] text-white/30">
                                        {new Date(session.updated_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                    <MessageCircle className="w-3 h-3" />
                                    <span className="truncate max-w-[150px]">
                                        {session.user_phone || "بدون شماره"}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-slate-900/30 w-full absolute md:relative h-full transition-all duration-300",
                selectedSessionId ? "translate-x-0 flex" : "translate-x-full md:translate-x-0 hidden md:flex"
            )}>
                {selectedSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-slate-950/30">
                            <button
                                onClick={() => setSelectedSessionId(null)}
                                className="md:hidden p-2 rounded-full hover:bg-white/5 text-white/60"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/20">
                                <User className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">{selectedSession.user_name}</h3>
                                {selectedSession.user_phone && (
                                    <div className="flex items-center gap-1 text-xs text-white/40 font-mono mt-0.5">
                                        <Smartphone className="w-3 h-3" />
                                        <span>{selectedSession.user_phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {loadingMessages ? (
                                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white/20" /></div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isAdmin = msg.sender === 'admin';
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={cn(
                                                "max-w-[75%] p-4 text-sm rounded-2xl relative shadow-sm",
                                                isAdmin
                                                    ? "bg-emerald-600 text-white rounded-tl-none shadow-emerald-500/10"
                                                    : "bg-white/10 text-white rounded-tr-none border border-white/10"
                                            )}>
                                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                <span className={cn(
                                                    "text-[10px] block mt-1 text-left opacity-60",
                                                    isAdmin ? "text-emerald-100" : "text-white/40"
                                                )}>
                                                    {new Date(msg.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-950/30">
                            <div className="flex gap-3 relative">
                                <input
                                    type="text"
                                    placeholder="پاسخ خود را بنویسید..."
                                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all text-sm font-medium"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || !input.trim()}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-emerald-500/20"
                                >
                                    {isSending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5 rtl:rotate-180" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center hidden md:flex">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-bold text-lg">یک گفتگو را انتخاب کنید</p>
                        <p className="text-sm mt-2 max-w-xs leading-relaxed">برای شروع پاسخگویی، یکی از گفتگوهای لیست سمت راست را انتخاب نمایید.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
