"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';

export function FAQSection() {
    const t = useTranslations('FAQ');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        { q: t('questions.q1'), a: t('questions.a1') },
        { q: t('questions.q2'), a: t('questions.a2') },
        { q: t('questions.q3'), a: t('questions.a3') },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container px-4 mx-auto max-w-3xl">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {t('title')}
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-200"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-6 flex items-center justify-between text-left group"
                            >
                                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                                    {faq.q}
                                </span>
                                <div className={`p-1 rounded-full transition-colors ${openIndex === index ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-gray-500'}`}>
                                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </button>
                            <div
                                className={`px-6 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                            >
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
