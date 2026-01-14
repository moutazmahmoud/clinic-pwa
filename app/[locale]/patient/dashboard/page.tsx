"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/i18n/navigation";
import { Appointment, Clinic } from "@/types";
import { PatientAppointmentCard } from "@/components/patient/PatientAppointmentCard";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { CalendarDays, Loader2 } from "lucide-react";
import { useDashboard } from "@/components/layout/DashboardContext";

type AppointmentWithClinic = Appointment & { clinics?: Clinic };

export default function PatientDashboard() {
    const router = useRouter();
    const t = useTranslations("Patient");
    const tCommon = useTranslations("Common");
    const { setTitle } = useDashboard();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<AppointmentWithClinic[]>([]);

    useEffect(() => {
        setTitle(t('myAppointments'));
        checkUser();
    }, [setTitle, t]);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Get patient profile
            const { data: patient, error } = await supabase
                .from("patients")
                .select("*")
                .eq("email", user.email!)
                .single();

            if (error || !patient) {
                console.error("Not a patient user");
                router.push("/");
                return;
            }

            fetchAppointments(patient.id);
        } catch (error) {
            console.error(error);
            router.push("/login");
        }
    };

    const fetchAppointments = async (patientId: string) => {
        const { data, error } = await supabase
            .from("appointments")
            .select(`
                *,
                clinics (*)
            `)
            .eq("patient_id", patientId)
            .order("date", { ascending: false });

        if (data) {
            setAppointments(data as AppointmentWithClinic[]);
        }
        setLoading(false);
    };

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;

        const { error } = await supabase
            .from("appointments")
            .update({ status: 'cancelled' })
            .eq("id", id);

        if (!error) {
            setAppointments(appointments.map(a =>
                a.id === id ? { ...a, status: 'cancelled' } : a
            ));
        }
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">{tCommon('loading', { defaultValue: 'Loading your appointments...' })}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Appointment History</h2>
                    <p className="text-gray-500">Track your past and upcoming appointments</p>
                </div>
            </div>

            {/* Appointments List */}
            <div className="grid gap-4">
                {appointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <CalendarDays className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t('noAppointments')}</h3>
                        <p className="text-gray-500 mt-2 mb-6">{t('bookFirst')}</p>
                        <Link href="/clinics">
                            <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:scale-105 transition-transform">
                                Find a Doctor
                            </Button>
                        </Link>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <PatientAppointmentCard
                            key={appt.id}
                            appointment={appt}
                            onCancel={handleCancel}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
