"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { navigationConfig } from "@/lib/navigation-config";
import { UserRole } from "@/lib/auth";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
    userRole: UserRole;
    isOpen: boolean;
    onClose: () => void;
}

export function DashboardSidebar({ userRole, isOpen, onClose }: DashboardSidebarProps) {
    const pathname = usePathname();
    const navItems = navigationConfig[userRole];

    const getBrandName = (role: UserRole) => {
        switch (role) {
            case "admin":
                return "Admin Panel";
            case "clinic":
                return "Clinic Portal";
            case "patient":
                return "Patient Portal";
        }
    };

    const getBrandColor = (role: UserRole) => {
        switch (role) {
            case "admin":
                return "from-purple-600 to-indigo-600";
            case "clinic":
                return "from-blue-600 to-cyan-600";
            case "patient":
                return "from-green-600 to-emerald-600";
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", getBrandColor(userRole))}>
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">ClinicBook</h2>
                            <p className="text-xs text-gray-500">{getBrandName(userRole)}</p>
                        </div>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                    // Close mobile menu on navigation
                                    if (window.innerWidth < 1024) {
                                        onClose();
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
                                    )}
                                />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gradient-to-t from-gray-50/80 to-transparent backdrop-blur-sm">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 border border-gray-200">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-gray-600 font-medium">Online</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
