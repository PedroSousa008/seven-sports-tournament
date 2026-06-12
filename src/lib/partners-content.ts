import { SPONSOR_CATEGORIES } from "./home-content";

export type PartnerLogo = {
  slug: string;
  brandName: string;
  logo: string;
  partnershipType: (typeof SPONSOR_CATEGORIES)[number]["type"];
  websiteUrl?: string;
  /** "fill" = imagem preenche o cartão inteiro; "fit" = logo centrado com margem */
  logoFit?: "fill" | "fit";
};

/**
 * Logos dos parceiros na homepage.
 * 1. Coloca a imagem em public/partners/{pasta}/{slug}.png
 * 2. Adiciona uma entrada abaixo com o caminho /partners/...
 */
export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    slug: "7wonders",
    brandName: "7 Wonders",
    logo: "/partners/official-partners/7wonders.png",
    partnershipType: "OFFICIAL_PARTNER",
    logoFit: "fill",
  },
  {
    slug: "kib",
    brandName: "KIB",
    logo: "/partners/official-partners/kib.png",
    partnershipType: "OFFICIAL_PARTNER",
    logoFit: "fit",
  },
];

export function getHomePartners() {
  return PARTNER_LOGOS.map((partner) => ({
    id: partner.slug,
    brandName: partner.brandName,
    logoUrl: partner.logo,
    partnershipType: partner.partnershipType,
    websiteUrl: partner.websiteUrl ?? null,
    logoFit: partner.logoFit ?? "fit",
  }));
}

/** Pastas em public/partners/ por tipo de parceria */
export const PARTNER_FOLDERS = {
  MAIN_SPONSOR: "main-sponsor",
  OFFICIAL_PARTNER: "official-partners",
  EQUIPMENT: "equipment",
  HEALTH_PHYSIO: "health",
  FOOD_BEVERAGE: "food-beverage",
} as const;
