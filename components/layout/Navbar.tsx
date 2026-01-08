"use client";

import { Link, usePathname, useRouter } from "../../i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useTranslations } from 'next-intl';

export function Navbar() {
    const t = useTranslations('Navbar');
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: 'en' | 'ar') => {
        router.replace(pathname, { locale: newLocale });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);

        // Check initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (_event === 'SIGNED_OUT') {
                setUser(null);
                router.push('/');
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "glass shadow-sm py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Clinic<span className="text-primary">Book</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {/* Language Switcher */}
                    <div className="flex gap-2">
                        <button onClick={() => switchLocale('en')} className={`text-xs font-bold hover:text-primary ${pathname.startsWith('/en') ? 'text-primary' : 'text-gray-500'}`}>EN</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => switchLocale('ar')} className={`text-xs font-bold hover:text-primary ${pathname.startsWith('/ar') ? 'text-primary' : 'text-gray-500'}`}>AR</button>
                    </div>

                    <Link href="/clinics" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('findDoctors')}
                    </Link>
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('howItWorks')}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600">
                                {user.email}
                            </span>
                            <Button variant="outline" onClick={handleSignOut} className="hover:bg-red-50 hover:text-red-600 border-red-100">
                                {t('signOut')}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-primary/5">
                                    {t('login')}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
                                    {t('createAccount')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    <Link href="/clinics">
                        <Button className="font-semibold shadow-lg shadow-primary/20">
                            {t('bookNow')}
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Button Placeholder */}
                <div className="md:hidden">
                    {user ? (
                        <Button size="sm" variant="outline" onClick={handleSignOut}>{t('signOut')}</Button>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" variant="outline">{t('login')}</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

