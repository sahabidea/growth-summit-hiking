"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// 5 minutes in milliseconds
const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;

export default function AutoLogoutProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const checkAndLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { session } } = await supabase.auth.getSession();

        // Only log out if a user is currently logged in
        if (session) {
            await supabase.auth.signOut();
            router.push('/login?message=شما به دلیل عدم فعالیت از سیستم خارج شدید');
            router.refresh();
        }
    };

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Do not enforce auto-logout on the login page itself
        if (pathname?.startsWith('/login')) {
            return;
        }

        timeoutRef.current = setTimeout(() => {
            checkAndLogout();
        }, INACTIVITY_LIMIT_MS);
    };

    useEffect(() => {
        // Run initial timer setup
        resetTimer();

        // Listen for user activity
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [pathname]);

    return <>{children}</>;
}
