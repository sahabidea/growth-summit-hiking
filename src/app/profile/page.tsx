import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/members";
import ProfileForm from "./ProfileForm";
import { DashboardHeader } from "@/app/dashboard/DashboardHeader";
import { User, ShieldCheck } from "lucide-react";

export default async function ProfilePage() {
    const profileRes = await getProfile();

    if (!profileRes.success || !profileRes.data) {
        redirect("/login");
    }

    const profile = profileRes.data;

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <DashboardHeader profile={profile} />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <User className="w-7 h-7 text-slate-950" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">پروفایل کاربری</h1>
                        <p className="text-white/50 text-sm mt-1">مدیریت اطلاعات حساب و تنظیمات امنیتی</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3 relative">
                    {/* Background glows */}
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

                    {/* Sidebar / Info */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-4xl shadow-xl shadow-emerald-500/20 mb-4 overflow-hidden relative border-2 border-white/10">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"
                                    )}
                                </div>
                                <h2 className="text-xl font-bold mb-1">{profile.full_name}</h2>
                                <div className="text-sm font-mono text-white/50 mb-4">
                                    {profile.phone_number || "شماره موبایل ثبت نشده"}
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${profile.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>
                                        {profile.subscription_status === 'active' ? 'اشتراک فعال' : 'بدون اشتراک فعال'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional aesthetic card */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-900/50 to-emerald-900/10 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <h3 className="text-sm font-bold text-white/70 mb-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                نکته امنیتی
                            </h3>
                            <p className="text-xs text-white/50 leading-relaxed">
                                همیشه از رمز عبور قدرتمند شامل حروف بزرگ، کوچک و اعداد استفاده کنید. ما امنیت اطلاعات شما را تضمین می‌کنیم.
                            </p>
                        </div>
                    </div>

                    {/* Form Component */}
                    <div className="md:col-span-2">
                        <ProfileForm initialProfile={profile} />
                    </div>
                </div>
            </main>
        </div>
    );
}
