"use client";

import { useTransition } from "react";
import { joinEvent, cancelBooking } from "@/app/actions/members";
import { Loader2, Check } from "lucide-react";

export function JoinButton({ eventId, status }: { eventId: string; status?: "confirmed" | "waitlist" | null }) {
    const [isPending, startTransition] = useTransition();

    function handleClick() {
        startTransition(async () => {
            if (status === "confirmed") {
                const res = await cancelBooking(eventId);
                if (!res.success) alert(res.error);
            } else {
                const res = await joinEvent(eventId);
                if (!res.success) alert(res.error);
            }
        });
    }

    if (status === "confirmed") {
        return (
            <button
                onClick={handleClick}
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "لغو رزرو"}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "رزرو جایگاه"}
        </button>
    );
}
