"use client";

import { useState, useEffect } from "react";
import { getAllAdminRequests, reviewAdminRequest, confirmAdminPayment } from "@/app/actions/admin-requests";
import {
    Shield, Clock, CheckCircle2, XCircle, CreditCard,
    Eye, ChevronDown, Loader2, Percent, DollarSign,
    User, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminRequestItem {
    id: string;
    user_id: string;
    motivation: string;
    experience: string | null;
    status: string;
    discount_percent: number;
    admin_fee: number;
    payment_status: string;
    payment_method: string | null;
    card_transfer_tracking_code: string | null;
    created_at: string;
    profiles: {
        full_name: string;
        phone_number: string | null;
        avatar_url: string | null;
        bio: string | null;
        experience: string | null;
        goals: string | null;
        personal_values: string | null;
        total_events_attended: number;
    };
}

export default function AdminRequestsManager() {
    const [requests, setRequests] = useState<AdminRequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [reviewingId, setReviewingId] = useState<string | null>(null);

    // Review form
    const [discount, setDiscount] = useState(0);
    const [adminFee, setAdminFee] = useState(500000);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const res = await getAllAdminRequests();
        if (res.success && res.data) setRequests(res.data as AdminRequestItem[]);
        setLoading(false);
    };

    const handleReview = async (id: string, action: "approve" | "reject" | "payment_required") => {
        setActionLoading(true);
        const finalFee = action === "reject" ? 0 : adminFee - (adminFee * discount / 100);
        await reviewAdminRequest(id, action, discount, finalFee);
        await loadRequests();
        setReviewingId(null);
        setActionLoading(false);
    };

    const handleConfirmPayment = async (id: string) => {
        setActionLoading(true);
        await confirmAdminPayment(id);
        await loadRequests();
        setActionLoading(false);
    };

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        pending: { label: "در انتظار بررسی", color: "amber", icon: Clock },
        approved: { label: "تایید شده", color: "emerald", icon: CheckCircle2 },
        rejected: { label: "رد شده", color: "rose", icon: XCircle },
        payment_required: { label: "در انتظار پرداخت", color: "cyan", icon: CreditCard },
    };

    if (loading) {
        return <div className="text-center py-12 text-white/30"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    درخواست‌های ادمین ({requests.length})
                </h2>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12 text-white/20">هیچ درخواستی وجود ندارد.</div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const cfg = statusConfig[req.status] || statusConfig.pending;
                        const Icon = cfg.icon;
                        const isExpanded = expandedId === req.id;
                        const isReviewing = reviewingId === req.id;

                        return (
                            <div key={req.id} className="bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
                                {/* Header */}
                                <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold shrink-0 overflow-hidden">
                                        {req.profiles?.avatar_url ? (
                                            <img src={req.profiles.avatar_url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            req.profiles?.full_name?.[0] || "?"
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{req.profiles?.full_name}</p>
                                        <p className="text-white/30 text-xs font-mono">{req.profiles?.phone_number}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${cfg.color}-500/10 text-${cfg.color}-400 border border-${cfg.color}-500/20`}>
                                        {cfg.label}
                                    </div>
                                    <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", isExpanded && "rotate-180")} />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                                        {/* Motivation */}
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <h4 className="text-xs font-bold text-white/40 mb-2 flex items-center gap-1">
                                                <FileText className="w-3 h-3" /> انگیزه‌نامه
                                            </h4>
                                            <p className="text-sm text-white/70 leading-relaxed">{req.motivation}</p>
                                        </div>

                                        {/* Experience */}
                                        {req.experience && (
                                            <div className="bg-white/5 rounded-xl p-4">
                                                <h4 className="text-xs font-bold text-white/40 mb-2">تجربیات سرگروهی</h4>
                                                <p className="text-sm text-white/70 leading-relaxed">{req.experience}</p>
                                            </div>
                                        )}

                                        {/* Profile Resume */}
                                        {req.profiles && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {req.profiles.bio && (
                                                    <div className="bg-white/5 rounded-xl p-3">
                                                        <h5 className="text-[10px] font-bold text-white/30 mb-1">بیو</h5>
                                                        <p className="text-xs text-white/60">{req.profiles.bio}</p>
                                                    </div>
                                                )}
                                                {req.profiles.goals && (
                                                    <div className="bg-white/5 rounded-xl p-3">
                                                        <h5 className="text-[10px] font-bold text-white/30 mb-1">اهداف</h5>
                                                        <p className="text-xs text-white/60">{req.profiles.goals}</p>
                                                    </div>
                                                )}
                                                {req.profiles.personal_values && (
                                                    <div className="bg-white/5 rounded-xl p-3">
                                                        <h5 className="text-[10px] font-bold text-white/30 mb-1">ارزش‌ها</h5>
                                                        <p className="text-xs text-white/60">{req.profiles.personal_values}</p>
                                                    </div>
                                                )}
                                                <div className="bg-white/5 rounded-xl p-3">
                                                    <h5 className="text-[10px] font-bold text-white/30 mb-1">شرکت در برنامه‌ها</h5>
                                                    <p className="text-lg font-black text-cyan-400">{req.profiles.total_events_attended || 0}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment tracking code */}
                                        {req.card_transfer_tracking_code && (
                                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
                                                <span className="text-xs text-white/40">کد رهگیری: </span>
                                                <span className="text-sm font-mono text-cyan-400 font-bold">{req.card_transfer_tracking_code}</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {req.status === "pending" && (
                                            <>
                                                {!isReviewing ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setReviewingId(req.id)}
                                                            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-bold hover:bg-emerald-400 transition-colors"
                                                        >
                                                            بررسی و تصمیم
                                                        </button>
                                                        <button onClick={() => handleReview(req.id, "reject")} disabled={actionLoading}
                                                            className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 text-sm font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                                                        >
                                                            رد
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-xs text-white/40 font-bold flex items-center gap-1">
                                                                    <DollarSign className="w-3 h-3" /> هزینه ادمین (تومان)
                                                                </label>
                                                                <input type="number" value={adminFee} onChange={(e) => setAdminFee(Number(e.target.value))}
                                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-sm font-mono text-white outline-none focus:border-emerald-500"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs text-white/40 font-bold flex items-center gap-1">
                                                                    <Percent className="w-3 h-3" /> تخفیف (٪)
                                                                </label>
                                                                <input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-sm font-mono text-white outline-none focus:border-emerald-500"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="text-sm text-white/50">
                                                            مبلغ نهایی: <span className="text-emerald-400 font-bold font-mono">
                                                                {(adminFee - (adminFee * discount / 100)).toLocaleString()} تومان
                                                            </span>
                                                            {discount === 100 && <span className="text-amber-400 mr-2">(رایگان — ادمین فوری)</span>}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            {discount === 100 ? (
                                                                <button onClick={() => handleReview(req.id, "approve")} disabled={actionLoading}
                                                                    className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                                >
                                                                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                                    تایید و ادمین کردن
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handleReview(req.id, "payment_required")} disabled={actionLoading}
                                                                    className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                                >
                                                                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                                                    تایید و ارسال صورتحساب
                                                                </button>
                                                            )}
                                                            <button onClick={() => setReviewingId(null)}
                                                                className="px-4 py-2 rounded-lg bg-white/5 text-white/50 text-sm font-bold hover:bg-white/10 transition-colors"
                                                            >
                                                                لغو
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Confirm payment button for payment_required requests with tracking code */}
                                        {req.status === "payment_required" && req.card_transfer_tracking_code && (
                                            <button onClick={() => handleConfirmPayment(req.id)} disabled={actionLoading}
                                                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                تایید پرداخت و ادمین کردن
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
