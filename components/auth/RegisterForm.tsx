"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
// Input component not created yet, using standard inputs
import { Loader2 } from "lucide-react";
import { AREAS, SPECIALTIES } from "@/constants";

export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        specialty: "",
        area: "",
        working_hours: "09:00 - 17:00",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign up user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create clinic profile in 'clinics' table
                const { error: dbError } = await supabase.from("clinics").insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        specialty: formData.specialty,
                        area: formData.area,
                        working_hours: formData.working_hours,
                        is_active: true, // Auto-activate for MVP simplicity
                    },
                ]);

                if (dbError) {
                    // If DB insertion fails, we should technically rollback auth user, 
                    // but for MVP we'll just show error. 
                    throw dbError;
                }

                router.push("/clinic/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Join ClinicBook</h2>
                <p className="text-sm text-gray-500 mt-2">Create your clinic profile today</p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Clinic Name</label>
                <input
                    id="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <input
                    id="password"
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    id="phone"
                    type="tel"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="area" className="text-sm font-medium text-gray-700">Location</label>
                    <select
                        id="area"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        value={formData.area}
                        onChange={handleChange}
                    >
                        <option value="">Select Area</option>
                        {AREAS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="specialty" className="text-sm font-medium text-gray-700">Specialty</label>
                    <select
                        id="specialty"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        value={formData.specialty}
                        onChange={handleChange}
                    >
                        <option value="">Select Specialty</option>
                        {SPECIALTIES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Button className="w-full font-semibold text-lg h-12 mt-4" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Register Clinic
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link>
            </p>
        </form>
    );
}
