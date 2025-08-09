"use client";
import { AboutHero } from "@/components/about/about-hero";
import { AboutFeatures } from "@/components/about/about-features";
import { AboutTeam } from "@/components/about/about-team";
import { AboutCta } from "@/components/about/about-cta";
import { AboutFooter } from "@/components/about/about-footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center min-h-[80vh] py-12 px-4 gap-10">
      <AboutHero />
      <AboutFeatures />
      <AboutTeam />
      <AboutCta />
      <AboutFooter />
    </div>
  );
}
