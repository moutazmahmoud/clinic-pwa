"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { AREAS, SPECIALTIES } from "@/constants";
import { useTranslations } from "next-intl";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";

export default function AddClinicPage() {
    const router = useRouter();
    const t = useTranslations("Admin");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        area: AREAS[0],
        specialty: SPECIALTIES[0],
        working_hours: "09:00 - 17:00",
        bio: "",
        image_url: "",
        address: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("clinics").insert([formData]);
            if (error) throw error;

            alert(t('clinicCreated'));
            router.push("/admin/dashboard");
        } catch (error: any) {
            alert(t('error', { message: error.message }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-2xl">
                <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="bg-primary/5 p-8 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <PlusCircle className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{t('addNewClinic')}</h1>
                        </div>
                        <p className="text-gray-500">Fill in the details to register a new clinic on the platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('clinicName')}</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Care Dental Clinic"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('emailForLogin')}</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="clinic@example.com"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('phone')}</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="+20 123 456 7890"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('area')}</label>
                                    <select
                                        className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                        value={formData.area}
                                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                                    >
                                        {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('specialty')}</label>
                                    <select
                                        className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                        value={formData.specialty}
                                        onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                    >
                                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('workingHours')}</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 09:00 - 17:00"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.working_hours}
                                    onChange={e => setFormData({ ...formData, working_hours: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('bio')}</label>
                                <textarea
                                    placeholder="Tell patients about your clinic..."
                                    rows={4}
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('address')}</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 123 Health St, Maadi"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('imageUrl')}</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link href="/admin/dashboard">
                                <Button type="button" variant="outline" className="px-6">{t('cancel')}</Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="px-8 shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform active:scale-95"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? t('creating') : t('createClinic')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
