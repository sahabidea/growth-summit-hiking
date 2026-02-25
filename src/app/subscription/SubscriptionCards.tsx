"use client";

import { useState } from "react";
import { purchaseSubscription } from "@/app/actions/subscriptions";
import { toPersianNum, toPersianPrice } from "@/lib/utils";
import { Crown, Check, Loader2, Wallet, CreditCard, Copy, CheckCircle2 } from "lucide-react";

interface Plan {
    id: string;
    name: string;
    plan: "monthly" | "quarterly" | "annual";
    price: number;
    originalPrice: number;
    features: string[];
    popular?: boolean;
}

interface SubscriptionCardsProps {
    plans: Plan[];
    currentSubscription: any;
    walletBalance: number;
}

export default function SubscriptionCards({ plans, currentSubscription, walletBalance }: SubscriptionCardsProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"card_transfer" | "wallet">("card_transfer");
    const [trackingCode, setTrackingCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [copiedCard, setCopiedCard] = useState(false);

    // Card number for payment (you can change this)
    const CARD_NUMBER = "6037-9979-XXXX-XXXX";

    const handlePurchase = async () => {
        if (!selectedPlan) return;
        if (paymentMethod === "card_transfer" && !trackingCode.trim()) {
            setMsg({ type: "error", text: "لطفاً کد رهگیری تراکنش را وارد کنید." });
            return;
        }

        setLoading(true);
        setMsg({ type: "", text: "" });

        const res = await purchaseSubscription(
            selectedPlan.plan,
            paymentMethod,
            paymentMethod === "card_transfer" ? trackingCode : undefined
        );

        if (res.success) {
            setMsg({ type: "success", text: res.message || "اشتراک با موفقیت ثبت شد." });
            setSelectedPlan(null);
        } else {
            setMsg({ type: "error", text: res.error || "خطا" });
        }
        setLoading(false);
    };

    const copyCardNumber = () => {
        navigator.clipboard.writeText(CARD_NUMBER.replace(/-/g, ""));
        setCopiedCard(true);
        setTimeout(() => setCopiedCard(false), 2000);
    };

    if (currentSubscription) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div className="text-right">
                        <p className="font-bold text-emerald-400">اشتراک فعال</p>
                        <p className="text-xs text-white/40">
                            تا {new Date(currentSubscription.ends_at).toLocaleDateString("fa-IR")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => {
                    const discount = plan.originalPrice > plan.price
                        ? Math.round((1 - plan.price / plan.originalPrice) * 100)
                        : 0;
                    const discountLabel = toPersianNum(discount);

                    return (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative rounded-3xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${selectedPlan?.id === plan.id
                                ? "bg-gradient-to-b from-emerald-500/10 to-cyan-500/5 border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10"
                                : "bg-slate-900/50 border border-white/5 hover:border-white/20"
                                } ${plan.popular ? "ring-2 ring-amber-500/30" : ""}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                                    پرطرفدار ⭐
                                </div>
                            )}

                            {discount > 0 && (
                                <div className="absolute top-4 left-4 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                                    {discountLabel}٪ تخفیف
                                </div>
                            )}

                            <h3 className="text-lg font-bold mb-2">{plan.name}</h3>

                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-3xl font-black text-emerald-400">
                                    {toPersianPrice(plan.price)}
                                </span>
                                <span className="text-sm text-white/30">تومان</span>
                                {discount > 0 && (
                                    <span className="text-sm text-white/20 line-through">
                                        {toPersianPrice(plan.originalPrice)}
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-2">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className={`mt-4 text-center py-2 rounded-xl text-sm font-bold transition-all ${selectedPlan?.id === plan.id
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-white/5 text-white/40"
                                }`}>
                                {selectedPlan?.id === plan.id ? "✓ انتخاب شده" : "انتخاب"}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payment Section */}
            {selectedPlan && (
                <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan-400" />
                        پرداخت — {selectedPlan.name}
                    </h3>

                    {/* Payment Method Toggle */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setPaymentMethod("card_transfer")}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === "card_transfer"
                                ? "bg-cyan-500 text-slate-950"
                                : "bg-white/5 text-white/50 hover:bg-white/10"
                                }`}
                        >
                            <CreditCard className="w-4 h-4" />
                            کارت به کارت
                        </button>
                        <button
                            onClick={() => setPaymentMethod("wallet")}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${paymentMethod === "wallet"
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-white/5 text-white/50 hover:bg-white/10"
                                }`}
                        >
                            <Wallet className="w-4 h-4" />
                            کیف پول ({toPersianPrice(walletBalance)} ت)
                        </button>
                    </div>

                    {paymentMethod === "card_transfer" && (
                        <div className="space-y-4">
                            {/* Card Number */}
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                                <p className="text-xs text-white/40 mb-2">مبلغ {toPersianPrice(selectedPlan.price)} تومان را به شماره کارت زیر واریز کنید:</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-mono font-bold text-cyan-400 tracking-widest">{CARD_NUMBER}</span>
                                    <button onClick={copyCardNumber} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        {copiedCard ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                                    </button>
                                </div>
                                <p className="text-xs text-white/30 mt-2">به نام: حسین حکیمیان</p>
                            </div>

                            {/* Tracking Code */}
                            <div className="space-y-2">
                                <label className="text-sm text-white/60 font-medium">کد رهگیری تراکنش</label>
                                <input
                                    type="text"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    dir="ltr"
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-cyan-500/50 transition-all text-white font-mono tracking-wider text-center"
                                    placeholder="کد رهگیری را وارد کنید"
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === "wallet" && walletBalance < selectedPlan.price && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-400 mb-4">
                            موجودی کیف پول کافی نیست. کسری: {toPersianPrice(selectedPlan.price - walletBalance)} تومان
                        </div>
                    )}

                    {/* Status Message */}
                    {msg.text && (
                        <div className={`mt-4 p-4 rounded-xl text-sm border ${msg.type === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}>
                            {msg.text}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handlePurchase}
                        disabled={loading || (paymentMethod === "wallet" && walletBalance < selectedPlan.price)}
                        className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
                        {loading ? "در حال پردازش..." : "فعال‌سازی اشتراک"}
                    </button>
                </div>
            )}
        </div>
    );
}
