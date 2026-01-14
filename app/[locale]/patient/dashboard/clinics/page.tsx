"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/i18n/navigation";
import { Clinic } from "@/types";
import { ClinicCard } from "@/components/patient/ClinicCard";
import { SearchFilters } from "@/components/patient/SearchFilters";
import { useTranslations } from "next-intl";
import { Loader2, Stethoscope, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useDashboard } from "@/components/layout/DashboardContext";

function ClinicsList() {
    const searchParams = useSearchParams();
    const area = searchParams.get("area");
    const specialty = searchParams.get("specialty");

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClinics();
    }, [area, specialty]);

    const fetchClinics = async () => {
        setLoading(true);
        let query = supabase.from("clinics").select("*").eq("is_active", true);

        if (area) {
            query = query.eq("area", area);
        }
        if (specialty) {
            query = query.eq("specialty", specialty);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching clinics:", error);
        } else {
            setClinics(data as Clinic[]);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-gray-500 mt-4">Searching for available clinics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <p className="text-sm text-gray-500">
                    Showing results for:
                    <span className="font-semibold text-gray-900 ml-1">{area || "All Areas"}</span>
                    {" & "}
                    <span className="font-semibold text-gray-900">{specialty || "All Specialties"}</span>
                </p>
            </div>

            <div className="grid gap-4">
                {clinics.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No clinics found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters to find more results.</p>
                    </div>
                ) : (
                    clinics.map((clinic) => (
                        <ClinicCard key={clinic.id} clinic={clinic} />
                    ))
                )}
            </div>
        </div>
    );
}

export default function PatientClinicsPage() {
    const router = useRouter();
    const t = useTranslations("Patient");
    const { setTitle } = useDashboard();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle("Find Clinics");
        checkUser();
    }, [setTitle]);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data: patient, error } = await supabase
                .from("patients")
                .select("*")
                .eq("email", user.email!)
                .single();

            if (error || !patient) {
                router.push("/");
                return;
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            router.push("/login");
        }
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Available Clinics</h2>
                    <p className="text-gray-500">Find and book appointments with top medical professionals</p>
                </div>
            </div>

            {/* Filters */}
            <SearchFilters className="!max-w-none !bg-white !shadow-sm !border-gray-100" />

            {/* Search Results */}
            <Suspense fallback={<div>Loading filters...</div>}>
                <ClinicsList />
            </Suspense>
        </div>
    );
}
