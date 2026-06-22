import { prisma } from "@/lib/db";
import {
  getKartTotals,
  getOverallRanking,
  getSportPointsConfig,
  KART_RACE_NAMES,
  migrateLegacyKartResultsToSlots,
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
  races: Array<{
    kartRace: number;
    name: string;
    slots: {
      position: number;
      points: number;
      teamId: string | null;
      useX2: boolean;
    }[];
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
            where: { sportId: sport.id, kartRace: 0 },
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
    await migrateLegacyKartResultsToSlots(kartsSport.id);

    const [raceSlots, pointsConfig, totals] = await Promise.all([
      prisma.sportRankingSlot.findMany({
        where: { sportId: kartsSport.id, kartRace: { in: [1, 2, 3] } },
        orderBy: [{ kartRace: "asc" }, { position: "asc" }],
      }),
      getSportPointsConfig(kartsSport.id),
      getKartTotals(kartsSport.id),
    ]);

    karts = {
      sportId: kartsSport.id,
      pointsConfig,
      totals,
      races: [1, 2, 3].map((kartRace) => ({
        kartRace,
        name: KART_RACE_NAMES[kartRace - 1],
        slots: buildSlots(
          kartsSport.id,
          pointsConfig,
          raceSlots
            .filter((slot) => slot.kartRace === kartRace)
            .map((slot) => ({
              position: slot.position,
              points: slot.points,
              teamId: slot.teamId,
            }))
        ).map((slot) => ({
          ...slot,
          useX2:
            raceSlots.find(
              (row) => row.kartRace === kartRace && row.position === slot.position
            )?.useX2 ?? false,
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
