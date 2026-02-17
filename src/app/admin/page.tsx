"use client";

import { useEffect, useState } from "react";
import { fetchAllApplications, updateApplicationStatus } from "@/app/actions/applications";
import { adminLogout } from "@/app/actions/auth";
import {
    Users, CheckCircle2, XCircle, Clock,
    Search, ChevronRight, Mountain,
    LayoutDashboard, Map, Settings, LogOut,
    Menu, X, Eye, Calendar, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EventsManager } from "./EventsManager";
import { ChatManager } from "./ChatManager";

interface Application {
    id: string;
    name: string;
    email: string;
    goal: string;
    score: number;
    approved: boolean;
    status: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState("dash");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadApplications();
    }, []);

    async function loadApplications() {
        setLoading(true);
        const result = await fetchAllApplications();
        if (result.success) setApplications(result.data);
        setLoading(false);
    }

    async function handleStatusUpdate(id: string, status: string) {
        const result = await updateApplicationStatus(id, status);
        if (result.success) {
            setApplications(applications.map(app =>
                app.id === id ? { ...app, status } : app
            ));
        }
    }

    async function handleLogout() {
        await adminLogout();
        router.push("/admin/login");
    }

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "all" || app.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        approved: applications.filter(a => a.status === "approved").length,
    };

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 mb-12">
                <div className="bg-emerald-500 p-1.5 rounded-lg">
                    <Mountain className="h-6 w-6 text-slate-950" />
                </div>
                <span className="font-display text-2xl">پنل ادمین</span>
            </div>

            <nav className="space-y-4 flex-1">
                {[
                    { id: "dash", label: "داشبورد", icon: LayoutDashboard },
                    { id: "apps", label: "درخواست‌ها", icon: Users },
                    { id: "events", label: "برنامه‌ها", icon: Calendar },
                    { id: "chat", label: "گفتگو آنلاین", icon: MessageCircle },
                    { id: "settings", label: "تنظیمات", icon: Settings },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveView(item.id); setSidebarOpen(false); }}
                        className={cn(
                            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold",
                            activeView === item.id
                                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 text-rose-500 font-bold hover:bg-rose-500/5 rounded-2xl transition-all mt-auto"
            >
                <LogOut className="h-5 w-5" />
                خروج
            </button>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex" dir="rtl">
            {/* Desktop Sidebar */}
            <aside className="w-72 border-l border-white/5 bg-slate-900/50 backdrop-blur-xl hidden lg:flex flex-col p-8 fixed h-full z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-72 h-full bg-slate-900 z-40 p-8 flex flex-col border-r border-white/5 shadow-2xl lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:mr-72 p-6 md:p-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display mb-2">سلام، خوش آمدید</h1>
                        <p className="text-white/40 font-bold text-sm">بررسی آخرین درخواست‌های کوهنوردی</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 md:px-6 py-3 flex items-center gap-3 md:gap-4 hidden sm:flex">
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase text-white/30">وضعیت سرور</p>
                                <p className="text-emerald-400 font-black text-xs">عملیاتی</p>
                            </div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden bg-white/5 p-3 rounded-2xl text-white"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </header>


                {/* Stats Grid - Show only on Dashboard */}
                {activeView === "dash" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-12">
                        {[
                            { label: "کل درخواست‌ها", value: stats.total, icon: Users, color: "text-emerald-400" },
                            { label: "در انتظار بررسی", value: stats.pending, icon: Clock, color: "text-amber-400" },
                            { label: "تایید شده", value: stats.approved, icon: CheckCircle2, color: "text-cyan-400" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform" />
                                <div className={cn("p-3 md:p-4 rounded-2xl bg-white/5 w-fit mb-4 md:mb-6", stat.color)}>
                                    <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <p className="text-white/40 font-bold mb-1 text-sm">{stat.label}</p>
                                <p className="text-3xl md:text-4xl font-display">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Events View */}
                {activeView === "events" && <EventsManager />}
                {/* Chat View */}
                {activeView === "chat" && <ChatManager />}

                {/* Applications List - Show on Dash or Apps view */}
                {(activeView === "dash" || activeView === "apps") && (
                    <div className="bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-12">
                            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5 overflow-x-auto w-full md:w-auto">
                                {["all", "pending", "approved", "rejected"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "px-4 md:px-6 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap",
                                            activeTab === tab ? "bg-white text-slate-950" : "text-white/30 hover:text-white"
                                        )}
                                    >
                                        {tab === "all" ? "همه" : tab === "pending" ? "در انتظار" : tab === "approved" ? "تایید شده" : "رد شده"}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="جستجوی نام یا ایمیل..."
                                    className="w-full bg-slate-950 pr-14 pl-6 py-4 rounded-2xl border border-white/5 focus:border-emerald-500 outline-none font-bold placeholder:text-white/10 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus // Keep focus if searching
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <Mountain className="h-16 w-16 animate-bounce mb-4" />
                                    <p className="font-bold">در حال بارگذاری اطلاعات...</p>
                                </div>
                            ) : filteredApps.length > 0 ? (
                                filteredApps.map((app) => (
                                    <motion.div
                                        layout
                                        key={app.id}
                                        className="bg-slate-950/50 border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 hover:border-emerald-500/30 transition-all group"
                                    >
                                        <div className="bg-emerald-500/10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-400 font-display text-xl md:text-2xl border border-emerald-500/20 shrink-0">
                                            {app.name[0]}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg md:text-xl font-display mb-1 truncate">{app.name}</h4>
                                            <p className="text-white/30 font-bold text-xs md:text-sm truncate">{app.email}</p>
                                        </div>

                                        <div className="bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hidden lg:block">
                                            <p className="text-[10px] font-black text-white/20 mb-1">امتیاز AI</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-20">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(app.score, 100)}%` }} />
                                                </div>
                                                <span className="font-display text-emerald-400 text-sm">{app.score}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 md:gap-4">
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, "approved")}
                                                className={cn(
                                                    "p-3 md:p-4 rounded-xl md:rounded-2xl transition-all",
                                                    app.status === "approved" ? "bg-emerald-500 text-slate-950" : "bg-white/5 text-white/40 hover:bg-emerald-500/10 hover:text-emerald-500"
                                                )}
                                            >
                                                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, "rejected")}
                                                className={cn(
                                                    "p-3 md:p-4 rounded-xl md:rounded-2xl transition-all",
                                                    app.status === "rejected" ? "bg-rose-500 text-white" : "bg-white/5 text-white/40 hover:bg-rose-500/10 hover:text-rose-500"
                                                )}
                                            >
                                                <XCircle className="h-5 w-5 md:h-6 md:w-6" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
                                                className="p-3 md:p-4 bg-white/5 text-white/20 rounded-xl md:rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                <Eye className="h-5 w-5 md:h-6 md:w-6" />
                                            </button>
                                        </div>

                                        {/* Expanded Goal View */}
                                        {selectedApp?.id === app.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                className="w-full bg-white/5 rounded-2xl p-6 border border-white/5 mt-2"
                                            >
                                                <p className="text-[10px] font-black text-white/30 mb-2">چشم‌انداز رشد</p>
                                                <p className="text-white/70 font-bold leading-relaxed">{app.goal}</p>
                                                <p className="text-[10px] font-black text-white/20 mt-4">
                                                    {new Date(app.created_at).toLocaleDateString("fa-IR")}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-white/20 font-bold italic">
                                    هیچ درخواستی یافت نشد.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
