import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { createRevenueAction } from "@/lib/actions";
import { REVENUE_CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, Wallet } from "lucide-react";

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
        title="Revenue"
        description="Track registrations, sponsorships, merchandise and other income."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total revenue" value={formatCurrency(total)} icon={Wallet} accent="green" />
        <StatCard label="Paid revenue" value={formatCurrency(paid)} icon={TrendingUp} />
        <StatCard label="Pending revenue" value={formatCurrency(pending)} icon={Wallet} accent="white" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add revenue entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRevenueAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Category</Label>
              <Select name="category" required>
                {REVENUE_CATEGORIES.map((category) => (
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
              <Label>Payment status</Label>
              <Select name="paymentStatus" defaultValue="UNPAID">
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partially paid</option>
                <option value="PAID">Paid</option>
              </Select>
            </div>
            <div>
              <Label>Related team</Label>
              <Select name="teamId" defaultValue="">
                <option value="">None</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Related partner</Label>
              <Select name="partnerId" defaultValue="">
                <option value="">None</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.brandName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input name="notes" />
            </div>
            <Button type="submit">Add revenue</Button>
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
                  {row.paymentStatus}
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
