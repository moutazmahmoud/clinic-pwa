"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Clinic } from "@/types";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [clinics, setClinics] = useState<Clinic[]>([]);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        // Ideally check against an admin table or role, 
        // for MVP just checking if they logged in and maybe a hardcoded email check if not already done in login.
        // In Login we redirected to /admin/dashboard only if email was admin@local.com.
        // But direct access needs verification.

        // For simplicity, we'll assume if they can read the 'clinics' table they are somewhat authorized 
        // (RLS should handle this, but currently public read is on).
        // Let's rely on the previous login check for now or basic session check.
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== "admin@local.com") {
            router.push("/login");
            return;
        }
        fetchClinics();
    };

    const fetchClinics = async () => {
        const { data } = await supabase.from("clinics").select("*").order("created_at", { ascending: false });
        if (data) setClinics(data as Clinic[]);
        setLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("clinics")
            .update({ is_active: !currentStatus })
            .eq("id", id);

        if (!error) {
            setClinics(clinics.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
        }
    };

    if (loading) return <div className="p-8 text-center">Loading admin...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <Button variant="outline" onClick={() => { supabase.auth.signOut(); router.push("/login"); }}>
                        Sign Out
                    </Button>
                </header>

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Clinics Management</h2>
                    <Link href="/admin/clinics/new">
                        <Button>Add New Clinic</Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clinics.map((clinic) => (
                                <tr key={clinic.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{clinic.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clinic.specialty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${clinic.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {clinic.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => toggleStatus(clinic.id, clinic.is_active)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            {clinic.is_active ? 'Disable' : 'Enable'}
                                        </button>
                                        {/* Edit could go here */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
