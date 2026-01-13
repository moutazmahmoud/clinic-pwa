"use client";

import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/i18n/navigation";
import { UserRole } from "@/lib/auth";

interface DashboardHeaderProps {
    title: string;
    userName?: string;
    userRole: UserRole;
    onMenuClick: () => void;
}

export function DashboardHeader({ title, userName, userRole, onMenuClick }: DashboardHeaderProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "clinic":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "patient":
                return "bg-green-100 text-green-700 border-green-200";
        }
    };

    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-6 w-6 text-gray-600" />
                </button>

                {/* Page Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:block">
                    {title}
                </h1>
                <div className="sm:hidden text-lg font-bold text-gray-900">{title}</div>

                {/* User Profile Section */}
                <div className="flex items-center gap-3">
                    {userName && (
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">{userName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(userRole)}`}>
                                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
