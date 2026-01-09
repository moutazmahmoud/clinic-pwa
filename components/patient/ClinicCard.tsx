import { Link } from "@/i18n/navigation";
import { Clinic } from "@/types";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { MapPin, Stethoscope, Clock, ChevronRight } from "lucide-react";

interface ClinicCardProps {
    clinic: Clinic;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
    const t = useTranslations("Clinics");

    return (
        <div className="group overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gray-50">
                {clinic.image_url ? (
                    <img
                        src={clinic.image_url}
                        alt={clinic.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                        <Stethoscope className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                        {clinic.specialty}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-xl font-black text-gray-900 line-clamp-1">{clinic.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{clinic.area}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary/60" />
                        <span>{clinic.working_hours}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Link href={`/clinics/${clinic.id}`}>
                        <Button variant="outline" className="w-full rounded-xl border-gray-100 font-bold hover:bg-gray-50 group/btn">
                            {t('viewDetails')}
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                    </Link>
                    <Link href={`/book/${clinic.id}`}>
                        <Button className="w-full rounded-xl bg-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            {t('bookAppointment')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
