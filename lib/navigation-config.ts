import { LucideIcon, LayoutDashboard, Users, Calendar, Settings, Stethoscope, ClipboardList, UserCircle, Search, Clock } from "lucide-react";
import { UserRole } from "./auth";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const navigationConfig: Record<UserRole, NavItem[]> = {
    admin: [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Clinics Management",
            href: "/admin/dashboard",
            icon: Stethoscope,
        },
        {
            label: "Users",
            href: "/admin/users",
            icon: Users,
        },
        {
            label: "Settings",
            href: "/admin/settings",
            icon: Settings,
        },
    ],
    clinic: [
        {
            label: "Dashboard",
            href: "/clinic/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Appointments",
            href: "/clinic/dashboard",
            icon: Calendar,
        },
        {
            label: "Availability",
            href: "/clinic/dashboard/availability",
            icon: Clock,
        },
        {
            label: "Patients",
            href: "/clinic/patients",
            icon: Users,
        },
        {
            label: "Profile",
            href: "/clinic/dashboard/profile",
            icon: UserCircle,
        },
    ],
    patient: [
        {
            label: "My Appointments",
            href: "/patient/dashboard",
            icon: ClipboardList,
        },
        {
            label: "Find Doctors",
            href: "/patient/dashboard/clinics",
            icon: Search,
        },
        {
            label: "Profile",
            href: "/patient/dashboard/profile",
            icon: UserCircle,
        },
    ],
};
