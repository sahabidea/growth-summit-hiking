"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Heart, Compass, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/30 text-white overflow-x-hidden" dir="rtl">
      {/* Cinematic Hero Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-110"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_hero_background_dark_1771057683768_uzbox7.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/30 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 opacity-40" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Full Height Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 px-6 pb-12">
          <div className="max-w-7xl mx-auto w-full text-center md:text-right">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black mb-8 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                اولین صعود: همین پنجشنبه
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl lg:text-9xl font-display mb-8 leading-[1.2] text-white drop-shadow-2xl"
              >
                صعود به قله‌های <br />
                <span className="bg-gradient-to-l from-emerald-400 to-cyan-300 bg-clip-text text-transparent">آرامش و رشد.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-2xl text-white/70 max-w-2xl mb-12 font-medium leading-relaxed"
              >
                یک تجربه کوهنوردی اختصاصی برای بازیابی انرژی و ذهن‌آگاهی.
                سکوت کوهستان، جایگزین هیاهوی سیاست.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center md:justify-start"
              >
                <Link href="/apply" className="bg-white text-slate-950 px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3 group active:scale-95">
                  عضویت لیست انتظار <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:-translate-x-1" />
                </Link>
                <Link href="/hikes" className="bg-white/5 backdrop-blur-md text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95">
                  مشاهده برنامه‌ها <Compass className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section id="guides" className="py-32 bg-slate-900/50 relative px-6">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display mb-6">بانیان صعود</h2>
              <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto">تیم فنی و متخصصین کوهستان که در هر قدم کنار شما هستند.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -10 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl">
                <div className="h-96 relative overflow-hidden">
                  <img src="https://res.cloudinary.com/dszhmx8ny/image/upload/v1771224157/photo_2026-02-14_14-19-59_llyvov.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="حسین حکمیان" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-display mb-2 text-emerald-400">حسین حکمیان</h3>
                  <p className="text-white/50 font-medium leading-relaxed">
                    خالق چشم‌اندازهای بزرگ و معمار ارشد صعود. حسین با نگاهی استراتژیک، کوهنوردی را از یک ورزش به یک مکتب رشد تبدیل کرده است تا هر گام، پله‌ای برای ارتقای شخصی باشد.
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -10 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl">
                <div className="h-96 relative overflow-hidden">
                  <img src="https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058638/photo_2026-02-14_12-13-34_zessog.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="امین طبسی" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-display mb-2 text-emerald-400">امین طبسی</h3>
                  <p className="text-white/50 font-medium leading-relaxed">
                    مردی که زبان کوهستان را می‌داند. با دو دهه تجربه در مسیرهای ایران، امین نماد اطمینان و امنیت است. حضور او یعنی یادگیری تکنیک‌های ناب و شنیدن داستان‌هایی که فقط کوه‌ها شنیده‌اند.
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -10 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl relative flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-10 w-10 text-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-display mb-4">جامعه‌ای از جنس رشد</h3>
                <p className="text-white/40 leading-relaxed">
                  اینجا فقط کوه نمی‌رویم؛ اینجا ذهنیت‌های برنده را در کنار هم صیقل می‌دهیم.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature/Value Section */}
        <section id="values" className="py-32 md:py-48 bg-slate-950 relative overflow-hidden px-6">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
              style={{
                backgroundImage: `url('https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058072/mountain_mist_minimal_1771057010986_gsyr9u.jpg')`,
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-24 md:mb-32">
              <h2 className="text-4xl md:text-7xl font-display mb-8 tracking-tighter">چرا اوجِ رشد؟</h2>
              <div className="h-2 w-48 bg-emerald-500 rounded-full mb-8 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
              <p className="text-white/60 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed font-display">طبیعت و تفکر استراتژیک، پیوندی ناگسستنی.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-emerald-400" />,
                  title: "بدون سیاست، بدون هیاهو",
                  desc: "در محیطی آرام و به دور از بحث‌های تفرقه‌انگیز، تمام تمرکز خود را روی صعود و یادگیری قرار دهید."
                },
                {
                  icon: <Zap className="h-8 w-8 md:h-10 md:w-10 text-emerald-400" />,
                  title: "شبکه‌سازی استراتژیک",
                  desc: "در هر قدم با افرادی آشنا شوید که دغدغه‌های مشترک برای رشد شخصی و حرفه‌ای دارند."
                },
                {
                  icon: <Heart className="h-8 w-8 md:h-10 md:w-10 text-emerald-400" />,
                  title: "بازیابی انرژی ذهنی",
                  desc: "کوه صرفاً یک ورزش نیست؛ یک مدیتیشن عمیق برای بازگشت به محیط کار با قدرت مضاعف است."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 group"
                >
                  <div className="bg-white/5 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500 shadow-xl">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display mb-4 md:mb-6 text-white leading-tight">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed font-bold text-base md:text-lg group-hover:text-white/60 transition-colors">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
