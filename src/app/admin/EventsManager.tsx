"use client";

import { useState } from "react";
import { createEvent, fetchAllEvents } from "@/app/actions/admin-events";
import { Loader2, Plus, Users, Calendar, CloudSun } from "lucide-react";

export function EventsManager() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState("پنج‌شنبه‌های صعود");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("درکه");
    const [capacity, setCapacity] = useState(5);
    const [desc, setDesc] = useState("برنامه کوهنوردی با تمرکز بر سکوت و ذهن‌آگاهی. ساعت ۸ صبح میدان.");
    const [weather, setWeather] = useState("صاف و آفتابی");

    async function loadEvents() {
        setLoading(true);
        const res = await fetchAllEvents();
        if (res.success) setEvents(res.data || []);
        setLoading(false);
    }

    // Initial load
    useState(() => {
        loadEvents();
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await createEvent({
            title,
            date, // Should be ISO string
            location,
            capacity: Number(capacity),
            description: desc,
            weather_note: weather
        });
        setShowForm(false);
        loadEvents();
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display flex items-center gap-3">
                    <Calendar className="text-emerald-400" />
                    مدیریت برنامه‌ها
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    برنامه جدید
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 mb-8 grid gap-4 grid-cols-1 md:grid-cols-2">
                    <input
                        placeholder="عنوان برنامه"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                        value={title} onChange={e => setTitle(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                        value={date} onChange={e => setDate(e.target.value)}
                        required
                    />
                    <input
                        placeholder="مکان"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                        value={location} onChange={e => setLocation(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="ظرفیت"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                        value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                    />
                    <textarea
                        placeholder="توضیحات"
                        className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px]"
                        value={desc} onChange={e => setDesc(e.target.value)}
                    />
                    <input
                        placeholder="وضعیت هوا (یادداشت)"
                        className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                        value={weather} onChange={e => setWeather(e.target.value)}
                    />
                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl hover:bg-white/5">لغو</button>
                        <button type="submit" disabled={loading} className="px-8 py-2 bg-emerald-500 text-slate-950 rounded-xl font-bold">
                            {loading ? <Loader2 className="animate-spin" /> : "ایجاد برنامه"}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                        <div>
                            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                            <p className="text-white/40 text-sm flex items-center gap-3">
                                <span>🗓 {new Date(event.date).toLocaleDateString("fa-IR")}</span>
                                <span>📍 {event.location}</span>
                                <span>👥 {event.capacity} نفر</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${event.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'
                                }`}>
                                {event.status === 'scheduled' ? 'برنامه‌ریزی شده' : event.status}
                            </span>
                        </div>
                    </div>
                ))}
                {events.length === 0 && !loading && (
                    <div className="text-center py-10 text-white/30">هنوز برنامه‌ای تعریف نشده است.</div>
                )}
            </div>
        </div>
    );
}
