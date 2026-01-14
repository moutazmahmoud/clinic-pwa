"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardProvider, useDashboard } from "@/components/layout/DashboardContext";
import { useRouter } from "@/i18n/navigation";

function PatientDataFetcher({ children }: { children: React.ReactNode }) {
    const { setUserName } = useDashboard();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("patients")
                .select("full_name")
                .eq("email", user.email!)
                .single();

            if (data) {
                setUserName(data.full_name);
            }
        };

        fetchUser();
    }, [setUserName, router]);

    return <>{children}</>;
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <PatientDataFetcher>
                <DashboardShell userRole="patient">
                    {children}
                </DashboardShell>
            </PatientDataFetcher>
        </DashboardProvider>
    );
}
