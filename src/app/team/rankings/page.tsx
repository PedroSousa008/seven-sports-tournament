import { PageHeader } from "@/components/layout/page-header";
import { RankingTable } from "@/components/ranking-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverallRanking, getSportRanking } from "@/lib/rankings";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export default async function TeamRankingsPage() {
  const session = await requireSession("TEAM");
  const teamId = session.user.teamId!;
  const [ranking, sports] = await Promise.all([
    getOverallRanking(),
    prisma.sport.findMany({ orderBy: { name: "asc" } }),
  ]);

  const myEntry = ranking.find((entry) => entry.teamId === teamId);
  const sportRankings = await Promise.all(
    sports.map(async (sport) => ({
      sport,
      ranking: await getSportRanking(sport.id),
    }))
  );

  return (
    <div>
      <PageHeader
        title="Rankings"
        description="Follow your team's progress across the tournament."
      />

      {myEntry ? (
        <Card className="mb-6 border-red-500/30 bg-red-500/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-zinc-400">Your team</p>
              <p className="text-2xl font-bold text-white">{myEntry.teamName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Position</p>
              <p className="text-3xl font-bold text-red-400">#{myEntry.position}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Total points</p>
              <p className="text-3xl font-bold text-white">{myEntry.totalPoints}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <RankingTable entries={ranking} highlightTeamId={teamId} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sportRankings.map(({ sport, ranking: sportRanking }) => (
          <Card key={sport.id}>
            <CardHeader>
              <CardTitle>{sport.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sportRanking.map((row) => (
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
        ))}
      </div>
    </div>
  );
}
