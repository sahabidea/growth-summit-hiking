"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Mountain, TrendingUp } from "lucide-react";

const data = [
    { name: 'هفته ۱', members: 4, applications: 10 },
    { name: 'هفته ۲', members: 12, applications: 25 },
    { name: 'هفته ۳', members: 18, applications: 35 },
    { name: 'هفته ۴', members: 35, applications: 50 },
    { name: 'هفته ۵', members: 55, applications: 85 },
];

export function GrowthChart() {
    return (
        <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        نرخ رشد اعضا
                    </h3>
                    <p className="text-white/40 text-xs font-bold mt-1">نمودار جذب عضو جدید در ماه اخیر</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-xl text-xs font-black">
                    +۴۵٪ رشد
                </div>
            </div>

            <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#ffffff30" fontSize={12} tickFormatter={(value) => `${value}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff10', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="members"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMembers)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
