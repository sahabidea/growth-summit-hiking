"use client";

import { useState, useRef } from "react";
import { uploadAvatar, removeAvatar } from "@/app/actions/profile";
import { Camera, Loader2, Trash2, Upload, CheckCircle2 } from "lucide-react";

interface AvatarUploadProps {
    currentAvatarUrl: string | null | undefined;
    userName: string;
}

export default function AvatarUpload({ currentAvatarUrl, userName }: AvatarUploadProps) {
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || "");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setLoading(true);
        setMsg({ type: "", text: "" });

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await uploadAvatar(formData);

        if (res.success && res.avatarUrl) {
            setAvatarUrl(res.avatarUrl + "?t=" + Date.now()); // bust cache
            setMsg({ type: "success", text: "عکس با موفقیت آپلود شد." });
        } else {
            setMsg({ type: "error", text: res.error || "خطا در آپلود" });
        }
        setLoading(false);
    };

    const handleRemove = async () => {
        setLoading(true);
        setMsg({ type: "", text: "" });
        const res = await removeAvatar();
        if (res.success) {
            setAvatarUrl("");
            setMsg({ type: "success", text: "عکس حذف شد." });
        } else {
            setMsg({ type: "error", text: (res as any).error || "خطا" });
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Avatar Display + Upload Trigger */}
            <div
                className={`relative w-28 h-28 rounded-full cursor-pointer group transition-all ${dragOver ? "ring-4 ring-emerald-500 scale-105" : ""
                    }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {/* Avatar Image */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-4xl shadow-xl shadow-emerald-500/20 overflow-hidden border-2 border-white/10">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        userName ? userName.charAt(0).toUpperCase() : "U"
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {loading ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                        <Camera className="w-6 h-6 text-white" />
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Upload hint */}
            <p className="text-[10px] text-white/30 mt-2 text-center">
                کلیک یا درگ فایل
            </p>

            {/* Remove button */}
            {avatarUrl && !loading && (
                <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                    className="mt-2 flex items-center gap-1 text-xs text-rose-400/60 hover:text-rose-400 transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                    حذف عکس
                </button>
            )}

            {/* Status message */}
            {msg.text && (
                <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg ${msg.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                    {msg.text}
                </div>
            )}
        </div>
    );
}
