"use client";

import { useState, useEffect } from "react";
import { fetchAllUsers, updateUserRole } from "@/app/actions/admin-users";
import { Loader2, Users, CheckCircle2, ShieldAlert } from "lucide-react";

export default function UserManager() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [currentUserRole, setCurrentUserRole] = useState<string>('member');

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        const res = await fetchAllUsers();
        if (res.success && res.data) {
            setCurrentUserRole(res.currentUserRole);

            let fetchedUsers = res.data;
            if (res.currentUserRole !== 'owner') {
                // If not owner (e.g., admin), filter out owners and admins
                fetchedUsers = fetchedUsers.filter((u: any) => u.role !== 'owner' && u.role !== 'admin');
            }

            setUsers(fetchedUsers);
        }
        setLoading(false);
    }

    async function handleRoleChange(userId: string, newRole: string) {
        setUpdatingId(userId);
        const res = await updateUserRole(userId, newRole);
        if (res.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } else {
            alert("خطا در تغییر نقش");
        }
        setUpdatingId(null);
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display flex items-center gap-3">
                    <ShieldAlert className="text-emerald-400" />
                    مدیریت دسترسی کاربران
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-white/50 bg-white/5 rounded-xl uppercase border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 rounded-tr-xl">کاربر</th>
                            <th className="px-6 py-4">شماره تماس</th>
                            <th className="px-6 py-4">نقش فعلی</th>
                            <th className="px-6 py-4 rounded-tl-xl text-center">عملیات تغییر نقش</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10"><Loader2 className="animate-spin h-6 w-6 mx-auto text-emerald-500" /></td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-white/50">هیچ کاربری یافت نشد.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold flex items-center gap-3">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                <Users className="w-5 h-5 text-white/40" />
                                            </div>
                                        )}
                                        {user.full_name || "کاربر ناشناس"}
                                        {user.role === 'owner' && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline mr-2" />}
                                    </td>
                                    <td className="px-6 py-4 text-white/70 dir-ltr text-right">{user.phone_number}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'owner' ? 'bg-indigo-500/20 text-indigo-400' :
                                            user.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-white/10 text-white/60'
                                            }`}>
                                            {user.role === 'owner' ? 'مالک' : user.role === 'admin' ? 'سرگروه' : 'عضو'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <select
                                                disabled={updatingId === user.id || currentUserRole !== 'owner'}
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`bg-slate-950 border text-white/80 rounded-xl px-3 py-2 text-xs transition-colors ${currentUserRole === 'owner' ? 'border-white/10 focus:border-emerald-500 outline-none' : 'border-transparent opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <option value="member">عضو عادی</option>
                                                {currentUserRole === 'owner' && <option value="admin">سرگروه (Admin)</option>}
                                                {currentUserRole === 'owner' && <option value="owner">مالک (Owner)</option>}
                                            </select>
                                            {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
