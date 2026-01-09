"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Clinic } from "@/types";
import { BookingForm } from "@/components/patient/BookingForm";
import { useTranslations } from "next-intl";
import { MapPin, Stethoscope, Clock, Phone, Globe, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function ClinicDetailPage() {
    const params = useParams();
    const clinicId = params.clinicId as string;
    const t = useTranslations("Clinics");
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinic = async () => {
            const { data, error } = await supabase
                .from("clinics")
                .select("*")
                .eq("id", clinicId)
                .single();

            if (data) {
                setClinic(data);
            }
            setLoading(false);
        };

        fetchClinic();
    }, [clinicId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!clinic) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Clinic not found</h1>
                <p className="text-gray-500 mt-2">The clinic you are looking for does not exist or has been removed.</p>
                <Link href="/clinics" className="mt-6">
                    <Button variant="outline">Back to Search</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Nav */}
            <div className="sticky top-0 z-30 bg-white/80 border-b border-gray-100 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
                    <Link href="/clinics">
                        <Button variant="ghost" className="rounded-xl text-gray-500 hover:bg-gray-50 group">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            {clinic.specialty}
                        </span>
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gray-100 shadow-xl shadow-gray-200 sm:h-[400px]">
                            {clinic.image_url ? (
                                <img
                                    src={clinic.image_url}
                                    alt={clinic.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/5">
                                    <Stethoscope className="h-24 w-24 text-primary opacity-10" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                <h1 className="text-3xl font-black text-white sm:text-5xl">{clinic.name}</h1>
                                <p className="mt-2 flex items-center gap-2 text-white/80 font-medium">
                                    <MapPin className="h-4 w-4" />
                                    {clinic.area}
                                </p>
                            </div>
                        </div>

                        {/* Details Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
                                <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Specialty</h4>
                                <p className="mt-1 text-lg font-black text-gray-900">{clinic.specialty}</p>
                            </div>
                            <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
                                <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Working Hours</h4>
                                <p className="mt-1 text-lg font-black text-gray-900">{clinic.working_hours}</p>
                            </div>
                            <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
                                <div className="h-10 w-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Verified</h4>
                                <p className="mt-1 text-lg font-black text-gray-900">ClinicBook Trusted</p>
                            </div>
                        </div>

                        {/* About Section */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-gray-900">{t('about')}</h2>
                            <div className="rounded-3xl bg-white p-8 border border-gray-100 shadow-sm leading-relaxed text-gray-600">
                                {clinic.bio || "No description provided by this clinic yet. This clinic provides high-quality healthcare services in their specialized field."}
                            </div>
                        </section>

                        {/* Location Section */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-gray-900">{t('location')}</h2>
                            <div className="rounded-3xl bg-white p-8 border border-gray-100 shadow-sm space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{clinic.area}</p>
                                        <p className="text-gray-500">{clinic.address || "Street address not provided."}</p>
                                    </div>
                                </div>
                                <div className="h-48 w-full rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                    Map View (Coming Soon)
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Booking Form */}
                    <div className="space-y-8">
                        <div className="sticky top-24">
                            <BookingForm clinic={clinic} />

                            {/* Contact Card */}
                            <div className="mt-8 rounded-3xl bg-gray-900 p-8 text-white shadow-xl shadow-gray-200">
                                <h3 className="text-xl font-black">{t('contactInfo')}</h3>
                                <div className="mt-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/40 uppercase">Phone Number</p>
                                            <p className="font-bold">{clinic.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/40 uppercase">Email Address</p>
                                            <p className="font-bold">{clinic.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
