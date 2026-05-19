import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/members";
import { getMyAdminRequest } from "@/app/actions/admin-requests";
import { getWalletBalance } from "@/app/actions/wallet";
import { getMySubscription } from "@/app/actions/subscriptions";
import ProfileForm from "./ProfileForm";
import AvatarUpload from "./AvatarUpload";
import { DashboardHeader } from "@/app/dashboard/DashboardHeader";
import { User, ShieldCheck, Wallet, Crown, Mountain, Star } from "lucide-react";
import { toPersianNum, toPersianPrice } from "@/lib/utils";

export default async function ProfilePage() {
    const profileRes = await getProfile();
    if (!profileRes.success || !profileRes.data) {
        redirect("/login");
    }

    const profile = profileRes.data;

    // Fetch additional data in parallel
    const [adminReqRes, walletRes, subRes] = await Promise.all([
        getMyAdminRequest(),
        getWalletBalance(),
        getMySubscription(),
    ]);

    const adminRequest = adminReqRes.success ? adminReqRes.data : null;
    const walletBalance = walletRes.success ? (walletRes as unknown as { balance: number }).balance : 0;

    const roleLabels: Record<string, { label: string; color: string }> = {
        member: { label: "عضو", color: "white" },
        admin: { label: "ادمین 🛡️", color: "purple" },
        guide: { label: "راهنما 🧭", color: "cyan" },
        owner: { label: "مالک 👑", color: "amber" },
    };

    const roleInfo = roleLabels[profile.role] || roleLabels.member;

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            <DashboardHeader profile={profile} />

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <User className="w-7 h-7 text-slate-950" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">پروفایل کاربری</h1>
                        <p className="text-white/50 text-sm mt-1">مدیریت اطلاعات، رزومه و تنظیمات حساب</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3 relative">
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        {/* Avatar & Name Card */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="mb-4">
                                    <AvatarUpload currentAvatarUrl={profile.avatar_url} userName={profile.full_name} />
                                </div>
                                <h2 className="text-xl font-bold mb-1">{profile.full_name}</h2>
                                <div className="text-sm font-mono text-white/50 mb-3">
                                    {profile.phone_number ? toPersianNum(profile.phone_number) : "شماره موبایل ثبت نشده"}
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-${roleInfo.color}-500/10 text-${roleInfo.color}-400 border border-${roleInfo.color}-500/20 mb-2`}>
                                    <Crown className="w-3 h-3" />
                                    <span>{roleInfo.label}</span>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${profile.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>
                                        {profile.subscription_status === 'active' ? 'اشتراک فعال' : 'بدون اشتراک فعال'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Card */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-900/50 to-emerald-900/10 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <h3 className="text-sm font-bold text-white/70 mb-3 flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-emerald-400" />
                                کیف پول
                            </h3>
                            <div className="text-3xl font-black text-emerald-400 mb-1 font-mono">
                                {toPersianPrice(walletBalance)} <span className="text-sm text-white/30 font-sans">تومان</span>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-900/50 to-cyan-900/10 border border-white/5 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-sm font-bold text-white/70 mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-400" />
                                آمار من
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-white/40">برنامه‌های شرکت‌کرده</span>
                                    <span className="text-lg font-black text-cyan-400">{toPersianNum(profile.total_events_attended || 0)}</span>
                                </div>
                                {profile.role === "admin" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/40">دعوت رایگان باقی‌مانده</span>
                                        <span className="text-lg font-black text-purple-400">{toPersianNum(profile.free_invites_remaining || 0)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2">
                        <ProfileForm initialProfile={profile} adminRequest={adminRequest as unknown as Parameters<typeof ProfileForm>[0]['adminRequest']} />
                    </div>
                </div>
            </main>
        </div>
    );
}
