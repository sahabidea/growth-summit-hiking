"use client";

import { useEffect, useState } from "react";
import { fetchAllApplications, updateApplicationStatus, updateBulkApplicationStatus } from "@/app/actions/applications";
import {
    Users, CheckCircle2, XCircle, Clock,
    Search, Mountain,
    LayoutDashboard, Settings,
    Menu, X, Eye, Calendar, MessageCircle, CheckSquare, Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EventsManager } from "@/app/admin/EventsManager";
import { ChatManager } from "@/app/admin/ChatManager";
import { GrowthChart } from "@/app/admin/components/GrowthChart";
import { createClient } from "@/lib/supabase/client";

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

export default function AdminPanelView() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Default to 'apps' view to satisfy request to combine
    const [activeView, setActiveView] = useState("apps");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        const result = await fetchAllApplications();
        if (result.success) setApplications(result.data);
        setLoading(false);
    }

    // Realtime Subscription
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel('realtime-applications')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'applications' },
                () => {
                    // Reload data on any change
                    loadApplications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        const result = await updateApplicationStatus(id, status);
        if (result.success) {
            setApplications(applications.map(app =>
                app.id === id ? { ...app, status } : app
            ));
        }
    }

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "all" || app.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredApps.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredApps.map(app => app.id));
        }
    };

    const handleBulkUpdate = async (status: string) => {
        if (selectedIds.length === 0) return;
        setBulkActionLoading(true);
        await updateBulkApplicationStatus(selectedIds, status);
        // Optimistic update locally
        setApplications(prev => prev.map(app =>
            selectedIds.includes(app.id) ? { ...app, status } : app
        ));
        setSelectedIds([]);
        setBulkActionLoading(false);
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "pending").length,
        approved: applications.filter(a => a.status === "approved").length,
    };

    return (
        <section className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl" dir="rtl">

            {/* Admin Header / Tabs */}
            <div className="bg-slate-950/50 p-4 border-b border-white/5 flex flex-wrap gap-2">
                {[
                    { id: "apps", label: "درخواست‌ها", icon: Users },
                    { id: "events", label: "مدیریت برنامه‌ها", icon: Calendar },
                    { id: "chat", label: "گفتگو آنلاین", icon: MessageCircle },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeView === item.id
                                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="p-6">

                {/* --- 1. APPLICATIONS VIEW --- */}
                {activeView === "apps" && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
                            <div className="md:col-span-2">
                                <GrowthChart />
                            </div>
                            <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
                                <span className="text-white/40 text-xs font-bold block mb-2">کل درخواست‌ها</span>
                                <span className="text-4xl font-display text-emerald-400">{stats.total}</span>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
                                <span className="text-white/40 text-xs font-bold block mb-2">در انتظار</span>
                                <span className="text-4xl font-display text-amber-400">{stats.pending}</span>
                            </div>
                        </div>

                        {/* Filters and Bulk Actions */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">

                            {/* Bulk Actions (Visible only when items selected) */}
                            {selectedIds.length > 0 ? (
                                <div className="flex bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 items-center gap-3 w-full md:w-auto animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-black">
                                        {selectedIds.length} انتخاب شده
                                    </div>
                                    <div className="h-4 w-px bg-emerald-500/20" />
                                    <button
                                        onClick={() => handleBulkUpdate("approved")}
                                        disabled={bulkActionLoading}
                                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                                    >
                                        {bulkActionLoading ? "..." : "تایید گروهی"}
                                    </button>
                                    <div className="h-4 w-px bg-emerald-500/20" />
                                    <button
                                        onClick={() => handleBulkUpdate("rejected")}
                                        disabled={bulkActionLoading}
                                        className="text-xs font-bold text-rose-400 hover:text-rose-300 disabled:opacity-50"
                                    >
                                        {bulkActionLoading ? "..." : "رد گروهی"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 self-start">
                                    {["all", "pending", "approved", "rejected"].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                                activeTab === tab ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                                            )}
                                        >
                                            {tab === "all" ? "همه" : tab === "pending" ? "در انتظار" : tab === "approved" ? "تایید" : "رد"}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Search */}
                            <div className="relative group w-full md:w-64">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="جستجو..."
                                    className="w-full bg-slate-950 pr-10 pl-4 py-3 rounded-xl border border-white/5 focus:border-emerald-500 outline-none text-sm font-bold placeholder:text-white/10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List Header with Select All */}
                        <div className="flex items-center gap-4 px-4 pb-2 text-white/30 text-xs font-bold border-b border-white/5">
                            <button onClick={toggleSelectAll} className="hover:text-white flex items-center gap-2">
                                {selectedIds.length === filteredApps.length && filteredApps.length > 0 ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                                انتخاب همه
                            </button>
                            <span>نام کاربر</span>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-12 text-white/20 text-sm">در حال بارگذاری...</div>
                            ) : filteredApps.length > 0 ? (
                                filteredApps.map(app => (
                                    <div key={app.id} className={cn(
                                        "bg-slate-950/50 p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 transition-all group",
                                        selectedIds.includes(app.id) ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5 hover:border-white/10"
                                    )}>

                                        {/* Checkbox */}
                                        <button onClick={() => toggleSelect(app.id)} className="shrink-0 text-white/20 hover:text-white transition-colors">
                                            {selectedIds.includes(app.id) ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5" />}
                                        </button>

                                        <div className="bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-emerald-400 font-bold shrink-0">
                                            {app.name[0]}
                                        </div>
                                        <div className="flex-1 text-center md:text-right min-w-0">
                                            <p className="font-bold text-sm truncate">{app.name}</p>
                                            <p className="text-white/30 text-xs truncate">{app.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => handleStatusUpdate(app.id, "approved")} className={cn("p-2 rounded-lg transition-colors", app.status === 'approved' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 hover:bg-emerald-500/20 text-white/30')}>
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleStatusUpdate(app.id, "rejected")} className={cn("p-2 rounded-lg transition-colors", app.status === 'rejected' ? 'bg-rose-500 text-white' : 'bg-white/5 hover:bg-rose-500/20 text-white/30')}>
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)} className="p-2 bg-white/5 rounded-lg text-white/30 hover:bg-white/10 hover:text-white transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {selectedApp?.id === app.id && (
                                            <div className="w-full border-t border-white/5 pt-4 mt-2">
                                                <p className="text-white/50 text-sm">{app.goal}</p>
                                                <p className="text-emerald-400 text-xs font-bold mt-2">امتیاز هوش مصنوعی: {app.score}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-white/20 text-sm">موردی یافت نشد.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- 2. EVENTS VIEW --- */}
                {activeView === "events" && <EventsManager />}
                {/* --- 3. CHAT VIEW --- */}
                {activeView === "chat" && <ChatManager />}

            </div>
        </section>
    );
}
