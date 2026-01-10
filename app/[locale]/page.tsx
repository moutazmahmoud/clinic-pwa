import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { BottomCTA } from "@/components/landing/BottomCTA";
import { Navbar } from "@/components/layout/Navbar";
import { HomeRedirect } from "@/components/layout/HomeRedirect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeRedirect />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <BottomCTA />

      <footer className="border-t bg-white py-12">
        <div className="container px-4 mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Local Clinic Booking. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
