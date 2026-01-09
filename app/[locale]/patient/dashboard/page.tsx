"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/i18n/navigation";
import { Appointment, Clinic } from "@/types";
import { PatientAppointmentCard } from "@/components/patient/PatientAppointmentCard";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { ArrowLeft, LayoutDashboard, CalendarDays, Loader2 } from "lucide-react";

type AppointmentWithClinic = Appointment & { clinics?: Clinic };

export default function PatientDashboard() {
    const router = useRouter();
    const t = useTranslations("Patient");
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<AppointmentWithClinic[]>([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        checkUser();
    }, []);

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
                // If not in patients table, could be a clinic or admin
                console.error("Not a patient user");
                router.push("/");
                return;
            }

            setUserName(patient.full_name);
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
                <p className="text-gray-500 font-medium">{t('Common.loading', { defaultValue: 'Loading your appointments...' })}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <LayoutDashboard className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">{t('myAppointments')}</h1>
                            <p className="text-gray-500 font-medium">Welcome back, {userName}</p>
                        </div>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('backToHome')}
                        </Button>
                    </Link>
                </header>

                {/* Main Content */}
                <main className="space-y-6">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-800">History & Status</h2>
                    </div>

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
                </main>
            </div>
        </div>
    );
}
