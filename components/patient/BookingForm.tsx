"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Clinic } from "@/types";

interface BookingFormProps {
    clinic: Clinic;
}

export function BookingForm({ clinic }: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
    });

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

            const { data, error: dbError } = await supabase
                .from("appointments")
                .insert([
                    {
                        clinic_id: clinic.id,
                        patient_name: formData.name,
                        patient_phone: formData.phone,
                        date: formData.date,
                        time: formData.time,
                        status: "pending",
                    },
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            // Redirect to success/confirmation (or just show link here)
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                    required
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input
                    required
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                        required
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <input
                        required
                        type="time"
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
            </Button>
        </form>
    );
}
