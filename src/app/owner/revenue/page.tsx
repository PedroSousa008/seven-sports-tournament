import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { createRevenueAction } from "@/lib/actions";
import { REVENUE_CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { label, paymentStatusLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OwnerRevenuePage() {
  const [revenues, teams, partners] = await Promise.all([
    prisma.revenue.findMany({
      include: { team: true, partner: true },
      orderBy: { date: "desc" },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.partner.findMany({ orderBy: { brandName: "asc" } }),
  ]);

  const total = revenues.reduce((sum, row) => sum + row.amount, 0);
  const paid = revenues
    .filter((row) => row.paymentStatus === "PAID")
    .reduce((sum, row) => sum + row.amount, 0);
  const pending = total - paid;

  return (
    <div>
      <PageHeader
        title="Receitas"
        description="Acompanha inscrições, patrocínios, merchandising e outras receitas."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Receita total" value={formatCurrency(total)} icon="wallet" accent="green" />
        <StatCard label="Receita paga" value={formatCurrency(paid)} icon="trending-up" />
        <StatCard label="Receita pendente" value={formatCurrency(pending)} icon="wallet" accent="white" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar receita</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRevenueAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Categoria</Label>
              <Select name="category" required>
                {REVENUE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Valor (€)</Label>
              <Input name="amount" type="number" step="0.01" required />
            </div>
            <div>
              <Label>Data</Label>
              <Input name="date" type="date" required />
            </div>
            <div>
              <Label>Estado de pagamento</Label>
              <Select name="paymentStatus" defaultValue="UNPAID">
                <option value="UNPAID">{paymentStatusLabels.UNPAID}</option>
                <option value="PARTIAL">{paymentStatusLabels.PARTIAL}</option>
                <option value="PAID">{paymentStatusLabels.PAID}</option>
              </Select>
            </div>
            <div>
              <Label>Equipa relacionada</Label>
              <Select name="teamId" defaultValue="">
                <option value="">Nenhuma</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Parceiro relacionado</Label>
              <Select name="partnerId" defaultValue="">
                <option value="">Nenhum</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.brandName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Notas</Label>
              <Input name="notes" />
            </div>
            <Button type="submit">Adicionar receita</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {revenues.map((row) => (
          <Card key={row.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-white">{row.category}</p>
                <p className="text-sm text-zinc-400">
                  {formatDate(row.date)}
                  {row.team ? ` · ${row.team.name}` : ""}
                  {row.partner ? ` · ${row.partner.brandName}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={row.paymentStatus === "PAID" ? "success" : "warning"}
                >
                  {label(paymentStatusLabels, row.paymentStatus)}
                </Badge>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCurrency(row.amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
