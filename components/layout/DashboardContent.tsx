import { ReactNode } from "react";

interface DashboardContentProps {
    children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
    return (
        <div className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}
