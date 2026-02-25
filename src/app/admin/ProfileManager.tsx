"use client";

import { useState, useEffect } from "react";
import { Loader2, User, Save, Link as LinkIcon, Edit3, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateGuideProfile } from "@/app/actions/admin-users";

export default function ProfileManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [profile, setProfile] = useState({
        bio: "",
        specialties: "", // We'll handle this as a comma-separated string in UI
        instagram_url: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('profiles').select('bio, specialties, instagram_url').eq('id', user.id).single();
            if (data) {
                setProfile({
                    bio: data.bio || "",
                    specialties: data.specialties ? data.specialties.join(", ") : "",
                    instagram_url: data.instagram_url || ""
                });
            }
        }
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        const specialtiesArray = profile.specialties
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const res = await updateGuideProfile({
            bio: profile.bio,
            specialties: specialtiesArray,
            instagram_url: profile.instagram_url
        });

        if (res.success) {
            setMessage({ text: "پروفایل با موفقیت بروزرسانی شد.", type: "success" });
        } else {
            setMessage({ text: res.error || "خطا در بروزرسانی", type: "error" });
        }
        setSaving(false);
    }

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <User className="text-emerald-400 w-8 h-8" />
                <h2 className="text-2xl font-display">پروفایل راهنما / سرگروه</h2>
            </div>

            <p className="text-white/60 mb-8 text-sm leading-relaxed">
                اطلاعات وارد شده در این بخش به صورت عمومی در صفحه اختصاصی شما به عنوان راهنمای برنامه‌ها نمایش داده خواهد شد. این اطلاعات به اعتماد بیشتر شرکت‌کنندگان کمک می‌کند.
            </p>

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        درباره من (بیوگرافی)
                    </label>
                    <textarea
                        rows={5}
                        placeholder="خلاصه‌ای از سوابق کوهنوردی، دوره‌های گذرانده شده و فلسفه کاری شما..."
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors resize-y"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        تخصص‌ها و مهارت‌ها
                    </label>
                    <input
                        type="text"
                        placeholder="مثال: سنگ‌نوردی، یخ‌نوردی، کوهپیمایی (با کاما جدا کنید)"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        value={profile.specialties}
                        onChange={(e) => setProfile({ ...profile, specialties: e.target.value })}
                    />
                    <p className="text-xs text-white/40 mt-2">تخصص‌ها را با علامت کاما (،) از هم جدا کنید.</p>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white/80 mb-2">
                        <LinkIcon className="w-4 h-4 text-emerald-400" />
                        لینک اینستاگرام
                    </label>
                    <input
                        type="url"
                        dir="ltr"
                        placeholder="https://instagram.com/username"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        value={profile.instagram_url}
                        onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    {message.text && (
                        <p className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {message.text}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 mr-auto disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        ذخیره تغییرات
                    </button>
                </div>
            </form>
        </div>
    );
}
