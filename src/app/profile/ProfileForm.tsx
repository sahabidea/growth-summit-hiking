"use client";

import { useState } from "react";
import { updateProfileInfo, updatePassword, updateResume } from "@/app/actions/profile";
import { submitAdminRequest, getMyAdminRequest } from "@/app/actions/admin-requests";
import {
    Loader2, CheckCircle2, Lock, Smartphone, User as UserIcon,
    Eye, EyeOff, FileText, Target, Heart, Briefcase, Shield,
    Send, Clock, XCircle, CreditCard
} from "lucide-react";
import { toPersianNum, toPersianPrice } from "@/lib/utils";
import { Profile } from "@/app/actions/members";

interface AdminRequest {
    id: string;
    status: string;
    discount_percent: number;
    admin_fee: number;
    payment_status: string;
}

export default function ProfileForm({
    initialProfile,
    adminRequest: initialAdminRequest
}: {
    initialProfile: Profile;
    adminRequest?: AdminRequest | null;
}) {
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [loadingResume, setLoadingResume] = useState(false);
    const [loadingAdminReq, setLoadingAdminReq] = useState(false);

    // Info State
    const [fullName, setFullName] = useState(initialProfile.full_name || "");
    const [phoneNumber, setPhoneNumber] = useState(initialProfile.phone_number || "");
    const [infoMsg, setInfoMsg] = useState({ type: "", text: "" });

    // Resume State
    const [bio, setBio] = useState(initialProfile.bio || "");
    const [experience, setExperience] = useState(initialProfile.experience || "");
    const [goals, setGoals] = useState(initialProfile.goals || "");
    const [personalValues, setPersonalValues] = useState(initialProfile.personal_values || "");
    const [resumeMsg, setResumeMsg] = useState({ type: "", text: "" });

    // Password State
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passMsg, setPassMsg] = useState({ type: "", text: "" });

    // Admin Request State
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [adminMotivation, setAdminMotivation] = useState("");
    const [adminExperience, setAdminExperience] = useState("");
    const [adminReqMsg, setAdminReqMsg] = useState({ type: "", text: "" });
    const [adminRequest, setAdminRequest] = useState<AdminRequest | null>(initialAdminRequest || null);

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingInfo(true);
        setInfoMsg({ type: "", text: "" });
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("phoneNumber", phoneNumber);
        const res = await updateProfileInfo(formData);
        setInfoMsg({ type: res.success ? "success" : "error", text: (res as any).message || (res as any).error });
        setLoadingInfo(false);
    };

    const handleUpdateResume = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingResume(true);
        setResumeMsg({ type: "", text: "" });
        const res = await updateResume({ bio, experience, goals, personal_values: personalValues });
        setResumeMsg({ type: res.success ? "success" : "error", text: (res as any).message || (res as any).error });
        setLoadingResume(false);
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
            setNewPassword(""); setConfirmPassword("");
        } else {
            setPassMsg({ type: "error", text: res.error! });
        }
        setLoadingPass(false);
    };

    const handleSubmitAdminRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminMotivation.trim()) return;
        setLoadingAdminReq(true);
        setAdminReqMsg({ type: "", text: "" });
        const res = await submitAdminRequest(adminMotivation, adminExperience);
        if (res.success) {
            setAdminReqMsg({ type: "success", text: res.message! });
            setShowAdminForm(false);
            // Refresh admin request status
            const reqRes = await getMyAdminRequest();
            if (reqRes.success && reqRes.data) setAdminRequest(reqRes.data as any);
        } else {
            setAdminReqMsg({ type: "error", text: res.error! });
        }
        setLoadingAdminReq(false);
    };

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        pending: { label: "در انتظار بررسی", color: "amber", icon: Clock },
        approved: { label: "تایید شده ✅", color: "emerald", icon: CheckCircle2 },
        rejected: { label: "رد شده", color: "rose", icon: XCircle },
        payment_required: { label: "در انتظار پرداخت", color: "cyan", icon: CreditCard },
    };

    return (
        <div className="space-y-8">
            {/* ===== RESUME SECTION ===== */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    رزومه من
                </h3>

                <form onSubmit={handleUpdateResume} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-white/60 font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-amber-400/50" />
                            درباره من (بیو)
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-white/20 leading-relaxed"
                            placeholder="چند جمله درباره خودتان بنویسید..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/60 font-medium flex items-center gap-2">
                            <Target className="w-4 h-4 text-cyan-400/50" />
                            تجربیات کوهنوردی
                        </label>
                        <textarea
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-white/20 leading-relaxed"
                            placeholder="تجربیات و صعودهای قبلی شما..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-400/50" />
                                اهداف من
                            </label>
                            <textarea
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-white/20 leading-relaxed"
                                placeholder="اهداف شما از کوهنوردی و رشد شخصی..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-400/50" />
                                ارزش‌های من
                            </label>
                            <textarea
                                value={personalValues}
                                onChange={(e) => setPersonalValues(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-white placeholder:text-white/20 leading-relaxed"
                                placeholder="ارزش‌ها و اصول زندگی شما..."
                            />
                        </div>
                    </div>

                    {resumeMsg.text && (
                        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${resumeMsg.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                            {resumeMsg.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                            {resumeMsg.text}
                        </div>
                    )}

                    <button type="submit" disabled={loadingResume}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black hover:scale-105 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loadingResume ? <><Loader2 className="w-5 h-5 animate-spin" /> ذخیره...</> : "ذخیره رزومه"}
                    </button>
                </form>
            </div>

            {/* ===== ADMIN REQUEST SECTION ===== */}
            {initialProfile.role === "member" && (
                <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        درخواست ادمین شدن
                    </h3>

                    {adminRequest ? (
                        <div className="space-y-4">
                            {(() => {
                                const cfg = statusConfig[adminRequest.status] || statusConfig.pending;
                                const Icon = cfg.icon;
                                return (
                                    <div className={`p-4 rounded-xl border flex items-center gap-3 bg-${cfg.color}-500/10 border-${cfg.color}-500/20`}>
                                        <Icon className={`w-5 h-5 text-${cfg.color}-400`} />
                                        <span className={`text-${cfg.color}-400 font-bold`}>{cfg.label}</span>
                                    </div>
                                );
                            })()}

                            {adminRequest.status === "payment_required" && (
                                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 space-y-3">
                                    <p className="text-sm text-cyan-300 font-bold">
                                        هزینه ادمین: {toPersianPrice(adminRequest.admin_fee || 0)} تومان
                                        {adminRequest.discount_percent > 0 && (
                                            <span className="text-emerald-400 mr-2">({toPersianNum(adminRequest.discount_percent)}٪ تخفیف)</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-white/50">
                                        لطفاً مبلغ را به شماره کارت اعلام شده واریز کنید و کد رهگیری را در بخش پرداخت ثبت کنید.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-white/50 mb-4 leading-relaxed">
                                با ادمین شدن می‌توانید برنامه‌های صعود خود را ایجاد کنید، ۵ نفر را رایگان دعوت کنید و جامعه را رهبری کنید.
                            </p>

                            {!showAdminForm ? (
                                <button
                                    onClick={() => setShowAdminForm(true)}
                                    className="px-6 py-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold hover:bg-purple-500/20 transition-all flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    ارسال درخواست
                                </button>
                            ) : (
                                <form onSubmit={handleSubmitAdminRequest} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60 font-medium">انگیزه‌نامه *</label>
                                        <textarea
                                            value={adminMotivation}
                                            onChange={(e) => setAdminMotivation(e.target.value)}
                                            rows={4}
                                            required
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-white/20 leading-relaxed"
                                            placeholder="چرا می‌خواهید ادمین شوید؟ چه ارزشی به جامعه اضافه می‌کنید؟"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/60 font-medium">تجربیات سرگروهی</label>
                                        <textarea
                                            value={adminExperience}
                                            onChange={(e) => setAdminExperience(e.target.value)}
                                            rows={3}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 !outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-white/20 leading-relaxed"
                                            placeholder="تجربیات قبلی شما در سرگروهی یا سازماندهی..."
                                        />
                                    </div>

                                    {adminReqMsg.text && (
                                        <div className={`p-3 rounded-xl text-sm border ${adminReqMsg.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                                            {adminReqMsg.text}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setShowAdminForm(false)}
                                            className="px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/5 font-bold hover:bg-white/10 transition-all"
                                        >
                                            انصراف
                                        </button>
                                        <button type="submit" disabled={loadingAdminReq}
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black hover:scale-105 transition-all shadow-xl shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {loadingAdminReq ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                            ارسال درخواست
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ===== PROFILE INFO FORM ===== */}
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
                                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-white/20"
                                    placeholder="علی رضایی" required
                                />
                                <UserIcon className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium">شماره موبایل</label>
                            <div className="relative">
                                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} dir="ltr"
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-white/20 text-left font-mono tracking-widest"
                                    placeholder="09121234567" required
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

                    <button type="submit" disabled={loadingInfo}
                        className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loadingInfo ? <><Loader2 className="w-5 h-5 animate-spin" /> در حال ثبت...</> : "ذخیره تغییرات"}
                    </button>
                </form>
            </div>

            {/* ===== PASSWORD FORM ===== */}
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
                                <input type={showPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-white/20 font-mono tracking-wider"
                                    placeholder="••••••••" required minLength={6}
                                />
                                <Lock className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/60 font-medium">تکرار رمز عبور جدید</label>
                            <div className="relative">
                                <input type={showConfirmPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-11 !outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder:text-white/20 font-mono tracking-wider"
                                    placeholder="••••••••" required minLength={6}
                                />
                                <Lock className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors" onClick={() => setShowConfirmPass(!showConfirmPass)}>
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

                    <button type="submit" disabled={loadingPass}
                        className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all shadow-lg border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loadingPass ? <><Loader2 className="w-5 h-5 animate-spin" /> در حال بروزرسانی...</> : "بروزرسانی رمز عبور"}
                    </button>
                </form>
            </div>
        </div>
    );
}
