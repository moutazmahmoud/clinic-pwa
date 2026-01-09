"use client";

import { Appointment } from "@/types";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";

interface AppointmentCardProps {
    appointment: Appointment;
    onStatusChange: (id: string, newStatus: Appointment["status"]) => void;
}

export function AppointmentCard({ appointment, onStatusChange }: AppointmentCardProps) {
    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        completed: "bg-gray-100 text-gray-800",
        "no-show": "bg-red-100 text-red-800",
        cancelled: "bg-gray-100 text-gray-800",
    };

    return (
        <div className="flex flex-col rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{appointment.patient_name}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[appointment.status]}`}>
                        {appointment.status}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">{appointment.patient_phone}</p>
                <p className="text-sm font-medium">
                    {appointment.date} at {appointment.time}
                </p>
            </div>

            <div className="mt-4 flex space-x-2 sm:mt-0">
                {appointment.status === "pending" && (
                    <>
                        <Button size="sm" onClick={() => onStatusChange(appointment.id, "confirmed")}>
                            Confirm
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onStatusChange(appointment.id, "no-show")}>
                            Reject
                        </Button>
                    </>
                )}
                {appointment.status === "confirmed" && (
                    <Button size="sm" onClick={() => onStatusChange(appointment.id, "completed")}>
                        Complete
                    </Button>
                )}
            </div>
        </div>
    );
}
