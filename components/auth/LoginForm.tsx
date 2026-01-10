"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { useTranslations } from 'next-intl';

export function LoginForm() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Get user role from metadata
            const { getUserRole, getDashboardPath } = await import("@/lib/auth");
            const role = await getUserRole();

            if (!role) {
                await supabase.auth.signOut();
                setError("Account type not recognized. Please register.");
                return;
            }

            // Redirect to appropriate dashboard
            router.push(getDashboardPath(role));

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-center">{t('loginTitle')}</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('email')}</label>
                    <input
                        type="email"
                        required
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('password')}</label>
                    <input
                        type="password"
                        required
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('loading') : t('signIn')}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    {t('dontHaveAccount')} <Link href="/register" className="text-primary font-semibold hover:underline">{t('register')}</Link>
                </p>
            </form>
        </div>
    );
}
