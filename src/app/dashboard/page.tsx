import { redirect } from "next/navigation";
import { getProfile, getNextEvent } from "@/app/actions/members";
import Link from 'next/link';
import Image from "next/image";
import { JoinButton } from "./JoinButton";
import { DashboardHeader } from "./DashboardHeader";
import { Mountain, LogOut, CheckCircle, XCircle, Crown, LayoutDashboard } from "lucide-react";
import { signout } from "@/app/actions/auth-user";
import AdminPanelView from "./AdminPanelView";

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
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            {/* New Header */}
            <DashboardHeader profile={profile} />

            <main className="max-w-7xl mx-auto px-4 py-12">

                {/* Hero Section */}
                <section className="text-center py-20 relative overflow-hidden">
                    {/* Background Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -z-10" />

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-xs font-medium text-emerald-400 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        طبیعت‌گردی تخصصی کوهستان
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        صعودی <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">لذت‌بخش</span> و <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">ایمن</span> <br className="hidden md:block" /> را تجربه کنید
                    </h1>

                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        با متدهای نوین کوهنوردی، برنامه‌های جذاب آخر هفته و مربیان حرفه‌ای، مسیر صعود خود را هموار کنید و از طبیعت لذت ببرید.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <Link href="#next-event" className="px-8 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-bold hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                            مشاهده برنامه‌ها
                        </Link>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2">
                            شروع تعیین سطح
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                        </button>
                    </div>
                </section>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {/* Welcome & Status Card */}
                    <section className="col-span-1 md:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                    <span>سلام، {profile.full_name} 👋</span>
                                </h2>
                                <p className="text-white/60">به باشگاه اوجِ رشد خوش آمدید. آماده چالش بعدی هستید؟</p>
                            </div>

                            <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${profile.subscription_status === 'active'
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5"
                                : "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/5"
                                }`}>
                                {profile.subscription_status === 'active' ? (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        <div>
                                            <div className="font-bold text-sm">اشتراک طلایی فعال</div>
                                            <div className="text-[10px] opacity-70 uppercase tracking-wider">Unlimited Access</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-5 w-5" />
                                        <div>
                                            <div className="font-bold text-sm">اشتراک غیرفعال</div>
                                            <div className="text-[10px] opacity-70 uppercase tracking-wider">Upgrade Now</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center">
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏔️</span>
                            <span className="font-bold text-sm text-white/80">تاریخچه صعود</span>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center">
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💪</span>
                            <span className="font-bold text-sm text-white/80">وضعیت جسمانی</span>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center col-span-2">
                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                            <span className="font-bold text-sm text-white/80">ارتباط با پشتیبانی</span>
                        </div>
                    </div>

                    {/* Next Event Card */}
                    <section id="next-event" className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 rounded-3xl p-1 border border-white/5 shadow-2xl shadow-black/50">
                        <div className="bg-slate-950/80 rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

                            {/* Left: Image */}
                            {nextEvent?.image_url && (
                                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden relative group shrink-0 border border-white/10">
                                    <Image
                                        src={nextEvent.image_url}
                                        alt={nextEvent.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 right-4 text-white font-bold text-lg drop-shadow-md">
                                        {nextEvent.location}
                                    </div>
                                </div>
                            )}

                            {/* Right: Content */}
                            <div className="flex-1 w-full relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold borders border-emerald-500/20 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        برنامه بعدی باشگاه
                                    </div>
                                    <span className="text-white/30 text-xs font-mono">{nextEvent ? nextEvent.date.split('T')[0] : '---'}</span>
                                </div>

                                {nextEvent ? (
                                    <>
                                        <h2 className="text-2xl md:text-3xl font-black mb-3">{nextEvent.title}</h2>
                                        <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">{nextEvent.description}</p>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                <div className="text-xs text-white/40 mb-1">ظرفیت</div>
                                                <div className="font-bold text-emerald-400">{nextEvent.capacity} نفر</div>
                                            </div>
                                            {nextEvent.weather_note && (
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 col-span-2 sm:col-span-1">
                                                    <div className="text-xs text-white/40 mb-1">پیش‌بینی هوا</div>
                                                    <div className="font-bold text-cyan-400 text-sm truncate">{nextEvent.weather_note}</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-6">
                                            <Link
                                                href={`/hikes/${nextEvent.id}`}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors shadow-lg border border-white/10 text-center"
                                            >
                                                جزئیات و تبادل نظر
                                            </Link>

                                            {profile.subscription_status === 'active' ? (
                                                <div className="w-full sm:w-auto">
                                                    <JoinButton eventId={nextEvent.id} status={nextEvent.user_booking_status} />
                                                </div>
                                            ) : (
                                                <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                                                    <Crown className="w-5 h-5" />
                                                    خرید اشتراک برای شرکت
                                                </button>
                                            )}
                                            <div className="hidden sm:block text-xs text-white/30">
                                                * ظرفیت محدود است، لطفا سریعتر رزرو کنید.
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-white/50 py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                        هیچ برنامه‌ای برای نمایش وجود ندارد.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Admin Panel Section - Only for Admins and Owners */}
                    {(profile.role === 'admin' || profile.role === 'owner') && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-8 animate-in fade-in slide-in-from-bottom-12 duration-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <LayoutDashboard className="w-6 h-6 text-amber-500" />
                                </div>
                                <h2 className="text-2xl font-bold">پنل مدیریت سیستم</h2>
                            </div>
                            <AdminPanelView userRole={profile.role} userId={profile.id} canManageUsers={profile.can_manage_users} canUseLivechat={profile.can_use_livechat} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
