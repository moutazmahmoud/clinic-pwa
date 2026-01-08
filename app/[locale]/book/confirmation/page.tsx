"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const link = searchParams.get("link");
    const clinicName = searchParams.get("clinicName");
    const router = useRouter();

    if (!link) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-red-500">Invalid Request</h1>
                    <Link href="/"><Button className="mt-4">Home</Button></Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-4 text-center">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">Booking Pending!</h1>
                <p className="text-gray-600">
                    Your appointment details with <strong>{clinicName}</strong> have been recorded locally.
                </p>
                <p className="text-sm text-gray-500">
                    To confirm your slot, please send the pre-filled WhatsApp message to the clinic.
                </p>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12">
                        Send WhatsApp Message
                    </Button>
                </a>

                <Link href="/" className="block">
                    <Button variant="ghost" className="w-full">Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}
