"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/i18n/navigation";
import { Patient } from "@/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { Loader2, UserCircle, Save, CheckCircle2 } from "lucide-react";

export default function PatientProfilePage() {
    const router = useRouter();
    const t = useTranslations("Patient");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("patients")
                .select("*")
                .eq("email", user.email!)
                .single();

            if (error || !data) {
                console.error("Error fetching profile:", error);
                router.push("/");
                return;
            }

            setPatient(data as Patient);
            setFormData({
                full_name: data.full_name,
                phone: data.phone,
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            router.push("/login");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from("patients")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                })
                .eq("id", patient?.id);

            if (error) throw error;

            setMessage({ type: 'success', text: "Profile updated successfully!" });
            // Update local state
            setPatient(prev => prev ? { ...prev, ...formData } : null);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <DashboardLayout userRole="patient" userName={patient?.full_name} pageTitle="My Profile">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <UserCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-gray-500">Update your profile details and contact information</p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <div className="grid gap-6">
                            <Input
                                label="Full Name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Your full name"
                                required
                            />

                            <Input
                                label="Email Address"
                                value={patient?.email}
                                disabled
                                helperText="Email cannot be changed as it is linked to your account"
                            />

                            <Input
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. +201234567890"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
