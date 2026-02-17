import { Mountain, Instagram, Send, Twitter, Smartphone, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Custom WhatsApp Icon since Lucide might not have it or it's named differently
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="relative bg-[#020617] text-white pt-24 pb-12 overflow-hidden border-t border-white/5" dir="rtl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-[#020617] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 text-right">

                    {/* Column 1: Brand & Mission */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                                <Mountain className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-display text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">اوجِ رشد</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-8 font-medium max-w-xs">
                            جایی که کوهنوردی با رشد شخصی پیوند می‌خورد. ما قله‌ها را فتح نمی‌کنیم، ما خودمان را در مسیر قله پیدا می‌کنیم.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Instagram, href: "#", label: "اینستاگرام" },
                                { icon: Twitter, href: "#", label: "توییتر" },
                                { icon: Send, href: "#", label: "تلگرام" }, // Send icon represents Telegram
                                { icon: WhatsAppIcon, href: "https://wa.me/989222453571", label: "واتس‌اپ" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-300 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-display text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> دسترسی سریع
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-400">
                            <li><Link href="/hikes" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">برنامه‌های صعود</Link></li>
                            <li><Link href="/apply" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">عضویت در باشگاه</Link></li>
                            <li><Link href="/about" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">درباره ما</Link></li>
                            <li><Link href="/blog" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">مجله کوهستان</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Support */}
                    <div>
                        <h4 className="font-display text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> پشتیبانی
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-400">
                            <li><Link href="/faq" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">سوالات متداول</Link></li>
                            <li><Link href="/terms" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">قوانین و مقررات</Link></li>
                            <li><Link href="/privacy" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">حریم خصوصی</Link></li>
                            <li><Link href="/contact" className="hover:text-amber-400 hover:translate-x-1 transition-all inline-block">تماس با ما</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h4 className="font-display text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> تماس مستقیم
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="tel:09222453571" className="bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 p-4 rounded-2xl flex items-center gap-4 group transition-all">
                                    <div className="bg-slate-950 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                        <Phone className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-500 font-bold mb-1">شماره تماس</span>
                                        <span className="text-lg font-black text-white group-hover:text-amber-400 transition-colors" dir="ltr">0922 245 3571</span>
                                    </div>
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400 text-sm font-medium leading-relaxed">
                                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                                ایران، تهران، کوهستان‌های شمالی، پایگاه رشد
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
                    <p className="text-slate-500 text-xs font-bold">
                        © ۱۴۰۴ تمامی حقوق برای باشگاه <span className="text-white">اوجِ رشد</span> محفوظ است.
                    </p>
                    <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-slate-600 font-black">
                        <span>Design by Hoshak</span>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>Powered by Nature</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
