import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase Environment Variables!");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Defined" : "Missing");
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "Defined" : "Missing");
    throw new Error("Missing Supabase Environment Variables. Check .env.local");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);