"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Heart, Compass, ArrowLeft, Star, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/Footer";
import CommunityGallery from "@/components/ui/CommunityGallery";
import FAQ from "@/components/ui/FAQ";
import { useEffect, useState } from "react";

const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-amber-200 rounded-full mix-blend-overlay"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [null, -120],
            opacity: [0, 0.6, 0],
            scale: [0, 1.2, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            boxShadow: "0 0 10px rgba(251, 191, 36, 0.5)"
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-amber-500/30" dir="rtl">
      {/* Cinematic Hero Background - Morning Energy */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop')`,
          }}
        />
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/10 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-transparent to-purple-900/20 mix-blend-overlay" />

        <FloatingParticles />
      </div>

      <main className="relative z-10">
        {/* Full Height Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 px-6 pb-12">
          <div className="max-w-7xl mx-auto w-full text-center md:text-right">
            <div className="max-w-4xl">
              <div
                className="inline-flex items-center gap-3 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-300 px-5 py-2 rounded-full text-sm font-black mb-8 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:bg-amber-500/20 transition-colors cursor-default"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="tracking-wide">اولین صعود: همین پنجشنبه</span>
              </div>

              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-display mb-10 leading-[1.1] text-white drop-shadow-2xl"
              >
                فتح قله‌های <br />
                <span className="bg-gradient-to-l from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent pb-2 inline-block">
                  انرژی و امید.
                </span>
              </h1>

              <p
                className="text-lg md:text-3xl text-white/90 max-w-2xl mb-12 font-medium leading-relaxed drop-shadow-lg"
              >
                طلوعی دوباره برای ذهن و بدن. فضایی پر از نور و هوای تازه،
                جایی که خستگی‌ها جا می‌مانند و قدرت‌ها بازیابی می‌شوند.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-5 md:gap-8 justify-center md:justify-start"
              >
                <Link href="/apply" className="relative group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 md:px-14 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-xl hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 overflow-hidden">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    همین حالا عضو شوید <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                  </span>
                </Link>
                <Link href="/hikes" className="bg-white/5 backdrop-blur-md text-white px-10 md:px-14 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-xl border border-white/10 hover:bg-white/15 hover:border-amber-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                  برنامه‌های صعود <Compass className="h-6 w-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section id="guides" className="py-32 relative px-6">
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 z-0" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-7xl font-display mb-6 text-white drop-shadow-xl">بانیان صعود</h2>
              <p className="text-amber-100/60 text-lg md:text-2xl max-w-2xl mx-auto font-light">
                تیم فنی و متخصصین کوهستان که در هر قدم کنار شما هستند.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -15 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl hover:border-amber-500/30 transition-all duration-500">
                <div className="h-[28rem] relative overflow-hidden">
                  <Image src="https://res.cloudinary.com/dszhmx8ny/image/upload/v1771224157/photo_2026-02-14_14-19-59_llyvov.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="حسین حکمیان" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 right-0 p-8 w-full">
                    <h3 className="text-3xl font-display text-amber-400 mb-1 drop-shadow-md">حسین حکمیان</h3>
                    <span className="text-white/60 text-sm font-bold uppercase tracking-wider">استراتژیست صعود</span>
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <p className="text-white/70 font-medium leading-relaxed text-lg">
                    خالق چشم‌اندازهای بزرگ. حسین کوهنوردی را از ورزش به مکتب رشد تبدیل کرده است. هر گام با او، پله‌ای برای ارتقای شخصی است.
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -15 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl hover:border-amber-500/30 transition-all duration-500">
                <div className="h-[28rem] relative overflow-hidden">
                  <Image src="https://res.cloudinary.com/dszhmx8ny/image/upload/v1771058638/photo_2026-02-14_12-13-34_zessog.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="امین طبسی" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 right-0 p-8 w-full">
                    <h3 className="text-3xl font-display text-amber-400 mb-1 drop-shadow-md">امین طبسی</h3>
                    <span className="text-white/60 text-sm font-bold uppercase tracking-wider">فرمانده میدان</span>
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <p className="text-white/70 font-medium leading-relaxed text-lg">
                    امین زبان کوهستان را می‌داند. با دو دهه تجربه، او نماد اطمینان است. حضور او یعنی امنیت مطلق و شنیدن داستان‌هایی از قلب کوه.
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -15 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl hover:border-amber-500/30 transition-all duration-500">
                <div className="h-[28rem] relative overflow-hidden">
                  <Image src="https://res.cloudinary.com/dszhmx8ny/image/upload/v1771911000/photo_2026-02-24_08-39-33_oaiffm.jpg" fill className="object-cover object-[50%_60%] transition-transform duration-700 group-hover:scale-110" alt="مهدی صفرائی و محمدرضا بنادکوکی" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 right-0 p-8 w-full">
                    <h3 className="text-3xl font-display text-amber-400 mb-1 drop-shadow-md leading-tight">مهدی صفرائی <br /><span className="text-2xl text-amber-200">و محمدرضا بنادکوکی</span></h3>
                    <span className="text-white/60 text-sm font-bold uppercase tracking-wider">راهنمایان ارشد</span>
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <p className="text-white/70 font-medium leading-relaxed text-lg">
                    کوچ، کارآفرین و طبیعت‌گرد. تلفیقی از دانش توسعه فردی، تجربه کارآفرینی و عشق به طبیعت که در مسیر صعود و تکامل، همراه شما هستند.
                  </p>
                </div>
              </motion.div>
            </div>

            <CommunityGallery />
          </div>
        </section>

        {/* Feature/Value Section */}
        <section id="values" className="py-32 md:py-48 px-6 bg-transparent relative overflow-hidden">
          {/* Subtle Warm Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-amber-900/10 to-slate-950/20 z-0 pointer-events-none" />


          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-24 md:mb-32">
              <h2 className="text-4xl md:text-7xl font-display mb-8 tracking-tighter text-white drop-shadow-lg">چرا اوجِ رشد؟</h2>
              <div className="h-2 w-48 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-8 shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
              <p className="text-white/70 text-lg md:text-3xl max-w-3xl font-medium leading-relaxed font-display">
                پیوندی میان استراتژی و طبیعت.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-amber-400" />,
                  title: "فضای امن و حرفه‌ای",
                  desc: "بدون حاشیه، بدون سیاست. فقط تمرکز بر صعود و شبکه‌سازی در بالاترین سطح."
                },
                {
                  icon: <Zap className="h-10 w-10 md:h-12 md:w-12 text-amber-400" />,
                  title: "انرژی خالص",
                  desc: "از شهر و هیاهو جدا شوید تا با باتری‌های شارژ شده به کسب‌وکار خود بازگردید."
                },
                {
                  icon: <Heart className="h-10 w-10 md:h-12 md:w-12 text-amber-400" />,
                  title: "ارتباطات ارزشمند",
                  desc: "در مسیری دشوار اما لذت‌بخش، با افرادی هم‌قدم شوید که مثل شما فکر می‌کنند."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-slate-900/40 backdrop-blur-md p-10 md:p-14 rounded-[2.5rem] border border-white/5 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                  <div className="bg-white/5 w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-amber-500/10 transition-all duration-500 shadow-xl border border-white/5 group-hover:border-amber-500/20">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl md:text-4xl font-display mb-6 md:mb-8 text-white leading-tight">{item.title}</h3>
                  <p className="text-white/70 leading-loose font-medium text-lg md:text-xl group-hover:text-white/90 transition-colors">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
