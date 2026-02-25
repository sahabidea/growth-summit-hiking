"use client";

import { useState, useEffect } from "react";
import { createEvent, fetchAllEvents, updateEvent, completeEventWithGPX } from "@/app/actions/admin-events";
import { setEventTerms, getEventTerms } from "@/app/actions/event-terms";
import { Loader2, Plus, Users, Calendar, CloudSun, Edit, Link as LinkIcon, Image as ImageIcon, CheckCircle, Upload, MapPin, Map, Shield, FileText, Heart } from "lucide-react";
import MapPicker from "@/components/MapPicker";
import { createClient } from "@/lib/supabase/client";

export default function EventsManager({ userRole = 'member', userId = '' }: { userRole?: string, userId?: string }) {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Complete Event State
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedEventToComplete, setSelectedEventToComplete] = useState<any>(null);
    const [isSubmittingGPX, setIsSubmittingGPX] = useState(false);

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState("پنج‌شنبه‌های صعود");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("درکه");
    const [capacity, setCapacity] = useState(5);
    const [desc, setDesc] = useState("برنامه کوهنوردی با تمرکز بر سکوت و ذهن‌آگاهی. ساعت ۸ صبح میدان.");
    const [weather, setWeather] = useState("صاف و آفتابی");
    const [imageUrl, setImageUrl] = useState("");
    const [equipmentList, setEquipmentList] = useState("");
    const [specialNotes, setSpecialNotes] = useState("");
    const [mapLink, setMapLink] = useState("");

    // Event Terms State
    const [termsValues, setTermsValues] = useState("");
    const [termsConditions, setTermsConditions] = useState("");
    const [termsFitness, setTermsFitness] = useState("beginner");

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
        setEquipmentList("");
        setSpecialNotes("");
        setMapLink("");
        setTermsValues("");
        setTermsConditions("");
        setTermsFitness("beginner");
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
        setEquipmentList(event.equipment_list || "");
        setSpecialNotes(event.special_notes || "");
        setMapLink(event.map_link || "");
        // Load event terms
        getEventTerms(event.id).then(res => {
            if (res.success && res.data) {
                setTermsValues(res.data.values_text || "");
                setTermsConditions(res.data.conditions_text || "");
                setTermsFitness(res.data.fitness_level || "beginner");
            }
        });
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
                image_url: imageUrl,
                equipment_list: equipmentList,
                special_notes: specialNotes,
                map_link: mapLink
            };

            let result;
            if (editId) {
                result = await updateEvent(editId, payload);
            } else {
                result = await createEvent(payload);
            }

            if (result.success) {
                // Save event terms if any
                const eventId = editId || (result as any).data?.id;
                if (eventId && (termsValues || termsConditions)) {
                    await setEventTerms(eventId, {
                        values_text: termsValues || undefined,
                        conditions_text: termsConditions || undefined,
                        fitness_level: termsFitness || undefined,
                    });
                }
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

    async function handleCompleteEvent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedEventToComplete) return;
        try {
            setIsSubmittingGPX(true);
            const formData = new FormData(e.currentTarget);
            const res = await completeEventWithGPX(selectedEventToComplete.id, formData);
            if (res.success) {
                setShowCompleteModal(false);
                setSelectedEventToComplete(null);
                loadEvents();
            } else {
                alert("خطا در پردازش فایل: " + res.error);
            }
        } catch (error) {
            console.error(error);
            alert("خطای ناشناخته رخ داد");
        } finally {
            setIsSubmittingGPX(false);
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

                    <div className="md:col-span-2 space-y-4">
                        <label className="text-xs text-white/40 flex items-center gap-1">
                            <Map className="w-4 h-4 text-emerald-400" />
                            انتخاب موقعیت روی نقشه (اختیاری)
                        </label>
                        {(() => {
                            const parsedLatMatch = mapLink.match(/[?&]q=([\d.-]+),([\d.-]+)/);
                            const initialLat = parsedLatMatch ? parseFloat(parsedLatMatch[1]) : undefined;
                            const initialLng = parsedLatMatch ? parseFloat(parsedLatMatch[2]) : undefined;

                            return (
                                <MapPicker
                                    key={editId || 'new'}
                                    initialLat={initialLat}
                                    initialLng={initialLng}
                                    onLocationSelect={(link: string) => setMapLink(link)}
                                />
                            );
                        })()}
                        <div className="relative">
                            <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                placeholder="https://maps.google.com/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-3 focus:border-emerald-500 transition-colors outline-none dir-ltr text-left font-mono text-sm"
                                value={mapLink} onChange={e => setMapLink(e.target.value)}
                            />
                        </div>
                        <p className="text-white/40 text-xs mt-1">
                            میتوانید روی نقشه بالا کلیک کنید تا لینک مختصات به طور خودکار در کادر قرار گیرد، و یا اینکه لینک را خودتان مستقیماً از نشان یا مپس کپی و پِیست (Paste) کنید.
                        </p>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs text-white/40 mr-2">توضیحات تکمیلی</label>
                        <textarea
                            placeholder="توضیحات کلی برنامه..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px] focus:border-emerald-500 transition-colors outline-none"
                            value={desc} onChange={e => setDesc(e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-1 space-y-1">
                        <label className="text-xs text-white/40 mr-2">تجهیزات مورد نیاز</label>
                        <textarea
                            placeholder="مثلاً: کفش کوه، کوله پشتی، آب..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[90px] focus:border-emerald-500 transition-colors outline-none"
                            value={equipmentList} onChange={e => setEquipmentList(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-1 space-y-1">
                        <label className="text-xs text-white/40 mr-2">نکات مهم برنامه</label>
                        <textarea
                            placeholder="مثلاً: همراه داشتن کارت شناسایی، عدم استعمال دخانیات..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[90px] focus:border-emerald-500 transition-colors outline-none"
                            value={specialNotes} onChange={e => setSpecialNotes(e.target.value)}
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

                    <div className="col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                        <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            شرایط و ارزش‌های برنامه (اختیاری)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 mr-2 flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-rose-400" /> ارزش‌ها و اصول برنامه
                                </label>
                                <textarea
                                    placeholder="مثلاً: احترام به طبیعت، کار تیمی، سکوت در مسیر..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[80px] focus:border-amber-500 transition-colors outline-none text-sm"
                                    value={termsValues} onChange={e => setTermsValues(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/40 mr-2 flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-cyan-400" /> شرایط شرکت
                                </label>
                                <textarea
                                    placeholder="مثلاً: آوردن رضایت‌نامه، سن حداقل ۱۸ سال..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[80px] focus:border-amber-500 transition-colors outline-none text-sm"
                                    value={termsConditions} onChange={e => setTermsConditions(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <label className="text-xs text-white/40 mr-2">سطح آمادگی بدنی مورد نیاز</label>
                            <div className="flex gap-2">
                                {[
                                    { value: "beginner", label: "مبتدی 🟢", color: "emerald" },
                                    { value: "intermediate", label: "متوسط 🟡", color: "amber" },
                                    { value: "advanced", label: "پیشرفته 🔴", color: "rose" },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setTermsFitness(opt.value)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${termsFitness === opt.value
                                                ? `bg-${opt.color}-500 text-slate-950 border-${opt.color}-500`
                                                : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
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
                {events.map((event) => {
                    const isOwner = userRole === 'owner';
                    const isAdmin = userRole === 'admin';
                    const isOrganizer = userId === event.organizer_id;
                    // Admins can ONLY edit their own events, owners can edit all
                    const canEdit = isOwner || (isAdmin && isOrganizer);
                    const organizer = event.profiles; // From our join

                    return (
                        <div key={event.id} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex gap-4 items-center group hover:border-emerald-500/30 transition-all">
                            {event.image_url ? (
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
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
                                {/* Organizer Info */}
                                {organizer && (
                                    <div className="flex items-center gap-2 mt-2">
                                        {organizer.avatar_url ? (
                                            <img src={organizer.avatar_url} alt={organizer.full_name} className="w-5 h-5 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Users className="w-3 h-3 text-white/40" /></div>
                                        )}
                                        <span className="text-xs text-white/50">سرگروه: {organizer.full_name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions / Status */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-t-0 gap-3">
                                {canEdit && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="bg-white/5 p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors flex items-center gap-2"
                                            title="ویرایش"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span className="text-xs font-bold sm:hidden">ویرایش</span>
                                        </button>
                                        {event.status === 'scheduled' && (
                                            <button
                                                onClick={() => { setSelectedEventToComplete(event); setShowCompleteModal(true); }}
                                                className="bg-emerald-500/10 p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center gap-2"
                                                title="خاتمه برنامه و آپلود فایل مسیر"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-xs font-bold sm:hidden">خاتمه</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ml-auto sm:ml-0 ${event.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400' :
                                    event.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                        'bg-white/5 text-white/30'
                                    }`}>
                                    {event.status === 'scheduled' ? 'در انتظار برگزاری' : event.status === 'completed' ? 'پایان‌یافته' : event.status}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {events.length === 0 && !isLoadingEvents && (
                    <div className="text-center py-10 text-white/30">هنوز برنامه‌ای تعریف نشده است.</div>
                )}
            </div>

            {/* Complete Event GPX Modal */}
            {
                showCompleteModal && selectedEventToComplete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">

                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <CheckCircle className="text-emerald-400 w-5 h-5" />
                                ثبت گزارش صعود
                            </h3>
                            <p className="text-white/50 text-sm mb-6">
                                برای خاتمه برنامه «{selectedEventToComplete.title}»، لطفاً فایل مسیر (GPX) را آپلود کنید تا مسافت، ارتفاع و کالری به صورت خودکار محاسبه شود.
                            </p>

                            <form onSubmit={handleCompleteEvent} className="space-y-4">
                                <div className="border border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors bg-white/5 relative group cursor-pointer">
                                    <Upload className="w-8 h-8 text-white/30 mx-auto mb-3 group-hover:text-emerald-400 transition-colors" />
                                    <div className="text-sm font-bold text-white/70">انتخاب فایل مسیر (GPX)</div>
                                    <div className="text-xs text-white/40 mt-1">اختیاری - بدون فایل هم می‌توانید برنامه را تمام کنید</div>
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".gpx,application/gpx+xml"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>

                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowCompleteModal(false); setSelectedEventToComplete(null); }}
                                        className="px-5 py-2.5 rounded-xl hover:bg-white/5 text-white/60 font-bold transition-colors"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingGPX}
                                        className="px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                    >
                                        {isSubmittingGPX ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                        خاتمه و استخراج آمار
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
