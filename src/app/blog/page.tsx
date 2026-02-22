import { blogPosts } from "@/lib/data/blog";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, CalendarDays, BookOpen } from "lucide-react";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export const metadata = {
    title: "وبلاگ | باشگاه اوج رشد",
    description: "مقالات تخصصی و آموزشی در زمینه کوهنوردی، رشد شخصی و تجهیزات سفر.",
};

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-12 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            <FloatingParticles count={20} color="bg-amber-400" />

            {/* Header placeholder (Navbar is in layout) */}
            <div className="pt-32 px-6 relative z-10 w-full max-w-7xl mx-auto">
                <header className="text-center mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black mb-6">
                        <BookOpen className="w-4 h-4" /> مقالات و آموزش
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display text-white mb-6">
                        دانش‌نامه صعود
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
                        جدیدترین مقالات تخصصی، داستان‌های الهام‌بخش سفرهای کوهستان و راهنمای جامع تجهیزات برای همراهان باشگاه اوج رشد.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {blogPosts.map((post, index) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.slug}
                            className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden group hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 flex flex-col h-full shadow-2xl"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index < 3}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-xs font-bold border border-white/10 group-hover:border-amber-500/50 group-hover:text-amber-400 transition-colors">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                    {post.excerpt}
                                </p>

                                {/* Meta Info */}
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 text-xs font-bold text-white/40">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4 text-emerald-500/70" /> {post.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60">
                                            نویسنده: <span className="text-amber-400 font-bold">{post.author}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-amber-950 transition-colors">
                                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
