"use client";

import { useState } from "react";
import { updateProfileInfo, updatePassword } from "@/app/actions/profile";
import { Loader2, CheckCircle2, Lock, Smartphone, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Profile } from "@/app/actions/members";

export default function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    // Info State
    const [fullName, setFullName] = useState(initialProfile.full_name || "");
    const [phoneNumber, setPhoneNumber] = useState(initialProfile.phone_number || "");
    const [infoMsg, setInfoMsg] = useState({ type: "", text: "" });

    // Password State
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passMsg, setPassMsg] = useState({ type: "", text: "" });

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingInfo(true);
        setInfoMsg({ type: "", text: "" });

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("phoneNumber", phoneNumber);

        const res = await updateProfileInfo(formData);

        if (res.success) {
            setInfoMsg({ type: "success", text: res.message! });
        } else {
            setInfoMsg({ type: "error", text: res.error! });
        }

        setLoadingInfo(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPass(true);
        setPassMsg({ type: "", text: "" });

        const formData = new FormData();
        formData.append("newPassword", newPassword);
        formData.append("confirmPassword", confirmPassword);

        const res = await updatePassword(formData);

        if (res.success) {
            setPassMsg({ type: "success", text: res.message! });
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setPassMsg({ type: "error", text: res.error! });
        }

        setLoadingPass(false);
    };

    return (
        <div className="space-y-8">
            {/* Profile Info Form */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-emerald-400" />
                    ویرایش اطلاعات شخصی
                </h3>

                <form onSubmit={handleUpdateInfo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium">نام و نام خانوادگی</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-white/20"
                                    placeholder="علی رضایی"
                                    required
                                />
                                <UserIcon className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium">شماره موبایل</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    dir="ltr"
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-white/20 text-left font-mono tracking-widest"
                                    placeholder="09121234567"
                                    required
                                />
                                <Smartphone className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/50" />
                            </div>
                        </div>
                    </div>

                    {infoMsg.text && (
                        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${infoMsg.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                            {infoMsg.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                            {infoMsg.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loadingInfo}
                        className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loadingInfo ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                در حال ثبت...
                            </>
                        ) : (
                            "ذخیره تغییرات"
                        )}
                    </button>
                </form>
            </div>

            {/* Password Update Form */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-amber-500" />
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-400" />
                    تغییر رمز عبور
                </h3>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium">رمز عبور جدید</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-white/20 font-mono tracking-wider"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <Lock className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <button
                                    type="button"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium">تکرار رمز عبور جدید</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-white/20 font-mono tracking-wider"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <Lock className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <button
                                    type="button"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                >
                                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {passMsg.text && (
                        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${passMsg.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                            {passMsg.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                            {passMsg.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loadingPass}
                        className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all shadow-lg border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loadingPass ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                در حال بروزرسانی...
                            </>
                        ) : (
                            "بروزرسانی رمز عبور"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
