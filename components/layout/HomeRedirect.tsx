"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import { getUserRole, getDashboardPath } from "@/lib/auth";

export function HomeRedirect() {
    const router = useRouter();

    useEffect(() => {
        const checkUserAndRedirect = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return; // Not logged in, stay on homepage

            // Get user role and redirect to appropriate dashboard
            const role = await getUserRole();

            if (role) {
                router.push(getDashboardPath(role));
            }
        };

        checkUserAndRedirect();
    }, [router]);

    return null; // This component doesn't render anything
}
