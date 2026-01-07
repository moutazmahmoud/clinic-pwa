"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { PatientRegisterForm } from "@/components/auth/PatientRegisterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const t = useTranslations('Auth');
    const [userType, setUserType] = useState<"patient" | "clinic">("patient");

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/50 blur-[100px] -z-10" />

            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-primary"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
                        {t('registerTitle')}
                    </h2>

                    {/* Toggle Switch */}
                    <div className="mt-8 grid w-full grid-cols-2 rounded-lg bg-gray-200 p-1">
                        <button
                            onClick={() => setUserType("patient")}
                            className={cn(
                                "flex items-center justify-center rounded-md py-2 text-sm font-medium transition-all",
                                userType === "patient" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Patient
                        </button>
                        <button
                            onClick={() => setUserType("clinic")}
                            className={cn(
                                "flex items-center justify-center rounded-md py-2 text-sm font-medium transition-all",
                                userType === "clinic" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Clinic
                        </button>
                    </div>
                </div>

                {userType === "patient" ? <PatientRegisterForm /> : <RegisterForm />}

                <p className="text-center text-sm text-gray-500">
                    {t('alreadyHaveAccount')} <Link href="/login" className="text-primary font-semibold hover:underline">{t('signIn')}</Link>
                </p>
            </div>
        </main>
    );
}
