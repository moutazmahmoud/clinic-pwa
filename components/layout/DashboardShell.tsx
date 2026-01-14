"use client";

import { ReactNode, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { UserRole } from "@/lib/auth";
import { useDashboard } from "./DashboardContext";

interface DashboardShellProps {
    children: ReactNode;
    userRole: UserRole;
}

export function DashboardShell({ children, userRole }: DashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { title, userName } = useDashboard();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                userRole={userRole}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <DashboardHeader
                    title={title}
                    userName={userName}
                    userRole={userRole}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* Page Content */}
                <DashboardContent>{children}</DashboardContent>
            </div>
        </div>
    );
}
