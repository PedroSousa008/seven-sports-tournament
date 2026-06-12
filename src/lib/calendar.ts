import { prisma } from "@/lib/db";
import {
  CALENDAR_SPORT_SLUGS,
  KNOCKOUT_LABELS,
  SPORT_FORMATS,
  type KnockoutRound,
} from "@/lib/sport-formats";
import { TOURNAMENT } from "@/lib/constants";

export type TeamInfo = {
  id: string;
  name: string;
  logoUrl: string | null;
  color: string;
};

export type MatchInfo = {
  id: string;
  round: string | null;
  groupName: string | null;
  groupId: string | null;
  scheduledAt: string | null;
  timeLabel: string;
  location: string | null;
  status: string;
  homeTeam: TeamInfo | null;
  awayTeam: TeamInfo | null;
  homeScore: string | null;
  awayScore: string | null;
};

export type StandingRow = {
  teamId: string;
  teamName: string;
  logoUrl: string | null;
  color: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  diff: number;
  points: number;
  position: number;
  qualified: boolean;
};

export type GroupCalendar = {
  id: string;
  name: string;
  teams: TeamInfo[];
  standings: StandingRow[];
  matches: MatchInfo[];
};

export type KnockoutMatch = MatchInfo & {
  roundLabel: string;
};

export type SportCalendarData = {
  sportId: string;
  slug: string;
  name: string;
  date: string | null;
  format: (typeof SPORT_FORMATS)[string];
  groups: GroupCalendar[];
  knockout: KnockoutMatch[];
  allTeams: TeamInfo[];
  isPlaceholder: boolean;
};

function parseScore(score: string | null | undefined): number | null {
  if (score === null || score === undefined || score.trim() === "") return null;
  const n = Number(score);
  return Number.isFinite(n) ? n : null;
}

function formatTime(date: Date | null, fallback?: string | null): string {
  if (date) {
    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return fallback ?? "";
}

export function calculateGroupStandings(
  teams: TeamInfo[],
  matches: MatchInfo[],
  qualifiersPerGroup: number
): StandingRow[] {
  const stats = new Map<
    string,
    {
      played: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
      points: number;
    }
  >();

  for (const team of teams) {
    stats.set(team.id, {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    });
  }

  const groupMatches = matches.filter(
    (m) => m.round === "GROUP" && m.status === "FINISHED"
  );

  for (const match of groupMatches) {
    if (!match.homeTeam || !match.awayTeam) continue;
    const homeScore = parseScore(match.homeScore);
    const awayScore = parseScore(match.awayScore);
    if (homeScore === null || awayScore === null) continue;

    const home = stats.get(match.homeTeam.id);
    const away = stats.get(match.awayTeam.id);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (homeScore < awayScore) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const rows: StandingRow[] = teams.map((team) => {
    const s = stats.get(team.id)!;
    return {
      teamId: team.id,
      teamName: team.name,
      logoUrl: team.logoUrl,
      color: team.color,
      played: s.played,
      wins: s.wins,
      draws: s.draws,
      losses: s.losses,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      diff: s.goalsFor - s.goalsAgainst,
      points: s.points,
      position: 0,
      qualified: false,
    };
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return a.teamName.localeCompare(b.teamName);
  });

  return rows.map((row, i) => ({
    ...row,
    position: i + 1,
    qualified: i < qualifiersPerGroup,
  }));
}

function mapTeam(team: {
  id: string;
  name: string;
  logoUrl: string | null;
  color: string;
} | null): TeamInfo | null {
  if (!team) return null;
  return {
    id: team.id,
    name: team.name,
    logoUrl: team.logoUrl,
    color: team.color,
  };
}

function mapMatch(match: {
  id: string;
  round: string | null;
  groupId: string | null;
  group?: { name: string } | null;
  scheduledAt: Date | null;
  location: string | null;
  status: string;
  homeTeam: { id: string; name: string; logoUrl: string | null; color: string } | null;
  awayTeam: { id: string; name: string; logoUrl: string | null; color: string } | null;
  homeScore: string | null;
  awayScore: string | null;
  sport?: { time: string | null };
}): MatchInfo {
  return {
    id: match.id,
    round: match.round,
    groupName: match.group?.name ?? null,
    groupId: match.groupId,
    scheduledAt: match.scheduledAt?.toISOString() ?? null,
    timeLabel: formatTime(match.scheduledAt, match.sport?.time ?? null),
    location: match.location,
    status: match.status,
    homeTeam: mapTeam(match.homeTeam),
    awayTeam: mapTeam(match.awayTeam),
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  };
}

export async function getSportCalendar(slug: string): Promise<SportCalendarData | null> {
  const format = SPORT_FORMATS[slug];
  if (!format) return null;

  const sport = await prisma.sport.findUnique({
    where: { slug },
    include: {
      groups: {
        include: {
          teams: { include: { team: true } },
        },
        orderBy: { order: "asc" },
      },
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true,
          group: true,
        },
        orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!sport) return null;

  const allTeams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, logoUrl: true, color: true },
  });

  if (format.placeholder) {
    return {
      sportId: sport.id,
      slug: sport.slug,
      name: sport.name,
      date: sport.date?.toISOString() ?? null,
      format,
      groups: [],
      knockout: [],
      allTeams,
      isPlaceholder: true,
    };
  }

  const groupNames = format.groups;
  const existingGroups = sport.groups;

  const groups: GroupCalendar[] = groupNames.map((groupName, order) => {
    let group = existingGroups.find((g) => g.name === groupName);
    const teams: TeamInfo[] =
      group?.teams.map((gt) => ({
        id: gt.team.id,
        name: gt.team.name,
        logoUrl: gt.team.logoUrl,
        color: gt.team.color,
      })) ?? [];

    const groupMatches = sport.matches
      .filter((m) => m.group?.name === groupName || m.groupId === group?.id)
      .map((m) => mapMatch({ ...m, sport }));

    const standings = calculateGroupStandings(
      teams,
      groupMatches,
      format.qualifiersPerGroup
    );

    return {
      id: group?.id ?? `pending-${order}`,
      name: groupName,
      teams,
      standings,
      matches: groupMatches.filter((m) => m.round === "GROUP" || m.groupId),
    };
  });

  const knockout: KnockoutMatch[] = sport.matches
    .filter((m) => m.round && m.round !== "GROUP")
    .map((m) => ({
      ...mapMatch({ ...m, sport }),
      roundLabel: KNOCKOUT_LABELS[m.round as KnockoutRound] ?? m.round ?? "",
    }));

  return {
    sportId: sport.id,
    slug: sport.slug,
    name: sport.name,
    date: sport.date?.toISOString() ?? null,
    format,
    groups,
    knockout,
    allTeams,
    isPlaceholder: false,
  };
}

export async function getAllSportCalendars() {
  const calendars = await Promise.all(
    CALENDAR_SPORT_SLUGS.map((slug) => getSportCalendar(slug))
  );
  return calendars.filter(Boolean) as SportCalendarData[];
}

export function getKnockoutPlaceholders(
  format: SportCalendarData["format"],
  groups: GroupCalendar[]
): { round: KnockoutRound; label: string; home: string; away: string }[] {
  if (format.placeholder) return [];

  const qualified: string[] = [];
  for (const group of groups) {
    const q = group.standings.filter((s) => s.qualified);
    for (const row of q) {
      qualified.push(`${row.position}º ${group.name}`);
    }
  }

  const placeholders: { round: KnockoutRound; label: string; home: string; away: string }[] = [];

  if (format.knockoutRounds.includes("QUARTER_FINAL")) {
    const pairs = [
      ["1º Grupo A", "2º Grupo B"],
      ["1º Grupo C", "2º Grupo D"],
      ["1º Grupo B", "2º Grupo A"],
      ["1º Grupo D", "2º Grupo C"],
    ];
    for (const [home, away] of pairs) {
      placeholders.push({
        round: "QUARTER_FINAL",
        label: KNOCKOUT_LABELS.QUARTER_FINAL,
        home: qualified[0] ? home : home,
        away,
      });
    }
  }

  if (format.knockoutRounds.includes("SEMI_FINAL")) {
    placeholders.push(
      {
        round: "SEMI_FINAL",
        label: KNOCKOUT_LABELS.SEMI_FINAL,
        home: "1º Grupo A",
        away: "1º Grupo C",
      },
      {
        round: "SEMI_FINAL",
        label: KNOCKOUT_LABELS.SEMI_FINAL,
        home: "1º Grupo B",
        away: "1º Grupo D",
      }
    );
  }

  if (format.knockoutRounds.includes("FINAL")) {
    placeholders.push({
      round: "FINAL",
      label: KNOCKOUT_LABELS.FINAL,
      home: "Vencedor SF1",
      away: "Vencedor SF2",
    });
  }

  return placeholders;
}

export function calendarDownloadTitle(slug: string) {
  const format = SPORT_FORMATS[slug];
  return `${TOURNAMENT.name} — Calendário ${format?.label ?? slug}`;
}
