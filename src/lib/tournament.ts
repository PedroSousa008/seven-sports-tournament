import { prisma } from "@/lib/db";
import { getOverallRanking } from "@/lib/rankings";

export async function getTournamentSettings() {
  try {
    return await prisma.tournamentSettings.findUnique({
      where: { id: "default" },
    });
  } catch {
    return null;
  }
}

export async function getOwnerDashboardStats() {
  const [
    settings,
    teams,
    players,
    revenues,
    costs,
    events,
    matches,
    ranking,
    announcements,
  ] = await Promise.all([
    getTournamentSettings(),
    prisma.team.findMany({ include: { players: true, user: true } }),
    prisma.player.count(),
    prisma.revenue.findMany(),
    prisma.cost.findMany(),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { sport: true, teams: { include: { team: true } } },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.match.findMany({
      where: { status: "UPCOMING" },
      include: { sport: true, homeTeam: true, awayTeam: true },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
    getOverallRanking(),
    prisma.announcement.findMany({
      orderBy: { date: "desc" },
      take: 3,
    }),
  ]);

  const totalRevenue = revenues.reduce((sum, row) => sum + row.amount, 0);
  const paidRevenue = revenues
    .filter((row) => row.paymentStatus === "PAID")
    .reduce((sum, row) => sum + row.amount, 0);
  const totalCosts = costs.reduce((sum, row) => sum + row.amount, 0);
  const paidCosts = costs
    .filter((row) => row.paid)
    .reduce((sum, row) => sum + row.amount, 0);
  const unpaidTeams = teams.filter((team) => team.paymentStatus !== "PAID").length;
  const teamsWithoutLogin = teams.filter((team) => !team.user).length;

  return {
    settings,
    teamsCount: teams.length,
    playersCount: players,
    totalRevenue,
    paidRevenue,
    totalCosts,
    paidCosts,
    estimatedProfit: totalRevenue - totalCosts,
    nextEvent: events[0] ?? null,
    upcomingMatches: matches,
    ranking: ranking.slice(0, 5),
    pendingActions: [
      unpaidTeams > 0
        ? `${unpaidTeams} equipa${unpaidTeams > 1 ? "s" : ""} com pagamento pendente`
        : null,
      teamsWithoutLogin > 0
        ? `${teamsWithoutLogin} equipa${teamsWithoutLogin > 1 ? "s" : ""} sem credenciais de acesso`
        : null,
      teams.length < (settings?.maxTeams ?? 12)
        ? `${(settings?.maxTeams ?? 12) - teams.length} vaga${(settings?.maxTeams ?? 12) - teams.length > 1 ? "s" : ""} disponível${(settings?.maxTeams ?? 12) - teams.length > 1 ? "is" : ""}`
        : null,
    ].filter(Boolean) as string[],
    announcements,
  };
}

export async function getTeamDashboardStats(teamId: string) {
  const [team, ranking, events, announcements, matches] = await Promise.all([
    prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: { include: { sports: { include: { sport: true } } } },
        sportPoints: { include: { sport: true } },
      },
    }),
    getOverallRanking(),
    prisma.event.findMany({
      where: {
        date: { gte: new Date() },
        OR: [{ teams: { none: {} } }, { teams: { some: { teamId } } }],
      },
      include: { sport: true },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.announcement.findMany({
      where: {
        OR: [{ allTeams: true }, { targets: { some: { teamId } } }],
      },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.match.findMany({
      where: {
        status: "UPCOMING",
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: { sport: true, homeTeam: true, awayTeam: true },
      orderBy: { scheduledAt: "asc" },
      take: 3,
    }),
  ]);

  const teamRank = ranking.find((entry) => entry.teamId === teamId);
  const totalPoints = teamRank?.totalPoints ?? 0;

  return {
    team,
    position: teamRank?.position ?? null,
    totalPoints,
    nextEvent: events[0] ?? null,
    upcomingEvents: events,
    upcomingMatches: matches,
    announcements,
  };
}

export async function getAnnouncementsForTeam(teamId?: string) {
  if (!teamId) {
    return prisma.announcement.findMany({
      include: { sport: true },
      orderBy: [{ priority: "desc" }, { date: "desc" }],
    });
  }
  return prisma.announcement.findMany({
    where: {
      OR: [{ allTeams: true }, { targets: { some: { teamId } } }],
    },
    include: { sport: true },
    orderBy: [{ priority: "desc" }, { date: "desc" }],
  });
}
