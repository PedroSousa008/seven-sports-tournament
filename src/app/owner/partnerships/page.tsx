import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createPartnerAction, createPromotionAction } from "@/lib/actions";
import { PARTNERSHIP_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import {
  label,
  partnershipStatusLabels,
  partnershipTypeLabels,
} from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";

export default async function OwnerPartnershipsPage() {
  const partners = await prisma.partner.findMany({
    include: { promotions: true },
    orderBy: { brandName: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Parcerias"
        description="Gira patrocinadores, parceiros, promoções e valor das colaborações."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar parceiro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPartnerAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome da marca</Label>
              <Input name="brandName" required />
            </div>
            <div>
              <Label>Categoria</Label>
              <Input name="category" />
            </div>
            <div>
              <Label>Pessoa de contacto</Label>
              <Input name="contactPerson" />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input name="phone" />
            </div>
            <div>
              <Label>Tipo de parceria</Label>
              <Select name="partnershipType" defaultValue="OFFICIAL_PARTNER">
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Valor (€)</Label>
              <Input name="value" type="number" />
            </div>
            <div>
              <Label>Estado</Label>
              <Select name="status" defaultValue="PENDING">
                <option value="PENDING">{partnershipStatusLabels.PENDING}</option>
                <option value="CONFIRMED">{partnershipStatusLabels.CONFIRMED}</option>
                <option value="PAID">{partnershipStatusLabels.PAID}</option>
                <option value="COMPLETED">{partnershipStatusLabels.COMPLETED}</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>URL do website</Label>
              <Input name="websiteUrl" />
            </div>
            <div className="md:col-span-2">
              <Label>Benefícios prometidos</Label>
              <Textarea name="benefits" />
            </div>
            <div className="md:col-span-2">
              <Label>Notas</Label>
              <Textarea name="notes" />
            </div>
            <Button type="submit">Adicionar parceiro</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {partner.brandName}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {partner.contactPerson ?? "Sem contacto"} ·{" "}
                    {partner.email ?? "Sem email"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>
                      {label(partnershipTypeLabels, partner.partnershipType)}
                    </Badge>
                    <Badge variant="warning">
                      {label(partnershipStatusLabels, partner.status)}
                    </Badge>
                    {partner.value ? (
                      <Badge variant="success">
                        {formatCurrency(partner.value)}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <form
                action={createPromotionAction.bind(null, partner.id)}
                className="mt-4 grid gap-3 md:grid-cols-4"
              >
                <Input name="title" placeholder="Título da promoção" required />
                <Input name="code" placeholder="Código de desconto" />
                <Input name="url" placeholder="URL da promoção" />
                <Button type="submit">Adicionar promoção</Button>
              </form>

              {partner.promotions.length ? (
                <div className="mt-4 space-y-2">
                  {partner.promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="rounded-xl border border-white/10 p-3 text-sm"
                    >
                      <p className="font-medium text-white">{promo.title}</p>
                      {promo.code ? (
                        <p className="text-red-400">Código: {promo.code}</p>
                      ) : null}
                      {promo.url ? (
                        <a
                          href={promo.url}
                          className="text-zinc-400 hover:text-white"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {promo.url}
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
