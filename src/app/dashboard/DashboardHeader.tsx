import Link from "next/link";
import { Mountain, Search, Crown } from "lucide-react";
import { UserDropdown } from "./UserDropdown";

interface DashboardHeaderProps {
    profile: {
        full_name: string;
        phone_number: string | null;
        subscription_status: string;
        role: string;
        avatar_url?: string | null;
    };
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

                {/* Right Side: Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-tr from-emerald-500 to-cyan-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <Mountain className="h-6 w-6 text-slate-950" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">کوهنوردان</span>
                            <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Community</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors relative group">
                            خانه
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
                        </Link>
                        <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">کلاس‌ها</Link>
                        <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">فروشگاه</Link>
                        <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">وبلاگ</Link>
                        <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">تماس</Link>
                        {/* Admin Link */}
                        {profile.role === 'admin' && (
                            <Link href="/admin" className="px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/10 transition-colors">
                                پنل مدیریت
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Center: Search Bar (Hidden on mobile) */}
                <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="جستجو..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-light"
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <span className="text-[10px] bg-white/10 px-1.5 rounded text-white/30 font-mono">/</span>
                    </div>
                </div>

                {/* Left Side: Actions & Profile */}
                <div className="flex items-center gap-4">
                    {/* Special Subscription Button */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl hover:border-amber-500/50 text-amber-400 transition-all group">
                        <Crown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold">اشتراک ویژه</span>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />

                    {/* Notification Icon (Placeholder) */}
                    <button className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors relative">
                        <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    </button>

                    {/* User Profile Dropdown */}
                    <UserDropdown user={profile} />
                </div>
            </div>
        </header>
    );
}
