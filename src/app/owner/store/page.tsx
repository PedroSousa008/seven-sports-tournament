import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { createStoreItemAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

const availabilityLabels: Record<string, string> = {
  available: "Disponível",
  limited: "Limitado",
  "sold-out": "Esgotado",
};

export default async function OwnerStorePage() {
  const [items, partners] = await Promise.all([
    prisma.storeItem.findMany({
      include: { partner: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.partner.findMany({ orderBy: { brandName: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Loja / Compras"
        description="Adiciona produtos, vouchers e artigos promocionais visíveis para as equipas."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar artigo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createStoreItemAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome</Label>
              <Input name="name" required />
            </div>
            <div>
              <Label>Preço (€)</Label>
              <Input name="price" type="number" step="0.01" />
            </div>
            <div>
              <Label>Parceiro / marca</Label>
              <Select name="partnerId" defaultValue="">
                <option value="">Torneio</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.brandName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Disponibilidade</Label>
              <Select name="availability" defaultValue="available">
                <option value="available">{availabilityLabels.available}</option>
                <option value="limited">{availabilityLabels.limited}</option>
                <option value="sold-out">{availabilityLabels["sold-out"]}</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>URL da imagem</Label>
              <Input name="imageUrl" />
            </div>
            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Input name="description" />
            </div>
            <div className="md:col-span-2">
              <Label>URL de contacto / compra</Label>
              <Input name="contactUrl" />
            </div>
            <Button type="submit">Adicionar artigo</Button>
          </form>
        </CardContent>
      </Card>

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
                  Sem imagem
                </div>
              )}
              <p className="text-lg font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
              <p className="mt-3 text-xl font-bold text-red-400">
                {item.price ? formatCurrency(item.price) : "Contactar"}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                {item.partner?.brandName ?? "Torneio"} ·{" "}
                {availabilityLabels[item.availability] ?? item.availability}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
