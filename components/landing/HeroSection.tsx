"use client";

import { SearchFilters } from "@/components/patient/SearchFilters";
import { BadgeCheck, ShieldCheck, Zap } from "lucide-react";

import { useTranslations } from 'next-intl';

export function HeroSection() {
    const t = useTranslations('Hero');

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20 pb-16">
            {/* Vibrant Mesh Background */}
            <div className="absolute inset-0 w-full h-full bg-mesh opacity-20 -z-10" />

            {/* Floating Blobs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

            <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">

                <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-500/10 mb-6 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    #1 Health Booking Platform
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-7xl max-w-4xl animate-fade-in-up animation-delay-300">
                    {t('title')}
                </h1>

                <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
                    {t('subtitle')}
                </p>

                <div className="mx-auto max-w-4xl pt-4 animate-fade-in-up animation-delay-300 w-full">
                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                        <SearchFilters className="!bg-white/80 !backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/10 ring-4 ring-white/50" />
                    </div>
                </div>

                <div className="pt-8 flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-semibold text-slate-600 animate-fade-in-up animation-delay-600">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50/50 border border-green-100/50">
                        <div className="bg-green-100 rounded-full p-1"><BadgeCheck className="w-4 h-4 text-green-600" /></div>
                        <span>Verified Clinics</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 border border-blue-100/50">
                        <div className="bg-blue-100 rounded-full p-1"><ShieldCheck className="w-4 h-4 text-blue-600" /></div>
                        <span>Secure Booking</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50/50 border border-amber-100/50">
                        <div className="bg-amber-100 rounded-full p-1"><Zap className="w-4 h-4 text-amber-600" /></div>
                        <span>Instant Confirmation</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
