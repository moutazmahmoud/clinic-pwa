"use client";

import { Shield, Clock, Smartphone, UserCheck } from "lucide-react";
import { useTranslations } from 'next-intl';

export function FeaturesSection() {
    const t = useTranslations('Features');

    const features = [
        {
            icon: <UserCheck className="h-6 w-6" />,
            title: t('items.noAccount.title'),
            description: t('items.noAccount.description'),
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: t('items.verified.title'),
            description: t('items.verified.description'),
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: t('items.realtime.title'),
            description: t('items.realtime.description'),
        },
        {
            icon: <Smartphone className="h-6 w-6" />,
            title: t('items.whatsapp.title'),
            description: t('items.whatsapp.description'),
        },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/50 skew-y-3 transform -z-10 origin-top-left scale-110"></div>
            <div className="container px-4 mx-auto relative">
                <div className="mb-16 md:text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide uppercase mb-2 animate-fade-in-up">
                        {t('badge')}
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-gray-500">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <div className="transform scale-150 rotate-12 text-indigo-900">{feature.icon}</div>
                            </div>

                            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 shadow-inner group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
