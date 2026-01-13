"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/i18n/navigation";
import { Appointment } from "@/types";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loader2, Calendar } from "lucide-react";

export default function ClinicDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [clinicName, setClinicName] = useState("");

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

            // Get clinic details
            const { data: clinic, error } = await supabase
                .from("clinics")
                .select("id, name")
                .eq("email", user.email!)
                .single();

            if (error || !clinic) {
                console.error("Not a clinic user");
                router.push("/login");
                return;
            }

            setClinicName(clinic.name);
            fetchAppointments(clinic.id);
        } catch (error) {
            console.error(error);
            router.push("/login");
        }
    };

    const fetchAppointments = async (clinicId: string) => {
        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .eq("clinic_id", clinicId)
            .order("date", { ascending: true })
            .order("time", { ascending: true });

        if (data) {
            setAppointments(data as Appointment[]);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: Appointment["status"]) => {
        // Optimistic update
        setAppointments(appointments.map(a =>
            a.id === id ? { ...a, status: newStatus } : a
        ));

        const { error } = await supabase
            .from("appointments")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout userRole="clinic" userName={clinicName} pageTitle="Clinic Dashboard">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-3 p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Today's Appointments</h2>
                        <p className="text-gray-500">Manage and track your patient appointments</p>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No Appointments</h3>
                            <p className="text-gray-500 mt-2">You have no appointments scheduled for today.</p>
                        </div>
                    ) : (
                        appointments.map((appt) => (
                            <AppointmentCard
                                key={appt.id}
                                appointment={appt}
                                onStatusChange={updateStatus}
                            />
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
