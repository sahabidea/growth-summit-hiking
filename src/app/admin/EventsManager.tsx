"use client";

import { useState, useEffect } from "react";
import { createEvent, fetchAllEvents, updateEvent } from "@/app/actions/admin-events";
import { Loader2, Plus, Users, Calendar, CloudSun, Edit, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

export function EventsManager() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState("پنج‌شنبه‌های صعود");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("درکه");
    const [capacity, setCapacity] = useState(5);
    const [desc, setDesc] = useState("برنامه کوهنوردی با تمرکز بر سکوت و ذهن‌آگاهی. ساعت ۸ صبح میدان.");
    const [weather, setWeather] = useState("صاف و آفتابی");
    const [imageUrl, setImageUrl] = useState("");

    async function loadEvents() {
        setIsLoadingEvents(true);
        const res = await fetchAllEvents();
        if (res.success) setEvents(res.data || []);
        setIsLoadingEvents(false);
    }

    // Initial load
    useEffect(() => {
        loadEvents();
    }, []);

    const WEATHER_OPTIONS = [
        "صاف و آفتابی ☀️",
        "نیمه ابری 🌤",
        "ابری ☁️",
        "بارانی 🌧",
        "برفی ❄️",
        "رعد و برق ⛈",
        "مه آلود 🌫",
        "باد شدید 💨"
    ];

    const resetForm = () => {
        setTitle("پنج‌شنبه‌های صعود");
        setDate("");
        setLocation("درکه");
        setCapacity(5);
        setDesc("برنامه کوهنوردی با تمرکز بر سکوت و ذهن‌آگاهی. ساعت ۸ صبح میدان.");
        setWeather("صاف و آفتابی");
        setImageUrl("");
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (event: any) => {
        setEditId(event.id);
        setTitle(event.title);
        // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
        const d = new Date(event.date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setDate(d.toISOString().slice(0, 16));

        setLocation(event.location);
        setCapacity(event.capacity);
        setDesc(event.description);
        setWeather(event.weather_note || "صاف و آفتابی");
        setImageUrl(event.image_url || "");
        setShowForm(true);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const payload = {
                title,
                date: new Date(date).toISOString(),
                location,
                capacity: Number(capacity),
                description: desc,
                weather_note: weather,
                image_url: imageUrl
            };

            let result;
            if (editId) {
                result = await updateEvent(editId, payload);
            } else {
                result = await createEvent(payload);
            }

            if (result.success) {
                resetForm();
                loadEvents();
            } else {
                alert("خطا: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("خطای ناشناخته رخ داد");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display flex items-center gap-3">
                    <Calendar className="text-emerald-400" />
                    مدیریت برنامه‌ها
                </h2>
                {!showForm && (
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        برنامه جدید
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 animate-in fade-in slide-in-from-top-4">
                    <div className="md:col-span-2 text-white/50 text-xs font-bold mb-2 flex items-center gap-2">
                        {editId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editId ? "ویرایش برنامه" : "اطلاعات برنامه جدید"}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-white/40 mr-2">عنوان</label>
                        <input
                            placeholder="عنوان برنامه"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 transition-colors outline-none"
                            value={title} onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-white/40 mr-2">تاریخ و ساعت</label>
                        <input
                            type="datetime-local"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 transition-colors outline-none"
                            value={date} onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-white/40 mr-2">مکان</label>
                        <input
                            placeholder="مکان"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 transition-colors outline-none"
                            value={location} onChange={e => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-white/40 mr-2">ظرفیت (نفر)</label>
                        <input
                            type="number"
                            placeholder="ظرفیت"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 transition-colors outline-none"
                            value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs text-white/40 mr-2">توضیحات تکمیلی</label>
                        <textarea
                            placeholder="توضیحات"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px] focus:border-emerald-500 transition-colors outline-none"
                            value={desc} onChange={e => setDesc(e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs text-white/40 mr-2 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            لینک تصویر (Cloudinary)
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                placeholder="https://res.cloudinary.com/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-3 focus:border-emerald-500 transition-colors outline-none dir-ltr text-left font-mono text-sm"
                                value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs text-white/40 mr-2">پیش‌بینی آب و هوا</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {WEATHER_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setWeather(opt)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${weather === opt
                                        ? "bg-emerald-500 text-slate-950 border-emerald-500"
                                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 rounded-xl hover:bg-white/5 text-white/60 font-bold transition-colors"
                        >
                            لغو
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-emerald-500 text-slate-950 rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center min-w-[120px]"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (editId ? "ویرایش برنامه" : "ثبت برنامه")}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex gap-4 items-center group hover:border-emerald-500/30 transition-all">
                        {event.image_url ? (
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-16 h-16 rounded-xl object-cover border border-white/10"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Calendar className="w-6 h-6 text-white/20" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg mb-1 truncate">{event.title}</h3>
                            <p className="text-white/40 text-sm flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString("fa-IR")}</span>
                                <span>📍 {event.location}</span>
                                <span>👥 {event.capacity} نفر</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                            <button
                                onClick={() => handleEdit(event)}
                                className="bg-white/5 p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                title="ویرایش"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${event.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'
                                }`}>
                                {event.status === 'scheduled' ? 'برنامه‌ریزی شده' : event.status}
                            </span>
                        </div>
                    </div>
                ))}
                {events.length === 0 && !isLoadingEvents && (
                    <div className="text-center py-10 text-white/30">هنوز برنامه‌ای تعریف نشده است.</div>
                )}
            </div>
        </div>
    );
}
