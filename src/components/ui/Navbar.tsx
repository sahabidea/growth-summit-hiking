"use client";

import { Mountain, Menu, X, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
    { href: "/#values", label: "ارزش‌ها" },
    { href: "/#guides", label: "راهنمایان" },
    { href: "/hikes", label: "برنامه‌ها" },
    { href: "/blog", label: "وبلاگ" },
];

interface NavbarProps {
    user?: User | null;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(initialUser || null);

    useEffect(() => {
        const supabase = createClient();

        // Sync with initial user if it changes (e.g. server re-render)
        setUser(initialUser || null);

        // Listen for auth changes on client
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [initialUser]);

    // Hide Navbar on Dashboard
    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return (
        <>
            <nav className="fixed w-full z-50 px-4 md:px-6 py-4 md:py-6">
                <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 rounded-[2rem] px-6 py-3 flex justify-between items-center border border-white/10 shadow-2xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3">
                        <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg">
                            <Mountain className="h-5 w-5 text-slate-950" />
                        </div>
                        <span className="font-display text-2xl md:text-3xl text-white">اوجِ رشد</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-white/70">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <Link
                                href="/dashboard"
                                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all font-black flex items-center gap-2"
                            >
                                <UserIcon className="w-4 h-4" />
                                پنل کاربری
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-white/80 hover:text-white px-4 py-2.5 rounded-xl transition-colors font-bold"
                                >
                                    ورود
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-white text-slate-950 px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-xl active:scale-95 font-black"
                                >
                                    ثبت‌نام
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden bg-white/10 p-2.5 rounded-xl text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-72 h-full bg-slate-900 z-50 p-8 flex flex-col border-r border-white/5 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-12">
                                <div className="bg-emerald-500 p-1.5 rounded-lg">
                                    <Mountain className="h-5 w-5 text-slate-950" />
                                </div>
                                <span className="font-display text-2xl text-white">اوجِ رشد</span>
                            </div>

                            <div className="flex flex-col gap-4 flex-1">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-white/60 hover:text-white font-bold text-lg py-3 px-4 rounded-xl hover:bg-white/5 transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-center text-lg flex items-center justify-center gap-2"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    پنل کاربری
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="bg-white/10 text-white py-4 rounded-2xl font-bold text-center text-lg hover:bg-white/20 transition-all"
                                    >
                                        ورود
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-center text-lg hover:scale-105 transition-transform"
                                    >
                                        ثبت‌نام
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
