import { CtaSection } from "@/components/home/cta-section";
import { GallerySection } from "@/components/home/gallery-section";
import { HeroSection } from "@/components/home/hero-section";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeNav } from "@/components/home/home-nav";
import { JourneySection } from "@/components/home/journey-section";
import { LeaderboardSection } from "@/components/home/leaderboard-section";
import { SponsorsSection } from "@/components/home/sponsors-section";
import { SportsSection } from "@/components/home/sports-section";
import { StatsSection } from "@/components/home/stats-section";
import { TrophiesSection } from "@/components/home/trophies-section";
import { getHomePartners } from "@/lib/partners-content";
import { getOverallRanking } from "@/lib/rankings";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const [ranking, dbPartners] = await Promise.all([
    getOverallRanking(),
    prisma.partner.findMany({
      where: { status: { in: ["CONFIRMED", "PAID", "COMPLETED"] } },
      orderBy: { brandName: "asc" },
    }),
  ]);

  const staticPartners = getHomePartners();
  const staticNames = new Set(staticPartners.map((partner) => partner.brandName));

  const partners = [
    ...staticPartners,
    ...dbPartners
      .filter(
        (partner) =>
          partner.logoUrl && !staticNames.has(partner.brandName)
      )
      .map((partner) => ({
        id: partner.id,
        brandName: partner.brandName,
        logoUrl: partner.logoUrl,
        partnershipType: partner.partnershipType,
        websiteUrl: partner.websiteUrl,
        logoFit: "fit" as const,
      })),
  ];

  return (
    <div className="bg-black text-white">
      <HomeNav />
      <HeroSection />
      <StatsSection />
      <SportsSection />
      <JourneySection />
      <LeaderboardSection ranking={ranking} />
      <TrophiesSection />
      <SponsorsSection partners={partners} />
      <GallerySection />
      <CtaSection />
      <HomeFooter />
    </div>
  );
}
