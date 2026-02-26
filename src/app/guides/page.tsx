import { createClient } from "@/lib/supabase/server";
import { Users, Star, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const revalidate = 60; // Cache for 60 seconds

async function getGuides() {
    const supabase = await createClient();

    // We fetch any user with role 'admin' or 'owner'
    // Ensure you have an appropriate index in DB if scale grows
    const { data: guides, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, specialties, role')
        .in('role', ['admin', 'owner'])
        .order('role', { ascending: false }); // "owner" comes after "admin" alphabetically, so descending puts "owner" first

    if (error) {
        console.error("Error fetching guides:", error);
        return [];
    }

    const processedGuides = (guides || []).map(guide => {
        // Fallbacks as requested by user
        if (guide.role === 'owner') {
            guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771224157/photo_2026-02-14_14-19-59_llyvov.jpg";
        } else if (guide.full_name?.includes('صفرائی') || guide.full_name?.includes('مهدی')) {
            guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771911000/photo_2026-02-24_08-39-33_oaiffm.jpg";
        } else if (guide.full_name?.includes('حسین') || guide.full_name?.includes('حکم')) {
            guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-27-05_t2jnix.jpg";
        } else if (guide.full_name?.includes('احسان') || guide.full_name?.includes('احسانپور')) {
            guide.avatar_url = "https://res.cloudinary.com/dszhmx8ny/image/upload/v1772013176/photo_2026-02-25_13-22-49_xo2tl2.jpg";
        }
        return guide;
    });

    return processedGuides;
}

export default async function GuidesGalleryPage() {
    const guides = await getGuides();
    const owners = guides.filter(g => g.role === 'owner');
    const admins = guides.filter(g => g.role !== 'owner');

    return (
        <main className="min-h-screen bg-slate-950 font-vazirmatn text-white selection:bg-emerald-500/30">
            <Navbar />

            <section className="pt-32 pb-20 relative px-4" dir="rtl">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />
                <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-slate-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10 text-center mb-16">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-bold text-sm mb-6 shadow-xl backdrop-blur-md">
                        <Users className="w-4 h-4" />
                        تیم تخصصی ما
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        <span className="block mb-2">راهنمایان باشگاه کوهنوردی</span>
                        <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-200 bg-clip-text text-transparent">
                            همراهان امن شما تا قله
                        </span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed mb-16">
                        با مجرب‌ترین لیدرها و سرگروه‌های کوهنوردی آشنا شوید. تیمی متخصص که ایمنی و لذت صعود شما را با دانش و تجربه خود تضمین می‌کنند.
                    </p>

                    {/* OWNER FEATURE (TOP CENTER) */}
                    {owners.length > 0 && (
                        <div className="flex justify-center mb-20 relative">
                            {owners.map(guide => (
                                <Link href={`/guides/${guide.id}`} key={guide.id} className="group w-full max-w-md text-right relative z-10">
                                    <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-[2.5rem] hover:border-emerald-500 transition-all duration-300 hover:-translate-y-2 shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] flex flex-col relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>

                                        <div className="flex flex-col items-center text-center mb-6 relative z-10">
                                            <div className="relative mb-6">
                                                <div className="w-48 h-48 rounded-[2rem] overflow-hidden border-4 border-slate-950 shadow-2xl group-hover:border-emerald-500/50 transition-colors">
                                                    {guide.avatar_url ? (
                                                        <img src={guide.avatar_url} alt={guide.full_name} className="w-full h-full object-cover object-[50%_15%]" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                            <Users className="w-16 h-16 text-white/20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center border-[6px] border-slate-950 shadow-lg">
                                                    <Star className="w-7 h-7 text-slate-950 fill-slate-950" />
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black mb-4 group-hover:text-emerald-400 transition-colors">
                                                {guide.full_name || "مدرس ارشد"}
                                            </h3>
                                            <span className="px-5 py-2 bg-emerald-500/10 rounded-full text-sm font-bold text-emerald-400 border border-emerald-500/20 shadow-inner">
                                                مدرس ارشد / مالک باشگاه
                                            </span>
                                        </div>

                                        <div className=" flex flex-col items-center z-10 w-full">
                                            {guide.specialties && guide.specialties.length > 0 && (
                                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                                    {guide.specialties.slice(0, 3).map((spec: string, i: number) => (
                                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs font-bold">
                                                            <Award className="w-3 h-3 text-emerald-400" />
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-center text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors mt-auto pt-5 border-t border-white/10 z-10 w-full">
                                            مشاهده پروفایل و برنامه‌ها
                                            <ChevronRight className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    {admins.length === 0 && owners.length === 0 ? (
                        <div className="text-center py-20 text-white/50 bg-white/5 rounded-3xl border border-white/5">
                            هنوز راهنمایی ثبت نشده است.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {admins.map((guide) => (
                                <Link href={`/guides/${guide.id}`} key={guide.id} className="group">
                                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 h-full flex flex-col relative overflow-hidden">

                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[20px] -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

                                        {/* Avatar & Role Tag */}
                                        <div className="flex items-start justify-between mb-6 z-10">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors bg-slate-800">
                                                    {guide.avatar_url ? (
                                                        <img src={guide.avatar_url} alt={guide.full_name} className="w-full h-full object-cover object-[50%_15%]" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Users className="w-8 h-8 text-white/20" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-white/60 border border-white/5">
                                                سرگروه تخصصی
                                            </span>
                                        </div>

                                        {/* Name */}
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors z-10">
                                            {guide.full_name || "راهنمای ناشناس"}
                                        </h3>

                                        {/* Specialties */}
                                        <div className="flex-1 z-10">
                                            {guide.specialties && guide.specialties.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {guide.specialties.slice(0, 3).map((spec: string, i: number) => (
                                                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                                            <Award className="w-3 h-3" />
                                                            {spec}
                                                        </span>
                                                    ))}
                                                    {guide.specialties.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/5 text-white/40 text-xs font-bold">
                                                            +{guide.specialties.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-white/30 text-xs mb-6 italic">تخصص‌ها ثبت نشده است.</p>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center text-sm font-bold text-white/60 group-hover:text-emerald-400 transition-colors mt-auto pt-4 border-t border-white/5 z-10">
                                            مشاهده پروفایل و برنامه‌ها
                                            <ChevronRight className="w-4 h-4 mr-auto group-hover:-translate-x-1 transition-transform" />
                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- IMAGE GALLERY (SEPARATE SECTION) --- */}
                <div className="max-w-7xl mx-auto relative z-10 mt-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">
                            خاطرات صعودهای پیشین
                        </h2>
                        <p className="text-white/60">
                            لحظاتی به یاد ماندنی با تیم متخصص باشگاه کوهنوردی
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-01_20-24-07_dogygr.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-26-54_ug6nf0.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-26-58_ifpbyt.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-01-02_14-22-49_gyjyrn.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-26-09_uhzh3u.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058639/photo_2026-02-14_12-13-26_op8kym.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058638/photo_2026-02-14_12-13-34_zessog.jpg",
                            "https://res.cloudinary.com/dszhmx8ny/image/upload/v1771390677/photo_2026-02-18_08-27-05_t2jnix.jpg"
                        ].map((src, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] object-cover bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer shadow-xl">
                                <img src={src} alt="خاطرات صعود" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 backdrop-blur-md">
                                        <Star className="w-6 h-6 text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
