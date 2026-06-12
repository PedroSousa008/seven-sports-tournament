import { PartnersMarketplace } from "@/components/team/partners-marketplace";
import { getTeamPartnersData } from "@/lib/team-hub";
import { PARTNER_LOGOS } from "@/lib/partners-content";

export default async function TeamPartnersPage() {
  const { partners, storeItems } = await getTeamPartnersData();

  const staticLogos = new Map(
    PARTNER_LOGOS.map((p) => [p.brandName.toLowerCase(), p.logo])
  );

  const promotions = partners.flatMap((partner) =>
    partner.promotions.map((promo) => ({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      code: promo.code,
      url: promo.url,
      partnerName: partner.brandName,
      partnerLogo:
        partner.logoUrl ??
        staticLogos.get(partner.brandName.toLowerCase()) ??
        null,
    }))
  );

  return (
    <PartnersMarketplace
      promotions={promotions}
      storeItems={storeItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        partnerName: item.partner?.brandName ?? null,
        contactUrl: item.contactUrl,
      }))}
    />
  );
}
