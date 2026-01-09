"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Clinic } from "@/types";

interface BookingFormProps {
    clinic: Clinic;
}

import { useTranslations } from "next-intl";
import { Calendar, Clock, User, Phone, Loader2, CheckCircle2 } from "lucide-react";

interface BookingFormProps {
    clinic: Clinic;
}

export function BookingForm({ clinic }: BookingFormProps) {
    const router = useRouter();
    const t = useTranslations("Clinics");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
    });

    const [isPatient, setIsPatient] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: patient } = await supabase
                    .from("patients")
                    .select("full_name, phone")
                    .eq("email", user.email)
                    .single();

                if (patient) {
                    setFormData(prev => ({
                        ...prev,
                        name: patient.full_name,
                        phone: patient.phone,
                    }));
                    setIsPatient(true);
                }
            }
        };
        fetchUserData();
    }, []);

    const generateWhatsAppLink = (appointmentId: string) => {
        const message = `Hello, I would like to confirm my appointment.\n\nClinic: ${clinic.name}\nPatient: ${formData.name}\nDate: ${formData.date}\nTime: ${formData.time}\nID: ${appointmentId}`;
        return `https://wa.me/${clinic.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.date || !formData.time || !formData.name || !formData.phone) {
                throw new Error("Please fill in all fields");
            }

            const { data: { user } } = await supabase.auth.getUser();
            let patientId = null;

            if (user) {
                const { data: patient } = await supabase
                    .from("patients")
                    .select("id")
                    .eq("email", user.email)
                    .single();
                if (patient) patientId = patient.id;
            }

            const { data, error: dbError } = await supabase
                .from("appointments")
                .insert([
                    {
                        clinic_id: clinic.id,
                        patient_name: formData.name,
                        patient_phone: formData.phone,
                        patient_id: patientId,
                        date: formData.date,
                        time: formData.time,
                        status: "pending",
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            const waLink = generateWhatsAppLink(data.id);
            router.push(`/book/confirmation?link=${encodeURIComponent(waLink)}&clinicName=${encodeURIComponent(clinic.name)}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 space-y-6">
                <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Clock className="h-4 w-4" />
                        </div>
                        {t('bookAppointment')}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Select your preferred time and date.</p>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            Full Name
                        </label>
                        <input
                            required
                            type="text"
                            className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-medium transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Ahmed Ali"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            Phone Number
                        </label>
                        <input
                            required
                            type="tel"
                            className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-medium transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0123 456 7890"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                Date
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-medium transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                Time
                            </label>
                            <input
                                required
                                type="time"
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-medium transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="h-14 w-full rounded-2xl bg-primary text-base font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Booking...
                        </>
                    ) : (
                        <>
                            Confirm Booking
                            <CheckCircle2 className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
