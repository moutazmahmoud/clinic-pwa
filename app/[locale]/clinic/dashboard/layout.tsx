"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardProvider, useDashboard } from "@/components/layout/DashboardContext";
import { useRouter } from "@/i18n/navigation";

function ClinicDataFetcher({ children }: { children: React.ReactNode }) {
    const { setUserName } = useDashboard();
    const router = useRouter();
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("clinics")
                .select("name")
                .eq("email", user.email!)
                .single();

            if (data) {
                setUserName(data.name);
            }
            setFetched(true);
        };

        fetchUser();
    }, [setUserName, router]);

    // Render children immediately, update name when ready
    return <>{children}</>;
}

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <ClinicDataFetcher>
                <DashboardShell userRole="clinic">
                    {children}
                </DashboardShell>
            </ClinicDataFetcher>
        </DashboardProvider>
    );
}
