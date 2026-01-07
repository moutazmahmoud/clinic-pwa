"use client";

import { MapPin, Calendar, CheckCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

export function HowItWorksSection() {
    const t = useTranslations('HowItWorks');

    const steps = [
        {
            icon: <MapPin className="h-8 w-8 text-blue-600" />,
            title: t('steps.step1.title'),
            description: t('steps.step1.description'),
        },
        {
            icon: <Calendar className="h-8 w-8 text-indigo-600" />,
            title: t('steps.step2.title'),
            description: t('steps.step2.description'),
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-green-600" />,
            title: t('steps.step3.title'),
            description: t('steps.step3.description'),
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {t('title')}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-green-100 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center group">
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white border border-indigo-100 shadow-xl ring-8 ring-indigo-50/50 group-hover:scale-110 transition-transform duration-300">
                                <div className="transform transition-transform text-indigo-600 group-hover:rotate-12">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{step.title}</h3>
                            <p className="max-w-xs text-gray-600 leading-relaxed bg-white/50 backdrop-blur-sm rounded-lg p-2 font-medium">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
