"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { AREAS, SPECIALTIES } from "@/constants";
import { Button } from "@/components/ui/Button";

export function SearchFilters({ className }: { className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const [area, setArea] = useState("");
    const [specialty, setSpecialty] = useState("");

    const handleSearch = () => {
        if (area && specialty) {
            const path = pathname.startsWith('/patient/dashboard')
                ? '/patient/dashboard/clinics'
                : '/clinics';
            router.push(`${path}?area=${encodeURIComponent(area)}&specialty=${encodeURIComponent(specialty)}`);
        }
    };

    return (
        <div className={`w-full max-w-4xl rounded-xl border bg-white/95 backdrop-blur-sm p-4 shadow-xl ring-1 ring-black/5 md:p-6 ${className}`}>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-2">
                    <label htmlFor="area" className="text-sm font-semibold text-gray-700">
                        Location
                    </label>
                    <div className="relative">
                        <select
                            id="area"
                            className="h-12 w-full appearance-none rounded-lg bg-gray-50 px-4 py-2 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-transparent hover:bg-gray-100"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        >
                            <option value="">Select Area</option>
                            {AREAS.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="specialty" className="text-sm font-semibold text-gray-700">
                        Specialty
                    </label>
                    <div className="relative">
                        <select
                            id="specialty"
                            className="h-12 w-full appearance-none rounded-lg bg-gray-50 px-4 py-2 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-transparent hover:bg-gray-100"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                        >
                            <option value="">Select Specialty</option>
                            {SPECIALTIES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-end">
                    <Button
                        className="h-12 w-full bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                        onClick={handleSearch}
                        disabled={!area || !specialty}
                    >
                        Find Clinics
                    </Button>
                </div>
            </div>
        </div>
    );
}
