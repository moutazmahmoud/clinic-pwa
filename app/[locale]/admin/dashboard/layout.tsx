"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardProvider, useDashboard } from "@/components/layout/DashboardContext";
import { useEffect } from "react";

function AdminDataSetter({ children }: { children: React.ReactNode }) {
    const { setUserName } = useDashboard();

    useEffect(() => {
        setUserName("Administrator");
    }, [setUserName]);

    return <DashboardShell userRole="admin">{children}</DashboardShell>;
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <AdminDataSetter>
                {children}
            </AdminDataSetter>
        </DashboardProvider>
    );
}
