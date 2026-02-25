import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/members";
import { getMySubscription, getSubscriptionPlans } from "@/app/actions/subscriptions";
import { DashboardHeader } from "@/app/dashboard/DashboardHeader";
import SubscriptionCards from "./SubscriptionCards";
import { Crown, Star, Zap, Shield, Gift, Check } from "lucide-react";

export default async function SubscriptionPage() {
    const profileRes = await getProfile();
    if (!profileRes.success || !profileRes.data) {
        redirect("/login");
    }

    const profile = profileRes.data;
    const plans = await getSubscriptionPlans();
    const subRes = await getMySubscription();
    const currentSub = subRes.success ? subRes.data : null;

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            <DashboardHeader profile={profile} />

            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-[100px] -z-10" />
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold mb-4 border border-amber-500/20">
                        <Crown className="w-4 h-4" />
                        اشتراک ویژه
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-3">
                        به قله دسترسی برسید
                    </h1>
                    <p className="text-white/50 max-w-lg mx-auto leading-relaxed">
                        با اشتراک ویژه، به تمام برنامه‌های صعود دسترسی پیدا کنید، نظر بدهید و از محتوای انحصاری بهره‌مند شوید.
                    </p>
                </div>

                {/* Plans */}
                <SubscriptionCards plans={plans} currentSubscription={currentSub} walletBalance={profile.wallet_balance || 0} />

                {/* Features Comparison */}
                <div className="mt-16 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            مقایسه امکانات
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {[
                            { feature: "مشاهده برنامه‌های صعود", free: "فقط اولین برنامه هر سرگروه", premium: "تمام برنامه‌ها" },
                            { feature: "ثبت‌نام در برنامه‌ها", free: "❌", premium: "✅ نامحدود" },
                            { feature: "نظردهی و بحث", free: "❌", premium: "✅ بعد از ۲ برنامه" },
                            { feature: "دسترسی به مسیرهای GPX", free: "❌", premium: "✅" },
                            { feature: "محتوای آموزشی انحصاری", free: "❌", premium: "✅" },
                            { feature: "پشتیبانی اولویت‌دار", free: "❌", premium: "✅" },
                            { feature: "بج‌های دستاورد", free: "❌", premium: "✅" },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 p-4 text-sm hover:bg-white/5 transition-colors">
                                <div className="font-bold text-white/80">{row.feature}</div>
                                <div className="text-center text-white/40">{row.free}</div>
                                <div className="text-center text-emerald-400 font-bold">{row.premium}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 space-y-4">
                    <h2 className="text-xl font-bold mb-4">سوالات متداول</h2>
                    {[
                        { q: "آیا می‌توانم اشتراک را لغو کنم؟", a: "بله، هر زمان می‌توانید لغو کنید. ۵۰٪ مبلغ به کیف پول شما بازگشت داده می‌شود." },
                        { q: "پرداخت چگونه انجام می‌شود؟", a: "از طریق کارت به کارت. پس از واریز، کد رهگیری را ثبت کنید تا اشتراک فعال شود." },
                        { q: "آیا اشتراک تمدید خودکار دارد؟", a: "خیر. قبل از اتمام اشتراک، یادآوری دریافت خواهید کرد." },
                    ].map((faq, i) => (
                        <div key={i} className="bg-slate-900/30 border border-white/5 rounded-2xl p-5">
                            <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
