import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { label, partnershipTypeLabels } from "@/lib/labels";

export default async function TeamPartnersPage() {
  const partners = await prisma.partner.findMany({
    where: { status: { in: ["CONFIRMED", "PAID", "COMPLETED"] } },
    include: { promotions: { where: { active: true } } },
    orderBy: { brandName: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Parceiros e Promoções"
        description="Ofertas de patrocinadores, códigos de desconto e promoções de parceiros."
      />

      <div className="space-y-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-white">
                  {partner.brandName}
                </p>
                <Badge>
                  {label(partnershipTypeLabels, partner.partnershipType)}
                </Badge>
              </div>
              {partner.benefits ? (
                <p className="mt-2 text-sm text-zinc-400">{partner.benefits}</p>
              ) : null}
              {partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-red-400 hover:text-red-300"
                >
                  Visitar website do parceiro
                </a>
              ) : null}
              <div className="mt-4 space-y-2">
                {partner.promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="rounded-xl border border-white/10 p-3"
                  >
                    <p className="font-medium text-white">{promo.title}</p>
                    {promo.description ? (
                      <p className="text-sm text-zinc-400">{promo.description}</p>
                    ) : null}
                    {promo.code ? (
                      <p className="mt-1 text-red-400">Código: {promo.code}</p>
                    ) : null}
                    {promo.url ? (
                      <a
                        href={promo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-zinc-400 hover:text-white"
                      >
                        Ver oferta
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
