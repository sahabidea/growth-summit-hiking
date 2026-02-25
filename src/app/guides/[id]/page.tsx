import { createClient } from "@/lib/supabase/server";
import { Users, Star, Award, Instagram, Calendar, MapPin, Users as UsersIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache for 60 seconds

async function getGuide(id: string) {
    const supabase = await createClient();

    // Fetch guide profile
    const { data: guide, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return { error: `Profile Error: ${error.message} (ID: ${id})` };
    }

    if (!guide) {
        return { error: 'Guide not found in database.' };
    }

    // Only allow viewing if they are admin or owner
    if (guide.role !== 'admin' && guide.role !== 'owner') {
        return { error: `Not authorized to view role: ${guide.role}` };
    }

    // Apply the same avatar fallbacks requested
    if (guide.role === 'owner') {
        guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771224157/photo_2026-02-14_14-19-59_llyvov.jpg";
    } else if (guide.full_name?.includes('صفرائی') || guide.full_name?.includes('مهدی')) {
        guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771911000/photo_2026-02-24_08-39-33_oaiffm.jpg";
    } else if (guide.full_name?.includes('حسین') || guide.full_name?.includes('حکم')) {
        guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-27-05_t2jnix.jpg";
    }

    // Fetch guide's events (where they are the organizer)
    const { data: events } = await supabase
        .from('events')
        .select(`
            id, title, date, location, capacity, status,
            bookings(count)
        `)
        .eq('organizer_id', id)
        .order('date', { ascending: true }); // Soonest first

    // Separate active/upcoming events from past events
    const now = new Date();
    const activeEvents = [];
    const pastEvents = [];

    if (events) {
        for (const event of events) {
            const eventDate = new Date(event.date);
            if (event.status === 'completed' || eventDate < now) {
                pastEvents.push(event);
            } else if (event.status !== 'cancelled') {
                activeEvents.push(event);
            }
        }
    }

    return { guide, activeEvents, pastEvents };
}

export default async function GuideProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const data = await getGuide(resolvedParams.id);

    if (data && data.error) {
        return (
            <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="bg-red-500/20 p-8 rounded-2xl border border-red-500/50">
                    <h1 className="text-xl font-bold mb-4">خطا در دریافت اطلاعات</h1>
                    <p className="font-mono text-sm">{data.error}</p>
                </div>
            </main>
        );
    }

    if (!data) {
        notFound();
    }

    const { guide, activeEvents, pastEvents } = data as any;

    return (
        <main className="min-h-screen bg-slate-950 font-vazirmatn text-white selection:bg-emerald-500/30 pb-20">
            <Navbar />

            {/* Profile Header Block */}
            <div className="bg-slate-900 border-b border-white/10 pt-32 pb-12 relative overflow-hidden" dir="rtl">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-slate-950 shadow-2xl relative z-10 bg-slate-800">
                                {guide.avatar_url ? (
                                    <img src={guide.avatar_url} alt={guide.full_name} className="w-full h-full object-cover object-[50%_15%]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-16 h-16 text-white/20" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-slate-950 z-20 shadow-lg">
                                <Star className="w-5 h-5 text-slate-950 fill-slate-950" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-right">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-white/60 mb-3">
                                        {guide.role === 'owner' ? 'مدرس ارشد / مالک باشگاه' : 'سرگروه تخصصی'}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-black">{guide.full_name || "راهنمای ناشناس"}</h1>
                                </div>
                                {guide.instagram_url && (
                                    <a
                                        href={guide.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/20 px-4 py-2 rounded-xl transition-all font-bold text-sm text-pink-400 max-w-fit mx-auto md:mx-0"
                                    >
                                        <Instagram className="w-4 h-4" />
                                        اینستاگرام
                                    </a>
                                )}
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                                {guide.specialties && guide.specialties.length > 0 ? (
                                    guide.specialties.map((spec: string, i: number) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold shadow-inner">
                                            <Award className="w-4 h-4" />
                                            {spec}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-white/30 text-sm font-bold">بدون تخصص ثبت شده</span>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl text-white/70 text-sm md:text-base leading-relaxed text-justify">
                                {guide.bio ? (
                                    <p className="whitespace-pre-line">{guide.bio}</p>
                                ) : (
                                    <p className="italic opacity-50 text-center">بیوگرافی برای این راهنما ثبت نشده است.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Switcher / Tabs */}
            <div className="max-w-4xl mx-auto px-4 mt-12" dir="rtl">

                {/* 1. Active Events */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <h2 className="text-2xl font-black">برنامه‌های پیش‌رو با {guide.full_name}</h2>
                    </div>

                    {activeEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeEvents.map((event: any) => (
                                <Link href={`/hikes/${event.id}`} key={event.id}>
                                    <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl hover:border-emerald-500/30 transition-all hover:bg-slate-800/80 group">
                                        <h3 className="font-bold text-lg mb-4 group-hover:text-emerald-400 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="flex gap-2 text-sm text-white/60">
                                                <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <span className="truncate">{new Date(event.date).toLocaleDateString("fa-IR")}</span>
                                            </div>
                                            <div className="flex gap-2 text-sm text-white/60">
                                                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex gap-2 text-sm text-white/60 col-span-2">
                                                <UsersIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <span>ظرفیت: {event.capacity} نفر ({event.bookings?.[0]?.count || 0} ثبت‌نام)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center text-white/40 font-bold">
                            در حال حاضر برنامه آزادی با این راهنما وجود ندارد.
                        </div>
                    )}
                </div>

                {/* 2. Past Events */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <h2 className="text-2xl font-black text-white/80">سوابق برنامه‌ها</h2>
                    </div>

                    {pastEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pastEvents.map((event: any) => (
                                <div key={event.id} className="bg-slate-900/50 border border-white/5 p-4 rounded-xl opacity-70 hover:opacity-100 transition-opacity">
                                    <h3 className="font-bold text-sm mb-2 truncate text-white/80">
                                        {event.title}
                                    </h3>
                                    <div className="flex flex-col gap-1 text-xs text-white/50">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString("fa-IR")}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {event.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center text-white/30 font-bold text-sm">
                            هنوز سابقه برنامه‌ای برای این راهنما ثبت نشده است.
                        </div>
                    )}
                </div>

            </div>

            <Footer />
        </main>
    );
}
