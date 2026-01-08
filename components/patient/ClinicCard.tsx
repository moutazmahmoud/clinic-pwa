import { Link } from "@/i18n/navigation";
import { Clinic } from "@/types";
import { Button } from "@/components/ui/Button";

interface ClinicCardProps {
    clinic: Clinic;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
    return (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold leading-none tracking-tight">{clinic.name}</h3>
                    <p className="text-sm text-muted-foreground">{clinic.specialty}</p>
                </div>
                <div className="text-sm text-muted-foreground sm:text-right">
                    <p>{clinic.area}</p>
                    <p>{clinic.working_hours}</p>
                </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {/* Placeholder for future details button */}
            </div>

            <div className="mt-4">
                <Link href={`/book/${clinic.id}`} className="w-full">
                    <Button className="w-full">
                        Book Appointment
                    </Button>
                </Link>
            </div>
        </div>
    );
}
