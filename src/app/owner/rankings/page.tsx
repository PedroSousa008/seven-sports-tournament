import { PageHeader } from "@/components/layout/page-header";
import { RankingTable } from "@/components/ranking-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePointsConfigAction } from "@/lib/actions";
import { getOverallRanking, getSportRanking } from "@/lib/rankings";
import { prisma } from "@/lib/db";

export default async function OwnerRankingsPage() {
  const [ranking, sports, pointsConfig] = await Promise.all([
    getOverallRanking(),
    prisma.sport.findMany({ orderBy: { name: "asc" } }),
    prisma.pointsConfig.findMany({
      where: { sportId: null },
      orderBy: { position: "asc" },
    }),
  ]);

  const sportRankings = await Promise.all(
    sports.map(async (sport) => ({
      sport,
      ranking: await getSportRanking(sport.id),
    }))
  );

  return (
    <div>
      <PageHeader
        title="Results & Rankings"
        description="Global ranking calculated from sport points. Karts results carry extra weight."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <RankingTable entries={ranking} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Points system</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {pointsConfig.map((row) => (
            <form
              key={row.id}
              action={updatePointsConfigAction.bind(null, row.position)}
              className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
            >
              <span className="w-16 text-zinc-400">#{row.position}</span>
              <Input
                name="points"
                type="number"
                defaultValue={row.points}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Save
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {sportRankings.map(({ sport, ranking: sportRanking }) => (
          <Card key={sport.id}>
            <CardHeader>
              <CardTitle>{sport.name} ranking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sportRanking.map((row) => (
                <div
                  key={row.teamId}
                  className="flex items-center justify-between rounded-xl border border-white/10 p-3"
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
