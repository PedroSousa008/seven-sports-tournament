import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSportRanking } from "@/lib/rankings";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export default async function TeamSportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireSession("TEAM");
  const teamId = session.user.teamId!;
  const { slug } = await params;

  const sport = await prisma.sport.findUnique({
    where: { slug },
    include: {
      groups: {
        include: { teams: { include: { team: true } } },
        orderBy: { order: "asc" },
      },
      matches: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });
  if (!sport) notFound();

  const [ranking, selections] = await Promise.all([
    getSportRanking(sport.id),
    prisma.playerSportSelection.findMany({
      where: { teamId, sportId: sport.id },
      include: { player: true },
    }),
  ]);

  return (
    <div>
      <PageHeader title={sport.name} description={sport.format ?? ""} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rules & format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>{sport.rules}</p>
            <p>{sport.format}</p>
            {sport.location ? <p>Location: {sport.location}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your selected players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selections.length ? (
              selections.map((item) => (
                <p key={item.id} className="text-white">
                  {item.player.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                No players selected for this sport yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {sport.groups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-white/10 p-4"
            >
              <p className="font-semibold text-white">{group.name}</p>
              <div className="mt-3 space-y-2">
                {group.teams.map((entry) => (
                  <p
                    key={entry.id}
                    className={
                      entry.teamId === teamId
                        ? "font-semibold text-red-400"
                        : "text-zinc-300"
                    }
                  >
                    {entry.team.name}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sport.matches.map((match) => (
              <div
                key={match.id}
                className="rounded-xl border border-white/10 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-white">{match.title}</p>
                  <Badge>{match.status}</Badge>
                </div>
                <p className="text-sm text-zinc-400">
                  {match.homeTeam?.name ?? "TBD"} vs {match.awayTeam?.name ?? "TBD"}
                </p>
                {match.scheduledAt ? (
                  <p className="text-sm text-zinc-500">
                    {formatDateTime(match.scheduledAt)}
                  </p>
                ) : null}
                {match.homeScore || match.awayScore ? (
                  <p className="mt-1 font-semibold text-red-400">
                    {match.homeScore} - {match.awayScore}
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sport ranking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ranking.map((row) => (
              <div
                key={row.teamId}
                className={`flex items-center justify-between rounded-xl border border-white/10 p-3 ${
                  row.teamId === teamId ? "bg-red-500/10" : ""
                }`}
              >
                <span className="text-white">
                  #{row.position} {row.teamName}
                </span>
                <span className="font-semibold text-red-400">
                  {row.points} pts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
