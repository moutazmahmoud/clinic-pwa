"use client";

import { Appointment, Clinic } from "@/types";
import { useTranslations } from "next-intl";
import { Calendar, Clock, MapPin, Phone, ExternalLink } from "lucide-react";

interface PatientAppointmentCardProps {
    appointment: Appointment & { clinics?: Clinic };
    onCancel?: (id: string) => void;
}

export function PatientAppointmentCard({ appointment, onCancel }: PatientAppointmentCardProps) {
    const t = useTranslations("Patient");

    const statusColors = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        completed: "bg-slate-100 text-slate-700 border-slate-200",
        "no-show": "bg-rose-100 text-rose-700 border-rose-200",
        cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const clinic = appointment.clinics;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{clinic?.name || t('clinic')}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[appointment.status]}`}>
                            {t(appointment.status === 'no-show' ? 'noShow' : appointment.status)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">{appointment.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{clinic?.area || "..."}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{clinic?.phone || "..."}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-400 mb-1">{t('bookingId')}</p>
                        <p className="text-sm font-mono text-gray-600">#{appointment.id.slice(0, 8)}</p>
                    </div>
                    {appointment.status === "pending" && (
                        <>
                            <button
                                onClick={() => onCancel?.(appointment.id)}
                                className="px-4 py-2 border border-rose-100 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-50 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <a
                                href={`https://wa.me/${clinic?.phone?.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                            >
                                <Phone className="h-4 w-4 fill-white" />
                                {t('whatsapp')}
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
