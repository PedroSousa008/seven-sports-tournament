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
import { Receipt, TrendingUp } from "lucide-react";

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
        title="Costs"
        description="Track tournament expenses and estimated profit."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total costs" value={formatCurrency(totalCosts)} icon={Receipt} />
        <StatCard label="Paid costs" value={formatCurrency(paidCosts)} icon={Receipt} accent="white" />
        <StatCard
          label="Estimated profit"
          value={formatCurrency(totalRevenue - totalCosts)}
          icon={TrendingUp}
          accent="green"
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add cost</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCostAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Category</Label>
              <Select name="category" required>
                {COST_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Amount (€)</Label>
              <Input name="amount" type="number" step="0.01" required />
            </div>
            <div>
              <Label>Date</Label>
              <Input name="date" type="date" required />
            </div>
            <div>
              <Label>Supplier</Label>
              <Input name="supplier" />
            </div>
            <div>
              <Label>Receipt URL</Label>
              <Input name="receiptUrl" />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name="paid" />
              Paid
            </label>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input name="notes" />
            </div>
            <Button type="submit">Add cost</Button>
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
                  {row.paid ? "Paid" : "Unpaid"}
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
