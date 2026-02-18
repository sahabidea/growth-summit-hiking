"use client";

import { LogOut, User, LayoutDashboard, Trophy, Target, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signout } from "@/app/actions/auth-user";

interface UserDropdownProps {
    user: {
        full_name: string;
        phone_number: string | null;
        subscription_status: string;
    };
}

export function UserDropdown({ user }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Get initials or first letter
    const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group outline-none"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                    {initial}
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    {/* Header: Phone Number */}
                    <div className="bg-white/5 px-4 py-3 border-b border-white/5">
                        <div className="text-sm font-mono text-center text-white/80 tracking-wider">
                            {user.phone_number || "No Phone Number"}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors group">
                            <LayoutDashboard className="w-4 h-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-medium">داشبورد من</span>
                        </Link>

                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors group">
                            <User className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                            <span className="text-sm font-medium">پروفایل کاربری</span>
                        </Link>

                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-not-allowed opacity-50 group">
                            <Trophy className="w-4 h-4 text-white/40 group-hover:text-amber-400 transition-colors" />
                            <span className="text-sm font-medium">جدول امتیازات</span>
                        </div>

                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-not-allowed opacity-50 group mb-2">
                            <Target className="w-4 h-4 text-white/40 group-hover:text-rose-400 transition-colors" />
                            <span className="text-sm font-medium">چالش‌های هفتگی</span>
                        </div>

                        <div className="h-px bg-white/5 mx-2 my-1" />

                        <form action={signout}>
                            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400/80 hover:text-rose-400 transition-colors group">
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">خروج از حساب</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
