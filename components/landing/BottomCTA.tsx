"use client";

import { ArrowRight } from "lucide-react";
import { Link } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';

export function BottomCTA() {
    const t = useTranslations('BottomCTA');

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Vibrant Gradient Background */}
            <div className="absolute inset-0 bg-indigo-600">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-600/50 to-transparent"></div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="container px-4 mx-auto relative z-10 text-center">
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-indigo-100 font-medium">
                        {t('subtitle')}
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-black shadow-2xl hover:bg-indigo-50 hover:scale-105 transition-all duration-300 group"
                        >
                            {t('button')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
