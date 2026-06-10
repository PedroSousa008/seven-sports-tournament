import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { createCostAction } from "@/lib/actions";
import { COST_CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OwnerCostsPage() {
  const [costs, revenues] = await Promise.all([
    prisma.cost.findMany({ orderBy: { date: "desc" } }),
    prisma.revenue.findMany(),
  ]);

  const totalCosts = costs.reduce((sum, row) => sum + row.amount, 0);
  const paidCosts = costs
    .filter((row) => row.paid)
    .reduce((sum, row) => sum + row.amount, 0);
  const totalRevenue = revenues.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div>
      <PageHeader
        title="Custos"
        description="Acompanha despesas do torneio e lucro estimado."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Custos totais" value={formatCurrency(totalCosts)} icon="receipt" />
        <StatCard label="Custos pagos" value={formatCurrency(paidCosts)} icon="receipt" accent="white" />
        <StatCard
          label="Lucro estimado"
          value={formatCurrency(totalRevenue - totalCosts)}
          icon="trending-up"
          accent="green"
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar custo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCostAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Categoria</Label>
              <Select name="category" required>
                {COST_CATEGORIES.map((category) => (
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
              <Label>Fornecedor</Label>
              <Input name="supplier" />
            </div>
            <div>
              <Label>URL do recibo</Label>
              <Input name="receiptUrl" />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name="paid" />
              Pago
            </label>
            <div className="md:col-span-2">
              <Label>Notas</Label>
              <Input name="notes" />
            </div>
            <Button type="submit">Adicionar custo</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {costs.map((row) => (
          <Card key={row.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-white">{row.category}</p>
                <p className="text-sm text-zinc-400">
                  {formatDate(row.date)}
                  {row.supplier ? ` · ${row.supplier}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={row.paid ? "success" : "warning"}>
                  {row.paid ? "Pago" : "Por pagar"}
                </Badge>
                <span className="text-lg font-bold text-white">
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
