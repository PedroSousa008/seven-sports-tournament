import { PageHeader } from "@/components/layout/page-header";
import { RankingTable } from "@/components/ranking-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getOwnerDashboardStats } from "@/lib/tournament";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export default async function OwnerHomePage() {
  const stats = await getOwnerDashboardStats();

  return (
    <div>
      <PageHeader
        title={stats.settings?.name ?? "Tournament Overview"}
        description={`${stats.settings?.location ?? "Braga"} · ${stats.settings ? formatDate(stats.settings.startDate) : ""} – ${stats.settings ? formatDate(stats.settings.endDate) : ""}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Teams registered" value={stats.teamsCount} icon={Users} />
        <StatCard label="Players registered" value={stats.playersCount} icon={Users} accent="white" />
        <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} accent="green" />
        <StatCard label="Estimated profit" value={formatCurrency(stats.estimatedProfit)} icon={TrendingUp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current overall ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <RankingTable entries={stats.ranking} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Revenue paid</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(stats.paidRevenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total costs</span>
                <span className="font-semibold text-white">
                  {formatCurrency(stats.totalCosts)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Costs paid</span>
                <span className="font-semibold text-zinc-300">
                  {formatCurrency(stats.paidCosts)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Pending actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.pendingActions.length ? (
                stats.pendingActions.map((item) => (
                  <p key={item} className="text-sm text-zinc-300">
                    • {item}
                  </p>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No pending actions.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              Next event
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.nextEvent ? (
              <div>
                <p className="text-lg font-semibold text-white">
                  {stats.nextEvent.title}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {formatDate(stats.nextEvent.date)}
                  {stats.nextEvent.time ? ` · ${stats.nextEvent.time}` : ""}
                </p>
                {stats.nextEvent.sport ? (
                  <Badge className="mt-3">{stats.nextEvent.sport.name}</Badge>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No upcoming events scheduled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.upcomingMatches.length ? (
              stats.upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-xl border border-white/10 p-3"
                >
                  <p className="font-medium text-white">{match.title}</p>
                  <p className="text-sm text-zinc-400">
                    {match.sport.name}
                    {match.scheduledAt
                      ? ` · ${formatDateTime(match.scheduledAt)}`
                      : ""}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No matches scheduled yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
