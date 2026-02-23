"use client";

import { useState } from "react";
import { addEventComment, deleteEventComment } from "@/app/actions/event-comments";
import { Send, User as UserIcon, Loader2, Trash2 } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        full_name: string;
    } | null;
}

export default function EventCommentsClient({ eventId, initialComments, isAdmin = false }: { eventId: string, initialComments: Comment[], isAdmin?: boolean }) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [draft, setDraft] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!draft.trim()) return;

        setIsSubmitting(true);
        const res = await addEventComment(eventId, draft);

        if (!res.success) {
            setError(res.error || "خطایی رخ داد. لطفا ابتدا وارد سیستم شوید یا مجددا تلاش کنید.");
            setIsSubmitting(false);
            return;
        }

        // We optimistically rely on server action's revalidatePath
        // but for immediate feedback without page refresh:
        const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            content: draft,
            created_at: new Date().toISOString(),
            user_id: "me",
            profiles: { full_name: "شما (در حال ثبت)" }
        };

        setComments([...comments, optimisticComment]);
        setDraft("");
        setIsSubmitting(false);
        // Page data refresh handles true state after revalidation
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("آیا از حذف این نظر اطمینان دارید؟")) return;

        // Optimistic delete
        setComments(comments.filter(c => c.id !== commentId));

        const res = await deleteEventComment(commentId, eventId);
        if (!res.success) {
            alert("خطا در حذف نظر: " + res.error);
            // Revert optimisic if we wanted, but DB state is refreshed anyway on next load
        }
    };

    return (
        <div className="space-y-12">
            <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-4 shadow-xl">
                <label className="text-white/80 font-bold mb-2 block text-lg">ارسال نظر جدید:</label>
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="در این صعود چه تجربه‌ای داشتید؟ فضای تیم چطور بود؟"
                    className="w-full h-32 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50 resize-y transition-colors leading-relaxed placeholder:text-white/20"
                    disabled={isSubmitting}
                />

                {error && <div className="text-rose-400 text-sm font-bold bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</div>}

                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !draft.trim()}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> در حال ارسال...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 rtl:-scale-x-100" /> ثبت تجربه
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center p-12 bg-white/5 border border-white/5 border-dashed rounded-3xl text-white/40">
                        هنوز تجربه‌ای ثبت نشده است. شما اولین نفر باشید!
                    </div>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-lg group hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 rounded-full border border-white/10 flex-shrink-0">
                                        <UserIcon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                                            {c.profiles?.full_name || 'کاربر مهمان'}
                                        </div>
                                        <div className="text-xs text-white/40 font-mono mt-1">
                                            {new Date(c.created_at).toLocaleDateString('fa-IR')}
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                                        title="حذف پیام توسط ادمین"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-white/70 leading-loose whitespace-pre-wrap pl-2 md:pl-16">
                                {c.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
