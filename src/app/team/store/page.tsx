import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

const availabilityLabels: Record<string, string> = {
  available: "Disponível",
  limited: "Limitado",
  "sold-out": "Esgotado",
};

export default async function TeamStorePage() {
  const items = await prisma.storeItem.findMany({
    where: { active: true },
    include: { partner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Loja"
        description="Produtos do evento, vouchers e ofertas de parceiros disponíveis para as equipas."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-5">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  {item.name}
                </div>
              )}
              <p className="text-lg font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
              <p className="mt-3 text-xl font-bold text-red-400">
                {item.price ? formatCurrency(item.price) : "Contactar para preço"}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                {item.partner?.brandName ?? "Torneio"} ·{" "}
                {availabilityLabels[item.availability] ?? item.availability}
              </p>
              {item.contactUrl ? (
                <a href={item.contactUrl} target="_blank" rel="noreferrer">
                  <Button className="mt-4 w-full" variant="secondary">
                    Reservar / Contactar
                  </Button>
                </a>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
