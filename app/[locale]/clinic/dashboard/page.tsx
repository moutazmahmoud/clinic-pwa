"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Appointment } from "@/types";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { Button } from "@/components/ui/Button";

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
                router.push("/login"); // Or access denied page
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
            // Revert if needed, but for MVP just log
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-4xl space-y-6">
                <header className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold">{clinicName}</h1>
                        <p className="text-sm text-muted-foreground">Dashboard</p>
                    </div>
                    <Button variant="outline" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </header>

                <main className="space-y-4">
                    <h2 className="text-lg font-semibold">Today's Appointments</h2>
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No appointments found.</p>
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
                </main>
            </div>
        </div>
    );
}
