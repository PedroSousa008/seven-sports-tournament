import { prisma } from "@/lib/db";
import { getOverallRanking } from "@/lib/rankings";
import {
  DEFAULT_TEAM_BANNER,
  getJourneyStatus,
  JOURNEY_SPORTS,
  SPORT_IMAGES,
  type JourneyStatus,
} from "@/lib/team-content";
import { PARTNER_LOGOS } from "@/lib/partners-content";

export type TeamHubData = {
  team: {
    id: string;
    name: string;
    color: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    captainName: string;
  };
  position: number | null;
  totalPoints: number;
  nextEvent: {
    id: string;
    title: string;
    date: string;
    time: string | null;
    location: string | null;
    sportName: string | null;
    sportSlug: string | null;
    image: string;
  } | null;
  nextMatch: {
    id: string;
    title: string;
    scheduledAt: string | null;
    location: string | null;
    sportName: string;
    sportSlug: string;
    image: string;
    opponent: string | null;
  } | null;
  journey: Array<{
    slug: string;
    name: string;
    dateLabel: string;
    image: string;
    status: JourneyStatus;
  }>;
  ranking: Array<{
    teamId: string;
    teamName: string;
    logoUrl: string | null;
    teamColor: string;
    totalPoints: number;
    position: number;
    isUserTeam: boolean;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    time: string | null;
    location: string | null;
    sportName: string | null;
    sportSlug: string | null;
    image: string;
    homeTeam: string | null;
    awayTeam: string | null;
  }>;
  sportsHub: Array<{
    id: string;
    slug: string;
    name: string;
    image: string;
    icon: string;
    status: JourneyStatus;
    groupPosition: number | null;
    points: number;
    nextMatch: string | null;
    recentResults: string[];
  }>;
  latestResults: Array<{
    id: string;
    sportName: string;
    sportSlug: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: string | null;
    awayScore: string | null;
    image: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    priority: string;
    sportName: string | null;
    image: string;
  }>;
  promotions: Array<{
    id: string;
    title: string;
    description: string | null;
    code: string | null;
    url: string | null;
    partnerName: string;
    partnerLogo: string | null;
  }>;
  storeItems: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    imageUrl: string | null;
    partnerName: string | null;
    contactUrl: string | null;
  }>;
};

function sportImage(slug: string) {
  return SPORT_IMAGES[slug] ?? DEFAULT_TEAM_BANNER;
}

export async function getTeamHubData(teamId: string): Promise<TeamHubData> {
  const sportDates = JOURNEY_SPORTS.map((s) => s.date);

  const [
    team,
    ranking,
    sports,
    events,
    announcements,
    upcomingMatches,
    finishedMatches,
    allFinished,
    partners,
    storeItems,
  ] = await Promise.all([
    prisma.team.findUnique({
      where: { id: teamId },
      include: {
        sportPoints: { include: { sport: true } },
      },
    }),
    getOverallRanking(),
    prisma.sport.findMany({ orderBy: { date: "asc" } }),
    prisma.event.findMany({
      where: {
        date: { gte: new Date() },
        OR: [{ teams: { none: {} } }, { teams: { some: { teamId } } }],
      },
      include: { sport: true, teams: { include: { team: true } } },
      orderBy: { date: "asc" },
      take: 12,
    }),
    prisma.announcement.findMany({
      where: {
        OR: [{ allTeams: true }, { targets: { some: { teamId } } }],
      },
      include: { sport: true },
      orderBy: [{ priority: "desc" }, { date: "desc" }],
      take: 6,
    }),
    prisma.match.findMany({
      where: {
        status: "UPCOMING",
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: { sport: true, homeTeam: true, awayTeam: true },
      orderBy: { scheduledAt: "asc" },
      take: 8,
    }),
    prisma.match.findMany({
      where: {
        status: "FINISHED",
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: { sport: true, homeTeam: true, awayTeam: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.match.findMany({
      where: { status: "FINISHED" },
      include: { sport: true, homeTeam: true, awayTeam: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.partner.findMany({
      where: { status: { in: ["CONFIRMED", "PAID", "COMPLETED"] } },
      include: { promotions: { where: { active: true }, take: 2 } },
      orderBy: { brandName: "asc" },
    }),
    prisma.storeItem.findMany({
      where: { active: true },
      include: { partner: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  if (!team) {
    throw new Error("Equipa não encontrada");
  }

  const teamRank = ranking.find((entry) => entry.teamId === teamId);
  const nextMatchRow = upcomingMatches[0] ?? null;
  const nextEventRow = events[0] ?? null;

  const nextEvent = nextEventRow
    ? {
        id: nextEventRow.id,
        title: nextEventRow.title,
        date: nextEventRow.date.toISOString(),
        time: nextEventRow.time,
        location: nextEventRow.location,
        sportName: nextEventRow.sport?.name ?? null,
        sportSlug: nextEventRow.sport?.slug ?? null,
        image: sportImage(nextEventRow.sport?.slug ?? "futebol7"),
      }
    : null;

  const nextMatch = nextMatchRow
    ? {
        id: nextMatchRow.id,
        title: nextMatchRow.title,
        scheduledAt: nextMatchRow.scheduledAt?.toISOString() ?? null,
        location: nextMatchRow.location,
        sportName: nextMatchRow.sport.name,
        sportSlug: nextMatchRow.sport.slug,
        image: sportImage(nextMatchRow.sport.slug),
        opponent:
          nextMatchRow.homeTeamId === teamId
            ? (nextMatchRow.awayTeam?.name ?? null)
            : (nextMatchRow.homeTeam?.name ?? null),
      }
    : null;

  const journey = JOURNEY_SPORTS.map((sport) => ({
    slug: sport.slug,
    name: sport.name,
    dateLabel: sport.dateLabel,
    image: sport.image,
    status: getJourneyStatus(sport.date, sportDates),
  }));

  const sportsHub = sports.map((sport) => {
    const sportPoints = team.sportPoints.find((p) => p.sportId === sport.id);
    const teamUpcoming = upcomingMatches.find((m) => m.sportId === sport.id);
    const teamFinished = finishedMatches
      .filter((m) => m.sportId === sport.id)
      .slice(0, 2)
      .map((m) => {
        const home = m.homeTeam?.name ?? "—";
        const away = m.awayTeam?.name ?? "—";
        return `${home} ${m.homeScore ?? "–"}-${m.awayScore ?? "–"} ${away}`;
      });

    const journeySport = JOURNEY_SPORTS.find((j) => j.slug === sport.slug);
    const status = getJourneyStatus(journeySport?.date ?? "", sportDates);

    return {
      id: sport.id,
      slug: sport.slug,
      name: sport.slug === "karts" ? "Karts Grand Final" : sport.name,
      image: sportImage(sport.slug),
      icon:
        sport.slug === "futebol7"
          ? "⚽"
          : sport.slug === "padel"
            ? "🎾"
            : sport.slug === "voleibol"
              ? "🏐"
              : "🏎️",
      status,
      groupPosition: sportPoints?.position ?? null,
      points: sportPoints?.points ?? 0,
      nextMatch: teamUpcoming
        ? `${teamUpcoming.homeTeam?.name ?? "TBD"} vs ${teamUpcoming.awayTeam?.name ?? "TBD"}`
        : null,
      recentResults: teamFinished,
    };
  });

  const staticLogos = new Map(
    PARTNER_LOGOS.map((p) => [p.brandName.toLowerCase(), p.logo])
  );

  return {
    team: {
      id: team.id,
      name: team.name,
      color: team.color,
      logoUrl: team.logoUrl,
      bannerUrl: team.bannerUrl,
      captainName: team.captainName,
    },
    position: teamRank?.position ?? null,
    totalPoints: teamRank?.totalPoints ?? 0,
    nextEvent,
    nextMatch,
    journey,
    ranking: ranking.slice(0, 5).map((entry) => ({
      teamId: entry.teamId,
      teamName: entry.teamName,
      logoUrl: entry.logoUrl,
      teamColor: entry.teamColor,
      totalPoints: entry.totalPoints,
      position: entry.position,
      isUserTeam: entry.teamId === teamId,
    })),
    upcomingEvents: events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date.toISOString(),
      time: event.time,
      location: event.location,
      sportName: event.sport?.name ?? null,
      sportSlug: event.sport?.slug ?? null,
      image: sportImage(event.sport?.slug ?? "futebol7"),
      homeTeam: null,
      awayTeam: null,
    })),
    sportsHub,
    latestResults: allFinished.map((match) => ({
      id: match.id,
      sportName: match.sport.name,
      sportSlug: match.sport.slug,
      homeTeam: match.homeTeam?.name ?? "TBD",
      awayTeam: match.awayTeam?.name ?? "TBD",
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      image: sportImage(match.sport.slug),
    })),
    announcements: announcements.map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      date: item.date.toISOString(),
      priority: item.priority,
      sportName: item.sport?.name ?? null,
      image: sportImage(item.sport?.slug ?? "futebol7"),
    })),
    promotions: partners.flatMap((partner) =>
      partner.promotions.map((promo) => ({
        id: promo.id,
        title: promo.title,
        description: promo.description,
        code: promo.code,
        url: promo.url,
        partnerName: partner.brandName,
        partnerLogo:
          partner.logoUrl ??
          staticLogos.get(partner.brandName.toLowerCase()) ??
          null,
      }))
    ),
    storeItems: storeItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      partnerName: item.partner?.brandName ?? null,
      contactUrl: item.contactUrl,
    })),
  };
}

export async function getTeamEquipaData(teamId: string) {
  const [team, sports] = await Promise.all([
    prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: {
          include: {
            sports: { include: { sport: true } },
          },
        },
      },
    }),
    prisma.sport.findMany({ orderBy: { date: "asc" } }),
  ]);

  return { team, sports };
}

export async function getTeamPartnersData() {
  const [partners, storeItems, staticPartners] = await Promise.all([
    prisma.partner.findMany({
      where: { status: { in: ["CONFIRMED", "PAID", "COMPLETED"] } },
      include: { promotions: { where: { active: true } } },
      orderBy: { brandName: "asc" },
    }),
    prisma.storeItem.findMany({
      where: { active: true },
      include: { partner: true },
      orderBy: { createdAt: "desc" },
    }),
    Promise.resolve(PARTNER_LOGOS),
  ]);

  const staticLogos = new Map(
    staticPartners.map((p) => [p.slug, p.logo])
  );

  return { partners, storeItems, staticPartners, staticLogos };
}
