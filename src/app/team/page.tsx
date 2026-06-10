import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireSession } from "@/lib/session";
import { getTeamDashboardStats } from "@/lib/tournament";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Calendar, Megaphone, Trophy, Users } from "lucide-react";

export default async function TeamHomePage() {
  const session = await requireSession("TEAM");
  const stats = await getTeamDashboardStats(session.user.teamId!);

  return (
    <div>
      <PageHeader
        title={stats.team?.name ?? "Team Home"}
        description="Your tournament overview, next events and latest updates."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Overall position"
          value={stats.position ? `#${stats.position}` : "—"}
          icon={Trophy}
        />
        <StatCard
          label="Total points"
          value={stats.totalPoints}
          icon={Trophy}
          accent="green"
        />
        <StatCard
          label="Players"
          value={stats.team?.players.length ?? 0}
          icon={Users}
          accent="white"
        />
        <StatCard
          label="Announcements"
          value={stats.announcements.length}
          icon={Megaphone}
        />
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
              <p className="text-sm text-zinc-500">No upcoming events.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {[
              ["/team/my-team", "Manage squad"],
              ["/team/calendar", "View calendar"],
              ["/team/rankings", "Check rankings"],
              ["/team/store", "Browse store"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:border-red-500/40 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
              <p className="text-sm text-zinc-500">No matches scheduled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.announcements.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 p-3"
              >
                <p className="font-medium text-white">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                  {item.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
