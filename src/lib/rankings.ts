import { prisma } from "@/lib/db";

export type RankingEntry = {
  teamId: string;
  teamName: string;
  teamColor: string;
  logoUrl: string | null;
  totalPoints: number;
  position: number;
  sportBreakdown: { sportId: string; sportName: string; sportSlug: string; points: number }[];
};

export async function getOverallRanking(): Promise<RankingEntry[]> {
  const [teams, sportPoints, sports] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.teamSportPoints.findMany({ include: { sport: true } }),
    prisma.sport.findMany(),
  ]);

  const kartMultiplier = 1.5;

  const entries = teams.map((team) => {
    const breakdown = sports.map((sport) => {
      const row = sportPoints.find(
        (p) => p.teamId === team.id && p.sportId === sport.id
      );
      let points = row?.points ?? 0;
      if (sport.slug === "karts") points = Math.round(points * kartMultiplier);
      return {
        sportId: sport.id,
        sportName: sport.name,
        sportSlug: sport.slug,
        points,
      };
    });

    const totalPoints = breakdown.reduce((sum, item) => sum + item.points, 0);
    return {
      teamId: team.id,
      teamName: team.name,
      teamColor: team.color,
      logoUrl: team.logoUrl,
      totalPoints,
      position: 0,
      sportBreakdown: breakdown,
    };
  });

  entries.sort((a, b) => b.totalPoints - a.totalPoints);
  return entries.map((entry, index) => ({ ...entry, position: index + 1 }));
}

export async function getSportRanking(sportId: string) {
  const points = await prisma.teamSportPoints.findMany({
    where: { sportId },
    include: { team: true, sport: true },
    orderBy: { points: "desc" },
  });

  return points.map((row, index) => ({
    position: index + 1,
    teamId: row.teamId,
    teamName: row.team.name,
    teamColor: row.team.color,
    logoUrl: row.team.logoUrl,
    points: row.points,
    sportPosition: row.position,
  }));
}

export async function applyPointsForPosition(
  sportId: string,
  teamId: string,
  position: number
) {
  const config = await prisma.pointsConfig.findFirst({
    where: { sportId: null, position },
  });
  const sportConfig = await prisma.pointsConfig.findFirst({
    where: { sportId, position },
  });
  const points = sportConfig?.points ?? config?.points ?? 0;

  await prisma.teamSportPoints.upsert({
    where: { teamId_sportId: { teamId, sportId } },
    create: { teamId, sportId, position, points },
    update: { position, points },
  });

  return points;
}

export async function recalculateKartPoints(sportId: string) {
  const heats = await prisma.kartHeat.findMany({
    where: { sportId },
    include: { results: true },
    orderBy: { order: "asc" },
  });

  const teamTotals = new Map<string, number>();
  for (const heat of heats) {
    for (const result of heat.results) {
      teamTotals.set(
        result.teamId,
        (teamTotals.get(result.teamId) ?? 0) + result.points
      );
    }
  }

  const sorted = [...teamTotals.entries()].sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < sorted.length; i++) {
    const [teamId, rawPoints] = sorted[i];
    await prisma.teamSportPoints.upsert({
      where: { teamId_sportId: { teamId, sportId } },
      create: {
        teamId,
        sportId,
        position: i + 1,
        points: rawPoints,
      },
      update: { position: i + 1, points: rawPoints },
    });
  }
}
