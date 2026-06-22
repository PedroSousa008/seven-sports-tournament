import { DEFAULT_POINTS } from "@/lib/constants";
import { prisma } from "@/lib/db";

export type RankingEntry = {
  teamId: string;
  teamName: string;
  teamColor: string;
  logoUrl: string | null;
  totalPoints: number;
  position: number;
  sportBreakdown: {
    sportId: string;
    sportName: string;
    sportSlug: string;
    points: number;
  }[];
};

export type KartTotalEntry = {
  teamId: string;
  teamName: string;
  teamColor: string;
  logoUrl: string | null;
  corrida1: number;
  corrida2: number;
  corrida3: number;
  x2Used: boolean;
  total: number;
  position: number;
};

export const KART_RACE_NAMES = ["Corrida 1", "Corrida 2", "Corrida 3"] as const;
export const KART_RACE_MULTIPLIER = 1.5;

export function applyKartRaceMultiplier(points: number, boosted: boolean) {
  return boosted ? Math.round(points * KART_RACE_MULTIPLIER) : points;
}

export async function getSportPointsConfig(sportId: string) {
  const rows = await prisma.pointsConfig.findMany({
    where: { sportId },
    orderBy: { position: "asc" },
  });

  return DEFAULT_POINTS.map((defaults) => {
    const row = rows.find((item) => item.position === defaults.position);
    return {
      position: defaults.position,
      points: row?.points ?? defaults.points,
    };
  });
}

export async function ensureKartHeats(sportId: string) {
  const existing = await prisma.kartHeat.findMany({
    where: { sportId },
    include: { results: { include: { team: true } } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  if (existing.length > 3) {
    const extras = existing.slice(3);
    await prisma.kartHeat.deleteMany({
      where: { id: { in: extras.map((heat) => heat.id) } },
    });
  }

  const heats = existing.slice(0, 3);

  for (let i = 0; i < 3; i++) {
    const expectedName = KART_RACE_NAMES[i];
    const expectedOrder = i + 1;

    if (heats[i]) {
      if (heats[i].name !== expectedName || heats[i].order !== expectedOrder) {
        await prisma.kartHeat.update({
          where: { id: heats[i].id },
          data: { name: expectedName, order: expectedOrder },
        });
      }
    } else {
      await prisma.kartHeat.create({
        data: { sportId, name: expectedName, order: expectedOrder },
      });
    }
  }

  return prisma.kartHeat.findMany({
    where: { sportId },
    include: { results: { include: { team: true } } },
    orderBy: { order: "asc" },
    take: 3,
  });
}

export async function getOverallRanking(): Promise<RankingEntry[]> {
  const [teams, sports, sportPoints] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.sport.findMany({ orderBy: { date: "asc" } }),
    prisma.teamSportPoints.findMany({ include: { sport: true } }),
  ]);

  const entries = teams.map((team) => {
    const breakdown = sports.map((sport) => {
      const row = sportPoints.find(
        (point) => point.teamId === team.id && point.sportId === sport.id
      );
      return {
        sportId: sport.id,
        sportName: sport.name,
        sportSlug: sport.slug,
        points: row?.points ?? 0,
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

  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return a.teamName.localeCompare(b.teamName, "pt");
  });

  return entries.map((entry, index) => ({ ...entry, position: index + 1 }));
}

export async function getSportRanking(sportId: string) {
  const points = await prisma.teamSportPoints.findMany({
    where: { sportId },
    include: { team: true, sport: true },
    orderBy: [{ points: "desc" }, { position: "asc" }],
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

export async function syncSportRankingSlotsToTeamPoints(sportId: string) {
  const slots = await prisma.sportRankingSlot.findMany({
    where: { sportId, teamId: { not: null } },
  });

  await prisma.teamSportPoints.deleteMany({ where: { sportId } });

  for (const slot of slots) {
    if (!slot.teamId) continue;
    await prisma.teamSportPoints.create({
      data: {
        teamId: slot.teamId,
        sportId,
        position: slot.position,
        points: slot.points,
      },
    });
  }
}

export async function recalculateKartPoints(sportId: string) {
  const heats = await ensureKartHeats(sportId);
  const teamTotals = new Map<
    string,
    { corrida1: number; corrida2: number; corrida3: number; x2Used: boolean }
  >();

  heats.forEach((heat, index) => {
    for (const result of heat.results) {
      const points = applyKartRaceMultiplier(result.points, result.useX2);
      const current = teamTotals.get(result.teamId) ?? {
        corrida1: 0,
        corrida2: 0,
        corrida3: 0,
        x2Used: false,
      };

      if (index === 0) current.corrida1 = points;
      if (index === 1) current.corrida2 = points;
      if (index === 2) current.corrida3 = points;
      if (result.useX2) current.x2Used = true;

      teamTotals.set(result.teamId, current);
    }
  });

  const sorted = [...teamTotals.entries()]
    .map(([teamId, races]) => ({
      teamId,
      total: races.corrida1 + races.corrida2 + races.corrida3,
      ...races,
    }))
    .sort((a, b) => b.total - a.total);

  await prisma.teamSportPoints.deleteMany({ where: { sportId } });

  for (let i = 0; i < sorted.length; i++) {
    await prisma.teamSportPoints.create({
      data: {
        teamId: sorted[i].teamId,
        sportId,
        position: i + 1,
        points: sorted[i].total,
      },
    });
  }
}

export async function getKartTotals(sportId: string): Promise<KartTotalEntry[]> {
  const [heats, teams] = await Promise.all([
    ensureKartHeats(sportId),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totals = new Map<
    string,
    { corrida1: number; corrida2: number; corrida3: number; x2Used: boolean }
  >();

  heats.forEach((heat, index) => {
    for (const result of heat.results) {
      const points = applyKartRaceMultiplier(result.points, result.useX2);
      const current = totals.get(result.teamId) ?? {
        corrida1: 0,
        corrida2: 0,
        corrida3: 0,
        x2Used: false,
      };

      if (index === 0) current.corrida1 = points;
      if (index === 1) current.corrida2 = points;
      if (index === 2) current.corrida3 = points;
      if (result.useX2) current.x2Used = true;

      totals.set(result.teamId, current);
    }
  });

  const entries = [...totals.entries()]
    .map(([teamId, races]) => {
      const team = teams.find((item) => item.id === teamId);
      return {
        teamId,
        teamName: team?.name ?? "Equipa",
        teamColor: team?.color ?? "#DC2626",
        logoUrl: team?.logoUrl ?? null,
        corrida1: races.corrida1,
        corrida2: races.corrida2,
        corrida3: races.corrida3,
        x2Used: races.x2Used,
        total: races.corrida1 + races.corrida2 + races.corrida3,
        position: 0,
      };
    })
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.total - a.total);

  return entries.map((entry, index) => ({ ...entry, position: index + 1 }));
}

export async function applyPointsForPosition(
  sportId: string,
  teamId: string,
  position: number
) {
  const config = await prisma.pointsConfig.findFirst({
    where: { sportId, position },
  });
  const globalConfig = await prisma.pointsConfig.findFirst({
    where: { sportId: null, position },
  });
  const points = config?.points ?? globalConfig?.points ?? 0;

  await prisma.teamSportPoints.upsert({
    where: { teamId_sportId: { teamId, sportId } },
    create: { teamId, sportId, position, points },
    update: { position, points },
  });

  return points;
}
