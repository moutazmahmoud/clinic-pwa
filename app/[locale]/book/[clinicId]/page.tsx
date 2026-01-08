import { supabase } from "@/lib/supabase";
import { BookingForm } from "@/components/patient/BookingForm";
import { Clinic } from "@/types";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default async function BookingPage({
    params,
}: {
    params: { clinicId: string };
}) {
    const { data: clinic, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("id", params.clinicId)
        .single();

    if (error || !clinic) {
        return <div className="p-8 text-center">Clinic not found.</div>;
    }

    return (
        <div className="container mx-auto max-w-md p-4 min-h-screen flex flex-col justify-center">
            <div className="mb-6">
                <Link href="/clinics">
                    <Button variant="ghost" size="sm" className="-ml-4 text-muted-foreground">
                        &larr; Back to Clinics
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold mt-2">Book Appointment</h1>
                <p className="text-muted-foreground">{clinic.name}</p>
                <p className="text-sm text-muted-foreground">{clinic.specialty} • {clinic.area}</p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <BookingForm clinic={clinic as Clinic} />
            </div>
        </div>
    );
}
