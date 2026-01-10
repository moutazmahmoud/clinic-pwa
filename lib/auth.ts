import { supabase } from "./supabase";

export type UserRole = "patient" | "clinic" | "admin";

export interface UserWithRole {
    id: string;
    email: string;
    role: UserRole;
}

/**
 * Get the current user's role from their metadata
 * Returns null if no user is logged in or role is not set
 */
export async function getUserRole(): Promise<UserRole | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        // Check for admin first (hardcoded admin email)
        if (user.email === "moutaz.prof.egy@gmail.com") {
            return "admin";
        }

        // Get role from user metadata
        const role = user.user_metadata?.role as UserRole | undefined;

        if (role && ["patient", "clinic", "admin"].includes(role)) {
            return role;
        }

        // Fallback: Check tables for existing users without role metadata
        // This ensures backward compatibility
        const { data: clinic } = await supabase
            .from("clinics")
            .select("id")
            .eq("email", user.email!)
            .maybeSingle();

        if (clinic) return "clinic";

        const { data: patient } = await supabase
            .from("patients")
            .select("id")
            .eq("email", user.email!)
            .maybeSingle();

        if (patient) return "patient";

        return null;
    } catch (error) {
        console.error("Error getting user role:", error);
        return null;
    }
}

/**
 * Get the current user with their role
 */
export async function getCurrentUserWithRole(): Promise<UserWithRole | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const role = await getUserRole();

    if (!role) return null;

    return {
        id: user.id,
        email: user.email!,
        role,
    };
}

/**
 * Get the dashboard path for a given role
 */
export function getDashboardPath(role: UserRole): string {
    const paths: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        clinic: "/clinic/dashboard",
        patient: "/patient/dashboard",
    };

    return paths[role];
}
