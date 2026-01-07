"use client";

import { Star, Quote } from "lucide-react";
import { useTranslations } from 'next-intl';

export function TestimonialsSection() {
    const t = useTranslations('Testimonials');

    const testimonials = [
        {
            text: t('items.user1'),
            author: "Ahmed S.",
            role: "Patient",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
        },
        {
            text: t('items.user2'),
            author: "Sarah M.",
            role: "Patient",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        {
            text: t('items.user3'),
            author: "Khaled R.",
            role: "Patient",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled",
        },
    ];

    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="container px-4 mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl italic">
                        "{t('title')}"
                    </h2>
                    <p className="text-xl text-gray-500">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center space-y-6 group hover:border-indigo-200 transition-colors">
                            <div className="relative">
                                <img
                                    src={item.image}
                                    alt={item.author}
                                    className="w-20 h-20 rounded-full border-4 border-indigo-50 group-hover:border-indigo-100 transition-colors"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                </div>
                            </div>

                            <div className="relative">
                                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-indigo-50" />
                                <p className="text-gray-700 leading-relaxed font-medium relative z-10">
                                    {item.text}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900">{item.author}</h4>
                                <p className="text-sm text-gray-500">{item.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
