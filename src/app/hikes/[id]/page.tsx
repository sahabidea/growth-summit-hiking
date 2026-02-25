import { getEventDetails } from "@/app/actions/event-comments";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, CalendarDays, MapPin, Users, MessageCircle, Activity, Mountain, Clock, Flame, Backpack, AlertCircle, Crown, LogIn } from "lucide-react";
import EventCommentsClient from "./EventCommentsClient";
import Image from "next/image";
import { JoinButton } from "@/app/dashboard/JoinButton";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Check if ID is UUID-like to prevent DB errors on invalid URLs
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUUID) notFound();

    const res = await getEventDetails(id);

    if (!res.success || !res.data) {
        notFound();
    }

    const event = res.data;

    let isAdmin = false;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') isAdmin = true;
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-32 pt-28 px-4 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

            <article className="max-w-4xl mx-auto relative z-10 w-full">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 text-sm font-black text-white/50 hover:text-white transition-colors mb-12 group bg-slate-900 border border-white/5 px-6 py-3 rounded-full hover:border-amber-500/30 w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    بازگشت به پنل کاربری
                </Link>

                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black mb-6">
                        برنامه صعود تخصصی
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.3] text-white">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-bold text-white/60 mb-10 py-6 border-y border-white/10 break-words">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-emerald-400" />
                            {event.location}
                            {event.map_link && (
                                <a
                                    href={event.map_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1"
                                >
                                    نقشه <MapPin className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-amber-400" />
                            {event.date.split('T')[0]}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-cyan-400" />
                            ظرفیت: {event.attendeesCount || 0} / {event.capacity} نفر
                        </div>
                    </div>

                    {event.image_url && (
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-2xl border border-white/10">
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        </div>
                    )}

                    {/* Join / Registration Block */}
                    {event.status === 'scheduled' && (
                        <div className="mb-16 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                            <div className="absolute w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -z-10" />

                            <h2 className="text-2xl font-black mb-4">ثبت‌نام در این برنامه</h2>

                            {!event.isAuthenticated ? (
                                <>
                                    <p className="text-white/60 mb-8 max-w-md mx-auto">برای شرکت در برنامه‌های باشگاه، ابتدا باید وارد حساب کاربری خود شوید و اشتراک تهیه کنید.</p>
                                    <Link href="/login" className="px-8 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-bold hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                                        <LogIn className="w-5 h-5" /> ورود و ثبت‌نام
                                    </Link>
                                </>
                            ) : event.subscriptionStatus !== 'active' ? (
                                <>
                                    <p className="text-white/60 mb-8 max-w-md mx-auto">حساب کاربری شما فعال نیست. برای شرکت در این برنامه، نیاز به اشتراک فعال دارید.</p>
                                    <button className="px-8 py-4 bg-amber-500 text-slate-950 rounded-2xl font-bold hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2">
                                        <Crown className="w-5 h-5" /> خرید اشتراک برای شرکت
                                    </button>
                                </>
                            ) : (
                                <div className="w-full max-w-sm mx-auto">
                                    <p className="text-white/60 mb-6 font-medium">شما اشتراک فعال دارید. با کلیک روی دکمه زیر می‌توانید جایگاه خود را در این برنامه رزرو کنید.</p>
                                    <JoinButton eventId={event.id} status={event.userBookingStatus} />
                                </div>
                            )}
                        </div>
                    )}
                </header>

                <div className="prose prose-invert prose-lg max-w-none text-white/80 mb-20 whitespace-pre-wrap leading-loose">
                    {event.description}
                </div>

                {event.equipment_list && (
                    <div className="mb-12 bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-white/5">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400">
                            <Backpack className="w-6 h-6" />
                            <h2 className="text-2xl font-black">تجهیزات مورد نیاز</h2>
                        </div>
                        <div className="prose prose-invert prose-lg max-w-none text-white/80 whitespace-pre-wrap leading-loose pr-9">
                            {event.equipment_list}
                        </div>
                    </div>
                )}

                {event.special_notes && (
                    <div className="mb-20 bg-amber-500/5 p-6 md:p-8 rounded-[2rem] border border-amber-500/10">
                        <div className="flex items-center gap-3 mb-4 text-amber-500">
                            <AlertCircle className="w-6 h-6" />
                            <h2 className="text-2xl font-black">نکات مهم برنامه</h2>
                        </div>
                        <div className="prose prose-invert prose-lg max-w-none text-white/80 whitespace-pre-wrap leading-loose pr-9">
                            {event.special_notes}
                        </div>
                    </div>
                )}

                {event.status === 'completed' && (event.distance_km || event.calories_burned) && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-black mb-6 text-emerald-400 flex items-center gap-2">
                            <Activity className="w-6 h-6" /> آمار و گزارش صعود
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/30 transition-colors">
                                <Activity className="w-8 h-8 text-emerald-500 mb-3" />
                                <span className="text-white/50 text-xs font-bold mb-1">مسافت طی شده</span>
                                <span className="text-3xl font-black text-white">{event.distance_km || 0} <span className="text-sm font-normal text-white/40">کیلومتر</span></span>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/30 transition-colors">
                                <Mountain className="w-8 h-8 text-indigo-400 mb-3" />
                                <span className="text-white/50 text-xs font-bold mb-1">ارتفاع صعود شده</span>
                                <span className="text-3xl font-black text-white">{event.elevation_gain || 0} <span className="text-sm font-normal text-white/40">متر</span></span>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/30 transition-colors">
                                <Clock className="w-8 h-8 text-amber-400 mb-3" />
                                <span className="text-white/50 text-xs font-bold mb-1">زمان تخمینی حرکت</span>
                                <span className="text-3xl font-black text-white">{event.duration_minutes || 0} <span className="text-sm font-normal text-white/40">دقیقه</span></span>
                            </div>
                            <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg hover:border-emerald-500/30 transition-colors">
                                <Flame className="w-8 h-8 text-orange-500 mb-3" />
                                <span className="text-white/50 text-xs font-bold mb-1">کالری مصرفی (تقریبی)</span>
                                <span className="text-3xl font-black text-white">{event.calories_burned || 0} <span className="text-sm font-normal text-white/40">Kcal</span></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                {event.status === 'completed' ? (
                    <div className="border-t border-white/10 pt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                                <MessageCircle className="w-6 h-6 text-amber-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white">تبادل نظر همنوردان</h2>
                        </div>

                        <p className="text-white/60 font-medium mb-12">
                            آیا در این برنامه شرکت داشتید؟ نظرات، تجربیات و انرژی‌های خود را با سایر دوستان به اشتراک بگذارید.
                        </p>

                        <EventCommentsClient eventId={id} initialComments={event.comments || []} isAdmin={isAdmin} />
                    </div>
                ) : (
                    <div className="border-t border-white/10 pt-16">
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 text-center md:text-right shadow-lg">
                            <div className="bg-white/5 p-4 rounded-full">
                                <MessageCircle className="w-10 h-10 text-white/20" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-white mb-2">بخش تبادل نظر موقتاً بسته است</h3>
                                <p className="text-white/50 font-medium">
                                    نظرات و تبادل تجربیات بلافاصله پس از پایان برنامه در این قسمت باز خواهد شد. منتظر انرژی‌های خوب شما بعد از صعود هستیم!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
