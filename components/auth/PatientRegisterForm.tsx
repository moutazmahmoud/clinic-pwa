"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

export function PatientRegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        full_name: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            // 1. Sign up user with Supabase Auth and set role
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: "patient",
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create patient profile in 'patients' table
                const { error: dbError } = await supabase.from("patients").insert([
                    {
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                    },
                ]);

                if (dbError) {
                    throw dbError;
                }

                router.push("/patient/dashboard"); // Redirect to patient dashboard
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
                <h2 className="text-2xl font-bold text-gray-900">Patient Registration</h2>
                <p className="text-sm text-gray-500 mt-2">Create an account to track your appointments</p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <Input
                    id="full_name"
                    label="Full Name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                />

                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                <Input
                    id="phone"
                    type="tel"
                    label="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <Button className="w-full font-semibold text-lg h-12 mt-4" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Register as Patient
            </Button>
        </form>
    );
}
