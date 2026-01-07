"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AREAS, SPECIALTIES } from "@/constants";
import Link from "next/link";

export default function AddClinicPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        area: AREAS[0],
        specialty: SPECIALTIES[0],
        working_hours: "09:00 - 17:00",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("clinics").insert([formData]);
            if (error) throw error;

            // Ideally we also create a user in Supabase Auth here so they can login.
            // But client-side cannot create other users easily without Service Role.
            // For MVP, we will assume the User is created manually in Supabase Auth Dashboard 
            // OR we just create the clinic record and tell the admin to invite/signup the user.

            alert("Clinic created! Please ensure a matching Auth User exists with this email.");
            router.push("/admin/dashboard");
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-bold">Add New Clinic</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                        <input required type="text" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email (for Login)</label>
                        <input required type="email" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input required type="tel" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Area</label>
                            <select className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                                value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}>
                                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specialty</label>
                            <select className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                                value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })}>
                                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Working Hours</label>
                        <input required type="text" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.working_hours} onChange={e => setFormData({ ...formData, working_hours: e.target.value })} />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Link href="/admin/dashboard">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Clinic'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
