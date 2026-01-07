"use client";

import { useTranslations } from 'next-intl';

export function StatsSection() {
    const t = useTranslations('Stats');

    const stats = [
        { label: t('clinics'), value: '500+', color: 'text-blue-600' },
        { label: t('patients'), value: '10k+', color: 'text-indigo-600' },
        { label: t('bookings'), value: '25k+', color: 'text-purple-600' },
        { label: t('rating'), value: '4.9/5', color: 'text-amber-500' },
    ];

    return (
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2 group">
                            <div className={`text-4xl md:text-5xl font-black tracking-tighter ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-sm md:text-base font-medium uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
