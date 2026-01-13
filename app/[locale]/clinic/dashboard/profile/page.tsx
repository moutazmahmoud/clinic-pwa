"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/i18n/navigation";
import { Clinic } from "@/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AREAS, SPECIALTIES } from "@/constants";
import { Loader2, Stethoscope, Save, CheckCircle2 } from "lucide-react";

export default function ClinicProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        area: "",
        phone: "",
        working_hours: "",
        bio: "",
        address: "",
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
                .from("clinics")
                .select("*")
                .eq("email", user.email!)
                .single();

            if (error || !data) {
                console.error("Error fetching profile:", error);
                router.push("/");
                return;
            }

            setClinic(data as Clinic);
            setFormData({
                name: data.name,
                specialty: data.specialty,
                area: data.area,
                phone: data.phone,
                working_hours: data.working_hours,
                bio: data.bio || "",
                address: data.address || "",
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
                .from("clinics")
                .update({
                    name: formData.name,
                    specialty: formData.specialty,
                    area: formData.area,
                    phone: formData.phone,
                    working_hours: formData.working_hours,
                    bio: formData.bio,
                    address: formData.address,
                })
                .eq("id", clinic?.id);

            if (error) throw error;

            setMessage({ type: 'success', text: "Clinic profile updated successfully!" });
            setClinic(prev => prev ? { ...prev, ...formData } : null);
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
        <DashboardLayout userRole="clinic" userName={clinic?.name} pageTitle="Clinic Profile">
            <div className="max-w-3xl mx-auto space-y-6 pb-12">
                {/* Header Section */}
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Clinic Information</h2>
                        <p className="text-gray-500">Manage your clinic details and patients will see this information</p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8 rounded-3xl bg-white shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <Input
                                label="Clinic Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Clinic Name"
                                required
                            />

                            <Input
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Contact Number"
                                required
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Specialty</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    required
                                >
                                    <option value="">Select Specialty</option>
                                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Area</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    required
                                >
                                    <option value="">Select Area</option>
                                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>

                            <Input
                                label="Working Hours"
                                value={formData.working_hours}
                                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                                placeholder="e.g. 9:00 AM - 5:00 PM"
                                required
                                containerClassName="md:col-span-2"
                            />

                            <Input
                                label="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Full Address"
                                containerClassName="md:col-span-2"
                            />

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Bio / Description</label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Brief description of your clinic"
                                />
                            </div>
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
                                        Updating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        Save Profile Details
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
