"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Clinic } from "@/types";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
    const router = useRouter();
    const t = useTranslations("Admin");
    const [loading, setLoading] = useState(true);
    const [clinics, setClinics] = useState<Clinic[]>([]);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
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

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Loading...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
                        <p className="text-gray-500 mt-1">Manage your platform clinics and settings</p>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => { supabase.auth.signOut(); router.push("/login"); }}>
                        Sign Out
                    </Button>
                </header>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">{t('clinicsManagement')}</h2>
                    <Link href="/admin/clinics/new" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            {t('addNewClinic')}
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('clinicName')}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('area')}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('specialty')}</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {clinics.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No clinics found. Create your first one!
                                        </td>
                                    </tr>
                                ) : (
                                    clinics.map((clinic) => (
                                        <tr key={clinic.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{clinic.name}</span>
                                                    <span className="text-xs text-gray-500">{clinic.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{clinic.area}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{clinic.specialty}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clinic.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${clinic.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {clinic.is_active ? t('active') : t('disabled')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => toggleStatus(clinic.id, clinic.is_active)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${clinic.is_active ? 'text-red-600 hover:bg-red-50' : 'text-primary hover:bg-primary/5'}`}
                                                >
                                                    {clinic.is_active ? t('disable') : t('enable')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
