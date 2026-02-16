import { redirect } from "next/navigation";
import { getProfile, getNextEvent } from "@/app/actions/members";
import Link from 'next/link';
import { JoinButton } from "./JoinButton";

// Components
import { Mountain, LogOut, CheckCircle, XCircle } from "lucide-react";
import { signout } from "@/app/actions/auth-user";

export default async function DashboardPage() {
    const profileRes = await getProfile();

    if (!profileRes.success || !profileRes.data) {
        // If getting profile failed (likely 401), redirect to login
        redirect("/login");
    }

    const profile = profileRes.data;
    const eventRes = await getNextEvent();
    const nextEvent = eventRes.success ? eventRes.data : null;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Top Bar */}
            <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-1.5 rounded-lg">
                            <Mountain className="h-5 w-5 text-slate-950" />
                        </div>
                        <span className="font-display text-xl">پنل کوهنوردان</span>
                    </div>

                    <form action={signout}>
                        <button className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-sm">
                            <span className="hidden sm:inline">خروج</span>
                            <LogOut className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-2">

                {/* 1. Welcome & Status Card */}
                <section className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">سلام، {profile.full_name} 👋</h1>
                            <p className="text-white/60">به باشگاه اوجِ رشد خوش آمدید.</p>
                        </div>

                        <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${profile.subscription_status === 'active'
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            }`}>
                            {profile.subscription_status === 'active' ? (
                                <>
                                    <CheckCircle className="h-6 w-6" />
                                    <div>
                                        <div className="font-bold text-sm">اشتراک فعال</div>
                                        <div className="text-xs opacity-70">تا ۲۵ روز دیگر</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-6 w-6" />
                                    <div>
                                        <div className="font-bold text-sm">اشتراک غیرفعال</div>
                                        <div className="text-xs opacity-70">لطفا تمدید کنید</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* 2. Next Event Card */}
                <section className="bg-slate-900 rounded-3xl p-6 border border-white/5 flex flex-col">
                    <div className="mb-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                برنامه بعدی
                            </h2>
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-white/50">{nextEvent ? nextEvent.date.split('T')[0] : '---'}</span>
                        </div>

                        {nextEvent ? (
                            <div className="space-y-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                                    <h3 className="font-bold text-lg mb-1">{nextEvent.title}</h3>
                                    <p className="text-white/60 text-sm mb-4">{nextEvent.location} • ظرفیت: {nextEvent.capacity} نفر</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{nextEvent.description}</p>
                                    {nextEvent.weather_note && (
                                        <div className="mt-3 text-xs bg-blue-500/10 text-blue-300 px-3 py-2 rounded-lg">
                                            🌤 وضعیت هوا: {nextEvent.weather_note}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-white/50 text-center py-8 bg-slate-950 rounded-xl border border-white/5 border-dashed">
                                هیچ برنامه‌ای فعلا تعریف نشده است.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        {profile.subscription_status === 'active' ? (
                            nextEvent ? (
                                <JoinButton eventId={nextEvent.id} status={nextEvent.user_booking_status} />
                            ) : (
                                <button disabled className="w-full py-3 rounded-xl bg-white/5 text-white/30 cursor-not-allowed font-bold">
                                    منتظر برنامه باشید
                                </button>
                            )
                        ) : (
                            <button className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                                پرداخت اشتراک (۹۰۰,۰۰۰ تومان)
                            </button>
                            // TODO: Link to Manual Payment Modal
                        )}
                    </div>
                </section>

                {/* 3. Quick Actions / History */}
                <section className="bg-slate-900 rounded-3xl p-6 border border-white/5">
                    <h2 className="text-xl font-bold mb-6">دسترسی سریع</h2>

                    <div className="grid gap-4">
                        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group">
                            <span className="font-medium">تاریخچه صعودها</span>
                            <span className="text-white/30 text-xs">بزودی</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group">
                            <span className="font-medium">وضعیت جسمانی من</span>
                            <span className="text-white/30 text-xs">بزودی</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group">
                            <span className="font-medium">ارتباط با پشتیبانی</span>
                            <span className="text-white/30 text-xs">تلگرام</span>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

