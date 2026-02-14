"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mountain, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-right">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Mountain className="h-6 w-6 text-forest-800 dark:text-forest-50" />
              <span className="font-bold text-xl tracking-tighter text-foreground">
                اوجِ رشد
              </span>
            </div>
            <div className="hidden md:flex space-x-8 space-x-reverse">
              <Link href="#values" className="text-sm font-medium hover:text-forest-800 transition-colors">
                ارزش‌ها
              </Link>
              <Link href="/hikes" className="text-sm font-medium hover:text-forest-800 transition-colors">
                برنامه‌ها
              </Link>
              <Link href="#membership" className="text-sm font-medium hover:text-forest-800 transition-colors">
                عضویت
              </Link>
            </div>
            <Link href="/apply" className="bg-forest-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-forest-900 transition-colors">
              ثبت درخواست
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-forest-50 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-forest-800/10">
              اولین برنامه: همین پنج‌شنبه صبح
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              صعود به قله‌های <br />
              <span className="text-forest-800">آرامش و رشد.</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              یک تجربه کوهنوردی متفاوت برای بازیابی انرژی و ذهن‌آگاهی.
              در کنار هم‌مسیرانی که به دنبال ارتقای شخصی و حرفه‌ای هستند، قدم بردارید.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/apply" className="bg-forest-800 text-white px-8 py-3 rounded-full font-medium hover:bg-forest-900 transition-all flex items-center gap-2">
                عضویت در لیست انتظار <ArrowRight className="h-4 w-4 rotate-180" />
              </Link>
              <button className="bg-white border border-input text-foreground px-8 py-3 rounded-full font-medium hover:bg-forest-50 transition-all">
                بیشتر بدانید
              </button>
            </div>
          </motion.div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-forest-50/50 rounded-full blur-3xl -z-10 opacity-60" />
      </section>

      {/* Value Proposition */}
      <section id="values" className="py-20 bg-forest-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">چرا اوجِ رشد؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما فضایی می‌سازیم که در آن طبیعت و تفکر استراتژیک به هم گره می‌خورند.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-forest-800" />}
              title="هم‌افزایی و انرژی مثبت"
              description="حضور در جمعی از افراد پرانرژی و هدفمند که به جای حاشیه، روی چشم‌اندازهای بزرگ تمرکز دارند."
            />
            <FeatureCard
              icon={<Mountain className="h-8 w-8 text-forest-800" />}
              title="مسیرهای هوشمند"
              description="ایجنت 'راهنما' (Pathfinder) مسیرها را بر اساس آب‌وهوا، تعداد گروه و ظرفیت گفتگو انتخاب می‌کند."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-forest-800" />}
              title="رشد و آگاهی"
              description="هر صعود فرصتی است برای گفتگوهای عمیق، یادگیری از یکدیگر و رسیدن به شفافیت ذهنی."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Mountain className="h-5 w-5 text-forest-800" />
            <span className="font-bold text-lg">اوجِ رشد</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 جامعه کوهنوردی اوج رشد. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background p-8 rounded-2xl border border-border hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="mb-4 bg-forest-50 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
