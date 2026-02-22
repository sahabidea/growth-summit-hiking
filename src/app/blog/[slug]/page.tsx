import { getBlogPost, blogPosts } from "@/lib/data/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, User, BookOpen, Mountain } from "lucide-react";

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) {
        return {
            title: 'مقاله یافت نشد',
        }
    }
    return {
        title: `${post.title} | وبلاگ اوج رشد`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-right pb-32 pt-28 px-4 selection:bg-amber-500/30 text-white relative overflow-hidden" dir="rtl">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

            <article className="max-w-4xl mx-auto relative z-10 w-full">
                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-3 text-sm font-black text-white/50 hover:text-white transition-colors mb-12 group bg-slate-900 border border-white/5 px-6 py-3 rounded-full hover:border-amber-500/30 w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    بازگشت به همه مقالات
                </Link>

                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black mb-6">
                        {post.category}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.3] text-white">
                        {post.title}
                    </h1>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-bold text-white/60 mb-10 py-6 border-y border-white/10 break-words">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-emerald-400" />
                            {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-amber-400" />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-cyan-400" />
                            {post.readTime}
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-2xl border border-white/10">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    </div>
                </header>

                {/* Article Content */}
                <div className="prose prose-invert prose-lg md:prose-xl prose-p:leading-loose prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-headings:font-bold prose-headings:text-white prose-strong:text-amber-200 prose-li:text-white/80 max-w-none text-white/80">
                    <div className="whitespace-pre-line">
                        {post.content.split('\n').map((line, index) => {
                            if (line.startsWith('## ')) {
                                return <h2 key={index} className="text-3xl mt-12 mb-6 text-white border-b border-white/10 pb-4">{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                                return <h3 key={index} className="text-2xl mt-8 mb-4 text-emerald-400">{line.replace('### ', '')}</h3>;
                            }
                            if (line.trim().startsWith('* ') || line.trim().match(/^\d+\./)) {
                                return <li key={index} className="mb-2 list-inside list-disc opacity-90">{line}</li>;
                            }
                            if (line.trim() === '') return <br key={index} />;

                            return <p key={index} className="mb-6 opacity-90 leading-[2] text-justify">{line}</p>;
                        })}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-20 pt-10 border-t border-white/10 text-center">
                    <p className="text-2xl font-bold mb-6 text-white">آماده تجربه مسیرهای جدید هستید؟</p>
                    <Link
                        href="/hikes"
                        className="inline-flex items-center gap-3 bg-emerald-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl hover:shadow-2xl shadow-emerald-500/20 active:scale-95"
                    >
                        مشاهده برنامه‌های صعود <Mountain className="w-6 h-6" />
                    </Link>
                </div>
            </article>
        </div>
    );
}
