import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createPartnerAction, createPromotionAction } from "@/lib/actions";
import { PARTNERSHIP_TYPES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function OwnerPartnershipsPage() {
  const partners = await prisma.partner.findMany({
    include: { promotions: true },
    orderBy: { brandName: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Partnerships"
        description="Manage sponsors, partners, promotions and collaboration value."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPartnerAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Brand name</Label>
              <Input name="brandName" required />
            </div>
            <div>
              <Label>Category</Label>
              <Input name="category" />
            </div>
            <div>
              <Label>Contact person</Label>
              <Input name="contactPerson" />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" />
            </div>
            <div>
              <Label>Partnership type</Label>
              <Select name="partnershipType" defaultValue="OFFICIAL_PARTNER">
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Value (€)</Label>
              <Input name="value" type="number" />
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" defaultValue="PENDING">
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Website URL</Label>
              <Input name="websiteUrl" />
            </div>
            <div className="md:col-span-2">
              <Label>Benefits promised</Label>
              <Textarea name="benefits" />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea name="notes" />
            </div>
            <Button type="submit">Add partner</Button>
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
                    {partner.contactPerson ?? "No contact"} ·{" "}
                    {partner.email ?? "No email"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>{partner.partnershipType.replaceAll("_", " ")}</Badge>
                    <Badge variant="warning">{partner.status}</Badge>
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
                <Input name="title" placeholder="Promotion title" required />
                <Input name="code" placeholder="Discount code" />
                <Input name="url" placeholder="Promotion URL" />
                <Button type="submit">Add promotion</Button>
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
                        <p className="text-red-400">Code: {promo.code}</p>
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
