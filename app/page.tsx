"use client";
import { CarouselSection } from "@/components/home/carousel-section";
import { FaqsSection } from "@/components/home/faqs-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { PricingSection } from "@/components/home/pricing-section";
import { HeartFilledIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-10 py-10 w-full min-h-[80vh]">
      <HeroSection />
      <CarouselSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqsSection />
      <div className="mt-8 text-xs text-default-500 flex items-center gap-1">
        <HeartFilledIcon className="text-danger" size={16} /> Powered by Lisk
        Blockchain
      </div>
    </section>
  );
}
