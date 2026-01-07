import { supabase } from "@/lib/supabase";
import { ClinicCard } from "@/components/patient/ClinicCard";
import { SearchFilters } from "@/components/patient/SearchFilters";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Clinic } from "@/types";

// This is a Server Component
export default async function ClinicsPage({
    searchParams,
}: {
    searchParams: { area?: string; specialty?: string };
}) {
    const { area, specialty } = searchParams;

    let query = supabase.from("clinics").select("*").eq("is_active", true);

    if (area) {
        query = query.eq("area", area);
    }
    if (specialty) {
        query = query.eq("specialty", specialty);
    }

    const { data: clinics, error } = await query;

    if (error) {
        console.error("Error fetching clinics:", error);
        return <div>Error loading clinics. Please try again.</div>;
    }

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Available Clinics</h1>
                <Link href="/">
                    <Button variant="outline" size="sm">Back</Button>
                </Link>
            </div>

            <div className="mb-8">
                {/* Re-using SearchFilters here but maybe hiding it if redundant? 
             Actually, keeping it visible allows refining search. 
             Ideally SearchFilters should read from URL too if we want it to be synced.
             For now, let's just show the results.
          */}
                <p className="text-sm text-muted-foreground mb-4">
                    Showing results for:
                    {area ? <span className="font-semibold ml-1">{area}</span> : " All Areas"}
                    {" & "}
                    {specialty ? <span className="font-semibold">{specialty}</span> : "All Specialties"}
                </p>
            </div>

            <div className="space-y-4">
                {clinics && clinics.length > 0 ? (
                    clinics.map((clinic) => (
                        <ClinicCard key={clinic.id} clinic={clinic as Clinic} />
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No clinics found matching your criteria.</p>
                        <Link href="/" className="mt-4 inline-block">
                            <Button variant="outline">Clear Filters</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
