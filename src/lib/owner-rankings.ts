import { prisma } from "@/lib/db";
import {
  ensureKartHeats,
  getKartTotals,
  getOverallRanking,
  getSportPointsConfig,
  type KartTotalEntry,
  type RankingEntry,
} from "@/lib/rankings";

export type OwnerTeamOption = {
  id: string;
  name: string;
  color: string;
  logoUrl: string | null;
};

export type OwnerSportRankingSection = {
  sport: {
    id: string;
    slug: string;
    name: string;
  };
  pointsConfig: { position: number; points: number }[];
  slots: {
    position: number;
    points: number;
    teamId: string | null;
  }[];
};

export type OwnerKartsSection = {
  sportId: string;
  heats: Array<{
    id: string;
    name: string;
    order: number;
    results: Array<{
      position: number;
      points: number;
      teamId: string;
      useX2: boolean;
    }>;
  }>;
  pointsConfig: { position: number; points: number }[];
  totals: KartTotalEntry[];
};

export type OwnerRankingsData = {
  teams: OwnerTeamOption[];
  globalRanking: RankingEntry[];
  sportSections: OwnerSportRankingSection[];
  karts: OwnerKartsSection | null;
};

function buildSlots(
  sportId: string,
  pointsConfig: { position: number; points: number }[],
  existing: Array<{ position: number; points: number; teamId: string | null }>
) {
  return pointsConfig.map((config) => {
    const row = existing.find((slot) => slot.position === config.position);
    return {
      position: config.position,
      points: row?.points ?? config.points,
      teamId: row?.teamId ?? null,
    };
  });
}

export async function getOwnerRankingsData(): Promise<OwnerRankingsData> {
  const [teams, sports, globalRanking] = await Promise.all([
    prisma.team.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true, logoUrl: true },
    }),
    prisma.sport.findMany({ orderBy: { date: "asc" } }),
    getOverallRanking(),
  ]);

  const nonKartSports = sports.filter((sport) => sport.slug !== "karts");
  const kartsSport = sports.find((sport) => sport.slug === "karts");

  const sportSections = await Promise.all(
    nonKartSports.map(async (sport) => {
      const [pointsConfig, existingSlots] = await Promise.all([
        getSportPointsConfig(sport.id),
        prisma.sportRankingSlot
          .findMany({
            where: { sportId: sport.id },
            orderBy: { position: "asc" },
          })
          .catch(() => []),
      ]);

      return {
        sport: { id: sport.id, slug: sport.slug, name: sport.name },
        pointsConfig,
        slots: buildSlots(sport.id, pointsConfig, existingSlots),
      };
    })
  );

  let karts: OwnerKartsSection | null = null;
  if (kartsSport) {
    const [heats, pointsConfig, totals] = await Promise.all([
      ensureKartHeats(kartsSport.id),
      getSportPointsConfig(kartsSport.id),
      getKartTotals(kartsSport.id),
    ]);

    karts = {
      sportId: kartsSport.id,
      pointsConfig,
      totals,
      heats: heats.map((heat, index) => ({
        id: heat.id,
        name: `Corrida ${index + 1}`,
        order: index + 1,
        results: heat.results.map((result) => ({
          position: result.position,
          points: result.points,
          teamId: result.teamId,
          useX2: result.useX2,
        })),
      })),
    };
  }

  return {
    teams,
    globalRanking,
    sportSections,
    karts,
  };
}
