"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { applyPointsForPosition, recalculateKartPoints } from "@/lib/rankings";
import type {
  AnnouncementPriority,
  EventStatus,
  PartnershipStatus,
  PartnershipType,
  PaymentStatus,
} from "@prisma/client";

async function requireOwner() {
  const session = await requireSession("OWNER");
  return session;
}

async function requireTeam() {
  const session = await requireSession("TEAM");
  if (!session.user.teamId) throw new Error("Equipa não encontrada");
  return session;
}

export async function createTeamAction(formData: FormData) {
  await requireOwner();
  const settings = await prisma.tournamentSettings.findUnique({
    where: { id: "default" },
  });
  const count = await prisma.team.count();
  if (count >= (settings?.maxTeams ?? 12)) {
    throw new Error("Número máximo de equipas atingido");
  }

  const name = String(formData.get("name") ?? "").trim();
  const captainName = String(formData.get("captainName") ?? "").trim();
  const captainEmail = String(formData.get("captainEmail") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "#DC2626");
  const paymentStatus = String(formData.get("paymentStatus") ?? "UNPAID") as PaymentStatus;

  const team = await prisma.team.create({
    data: {
      name,
      captainName,
      captainEmail,
      phone,
      color,
      paymentStatus,
    },
  });

  if (password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email: captainEmail,
        name: captainName,
        passwordHash,
        role: "TEAM",
        teamId: team.id,
      },
    });
  }

  revalidatePath("/owner/teams");
}

export async function updateTeamAction(teamId: string, formData: FormData) {
  await requireOwner();
  await prisma.team.update({
    where: { id: teamId },
    data: {
      name: String(formData.get("name") ?? ""),
      captainName: String(formData.get("captainName") ?? ""),
      captainEmail: String(formData.get("captainEmail") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      color: String(formData.get("color") ?? "#DC2626"),
      paymentStatus: String(formData.get("paymentStatus") ?? "UNPAID") as PaymentStatus,
      notes: String(formData.get("notes") ?? "") || null,
      logoUrl: String(formData.get("logoUrl") ?? "") || null,
      bannerUrl: String(formData.get("bannerUrl") ?? "") || null,
      selectionsLocked: formData.get("selectionsLocked") === "on",
    },
  });
  revalidatePath("/owner/teams");
  revalidatePath(`/owner/teams/${teamId}`);
}

export async function deleteTeamAction(teamId: string) {
  await requireOwner();
  await prisma.team.delete({ where: { id: teamId } });
  revalidatePath("/owner/teams");
}

export async function resetTeamPasswordAction(teamId: string, password: string) {
  await requireOwner();
  const user = await prisma.user.findFirst({ where: { teamId } });
  if (!user) throw new Error("Acesso da equipa não encontrado");
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
}

export async function createPlayerAction(teamId: string, formData: FormData) {
  const session = await requireSession();
  if (session.user.role === "TEAM" && session.user.teamId !== teamId) {
    throw new Error("Não autorizado");
  }
  if (session.user.role === "OWNER") await requireOwner();

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { players: true },
  });
  const settings = await prisma.tournamentSettings.findUnique({
    where: { id: "default" },
  });
  if (!team) throw new Error("Equipa não encontrada");
  if (team.players.length >= (settings?.maxPlayersPerTeam ?? 10)) {
    throw new Error("Número máximo de jogadores atingido");
  }

  await prisma.player.create({
    data: {
      teamId,
      name: String(formData.get("name") ?? ""),
      age: Number(formData.get("age") || 0) || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      available: formData.get("available") !== "off",
    },
  });
  revalidatePath(`/owner/teams/${teamId}`);
  revalidatePath("/team/equipa");
}

export async function deletePlayerAction(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return;
  const session = await requireSession();
  if (session.user.role === "TEAM" && session.user.teamId !== player.teamId) {
    throw new Error("Não autorizado");
  }
  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath("/team/equipa");
  revalidatePath("/owner/teams");
}

export async function togglePlayerSportAction(
  playerId: string,
  sportId: string,
  selected: boolean
) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return;
  const session = await requireSession();
  if (session.user.role === "TEAM") {
    if (session.user.teamId !== player.teamId) throw new Error("Unauthorized");
    const team = await prisma.team.findUnique({ where: { id: player.teamId } });
    if (team?.selectionsLocked) throw new Error("As seleções estão bloqueadas");
  }

  if (selected) {
    await prisma.playerSportSelection.create({
      data: { playerId, teamId: player.teamId, sportId },
    });
  } else {
    await prisma.playerSportSelection.deleteMany({
      where: { playerId, sportId },
    });
  }
  revalidatePath("/team/equipa");
}

export async function updateSportAction(sportId: string, formData: FormData) {
  await requireOwner();
  await prisma.sport.update({
    where: { id: sportId },
    data: {
      description: String(formData.get("description") ?? "") || null,
      date: formData.get("date") ? new Date(String(formData.get("date"))) : null,
      time: String(formData.get("time") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      rules: String(formData.get("rules") ?? "") || null,
      format: String(formData.get("format") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  revalidatePath("/owner/sports");
  revalidatePath(`/owner/sports/${sportId}`);
}

export async function saveSportGroupAction(
  sportId: string,
  groupName: string,
  formData: FormData
) {
  await requireOwner();
  const teamIds = formData.getAll("teamIds").map(String).filter(Boolean);
  const uniqueIds = new Set(teamIds);
  if (uniqueIds.size !== teamIds.length) {
    throw new Error("Não podes repetir equipas no mesmo grupo.");
  }

  let group = await prisma.sportGroup.findFirst({
    where: { sportId, name: groupName },
  });
  if (!group) {
    const count = await prisma.sportGroup.count({ where: { sportId } });
    group = await prisma.sportGroup.create({
      data: { sportId, name: groupName, order: count },
    });
  }

  for (const teamId of teamIds) {
    const inOtherGroup = await prisma.sportGroupTeam.findFirst({
      where: {
        teamId,
        group: { sportId, id: { not: group.id } },
      },
    });
    if (inOtherGroup) {
      throw new Error("Esta equipa já está atribuída a outro grupo neste desporto.");
    }
  }

  await prisma.sportGroupTeam.deleteMany({ where: { groupId: group.id } });
  for (const teamId of teamIds) {
    if (teamId) {
      await prisma.sportGroupTeam.create({
        data: { groupId: group.id, teamId },
      });
    }
  }
  const sport = await prisma.sport.findUnique({ where: { id: sportId } });
  revalidatePath(`/owner/sports/${sport?.slug ?? sportId}`);
  revalidatePath("/owner/calendar");
  revalidatePath("/");
  revalidatePath("/team");
}

export async function createMatchAction(sportId: string, formData: FormData) {
  await requireOwner();
  let groupId = String(formData.get("groupId") ?? "") || null;
  const groupName = String(formData.get("groupName") ?? "");
  if ((!groupId || groupId.startsWith("pending-")) && groupName) {
    const group = await prisma.sportGroup.findFirst({
      where: { sportId, name: groupName },
    });
    groupId = group?.id ?? null;
  }
  const round = String(formData.get("round") ?? "GROUP") || "GROUP";
  const timeStr = String(formData.get("time") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  let scheduledAt: Date | null = null;
  if (dateStr && timeStr) {
    scheduledAt = new Date(`${dateStr}T${timeStr}`);
  } else if (formData.get("scheduledAt")) {
    scheduledAt = new Date(String(formData.get("scheduledAt")));
  }

  await prisma.match.create({
    data: {
      sportId,
      groupId,
      title: String(formData.get("title") ?? "") || "Jogo",
      round,
      homeTeamId: String(formData.get("homeTeamId") ?? "") || null,
      awayTeamId: String(formData.get("awayTeamId") ?? "") || null,
      scheduledAt,
      location: String(formData.get("location") ?? "") || null,
      status: String(formData.get("status") ?? "UPCOMING") as EventStatus,
      homeScore: String(formData.get("homeScore") ?? "") || null,
      awayScore: String(formData.get("awayScore") ?? "") || null,
      detail: String(formData.get("detail") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  const sport = await prisma.sport.findUnique({ where: { id: sportId } });
  revalidatePath(`/owner/sports/${sport?.slug ?? sportId}`);
  revalidatePath("/owner/calendar");
  revalidatePath("/");
  revalidatePath("/team");
}

export async function saveCalendarMatchResultAction(
  matchId: string,
  formData: FormData
) {
  await requireOwner();
  const homeScore = String(formData.get("homeScore") ?? "");
  const awayScore = String(formData.get("awayScore") ?? "");
  const status = String(formData.get("status") ?? "FINISHED") as EventStatus;
  const timeStr = String(formData.get("time") ?? "");
  const dateStr = String(formData.get("date") ?? "");

  let scheduledAt: Date | undefined;
  if (dateStr && timeStr) {
    scheduledAt = new Date(`${dateStr}T${timeStr}`);
  }

  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore: homeScore || null,
      awayScore: awayScore || null,
      status,
      ...(scheduledAt ? { scheduledAt } : {}),
      homeTeamId: String(formData.get("homeTeamId") ?? "") || undefined,
      awayTeamId: String(formData.get("awayTeamId") ?? "") || undefined,
    },
    include: { sport: true },
  });

  revalidatePath(`/owner/calendar`);
  revalidatePath(`/owner/sports/${match.sport.slug}`);
  revalidatePath("/");
  revalidatePath("/team");
}

export async function deleteCalendarMatchAction(matchId: string) {
  await requireOwner();
  const match = await prisma.match.delete({
    where: { id: matchId },
    include: { sport: true },
  });
  revalidatePath("/owner/calendar");
  revalidatePath(`/owner/sports/${match.sport.slug}`);
  revalidatePath("/");
  revalidatePath("/team");
}

export async function updateMatchResultAction(matchId: string, formData: FormData) {
  await requireOwner();
  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore: String(formData.get("homeScore") ?? "") || null,
      awayScore: String(formData.get("awayScore") ?? "") || null,
      detail: String(formData.get("detail") ?? "") || null,
      status: String(formData.get("status") ?? "FINISHED") as EventStatus,
    },
  });

  const winnerTeamId = String(formData.get("winnerTeamId") ?? "");
  const position = Number(formData.get("position") || 0);
  if (winnerTeamId && position > 0) {
    await applyPointsForPosition(match.sportId, winnerTeamId, position);
  }
  revalidatePath(`/owner/sports/${match.sportId}`);
  revalidatePath("/owner/rankings");
  revalidatePath("/owner/calendar");
  revalidatePath("/");
  revalidatePath("/team");
}

export async function setTeamSportPositionAction(
  sportId: string,
  teamId: string,
  position: number
) {
  await requireOwner();
  await applyPointsForPosition(sportId, teamId, position);
  revalidatePath(`/owner/sports/${sportId}`);
  revalidatePath("/owner/rankings");
}

export async function createEventAction(formData: FormData) {
  await requireOwner();
  const teamIds = formData.getAll("teamIds").map(String).filter(Boolean);
  const event = await prisma.event.create({
    data: {
      title: String(formData.get("title") ?? ""),
      sportId: String(formData.get("sportId") ?? "") || null,
      date: new Date(String(formData.get("date"))),
      time: String(formData.get("time") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      status: String(formData.get("status") ?? "UPCOMING") as EventStatus,
      notes: String(formData.get("notes") ?? "") || null,
      teams: teamIds.length
        ? { create: teamIds.map((teamId) => ({ teamId })) }
        : undefined,
    },
  });
  revalidatePath("/owner/calendar");
  revalidatePath("/team/calendar");
}

export async function deleteEventAction(eventId: string) {
  await requireOwner();
  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/owner/calendar");
}

export async function updatePointsConfigAction(
  position: number,
  formData: FormData
) {
  await requireOwner();
  const points = Number(formData.get("points") ?? 0);
  const existing = await prisma.pointsConfig.findFirst({
    where: { position, sportId: null },
  });
  if (existing) {
    await prisma.pointsConfig.update({
      where: { id: existing.id },
      data: { points },
    });
  } else {
    await prisma.pointsConfig.create({ data: { position, points } });
  }
  revalidatePath("/owner/rankings");
  revalidatePath("/owner/settings");
}

export async function createPartnerAction(formData: FormData) {
  await requireOwner();
  await prisma.partner.create({
    data: {
      brandName: String(formData.get("brandName") ?? ""),
      logoUrl: String(formData.get("logoUrl") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      contactPerson: String(formData.get("contactPerson") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      partnershipType: String(formData.get("partnershipType") ?? "OFFICIAL_PARTNER") as PartnershipType,
      value: Number(formData.get("value") || 0) || null,
      benefits: String(formData.get("benefits") ?? "") || null,
      status: String(formData.get("status") ?? "PENDING") as PartnershipStatus,
      websiteUrl: String(formData.get("websiteUrl") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  revalidatePath("/owner/partnerships");
  revalidatePath("/");
}

export async function createPromotionAction(partnerId: string, formData: FormData) {
  await requireOwner();
  await prisma.promotion.create({
    data: {
      partnerId,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      code: String(formData.get("code") ?? "") || null,
      url: String(formData.get("url") ?? "") || null,
    },
  });
  revalidatePath("/owner/partnerships");
  revalidatePath("/team/partners");
}

export async function createRevenueAction(formData: FormData) {
  await requireOwner();
  await prisma.revenue.create({
    data: {
      category: String(formData.get("category") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      date: new Date(String(formData.get("date"))),
      teamId: String(formData.get("teamId") ?? "") || null,
      partnerId: String(formData.get("partnerId") ?? "") || null,
      paymentStatus: String(formData.get("paymentStatus") ?? "UNPAID") as PaymentStatus,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  revalidatePath("/owner/revenue");
  revalidatePath("/owner");
}

export async function createCostAction(formData: FormData) {
  await requireOwner();
  await prisma.cost.create({
    data: {
      category: String(formData.get("category") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      date: new Date(String(formData.get("date"))),
      paid: formData.get("paid") === "on",
      supplier: String(formData.get("supplier") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
      receiptUrl: String(formData.get("receiptUrl") ?? "") || null,
    },
  });
  revalidatePath("/owner/costs");
  revalidatePath("/owner");
}

export async function createStoreItemAction(formData: FormData) {
  await requireOwner();
  await prisma.storeItem.create({
    data: {
      name: String(formData.get("name") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      price: Number(formData.get("price") || 0) || null,
      partnerId: String(formData.get("partnerId") ?? "") || null,
      availability: String(formData.get("availability") ?? "available"),
      contactUrl: String(formData.get("contactUrl") ?? "") || null,
      active: true,
    },
  });
  revalidatePath("/owner/store");
  revalidatePath("/team/store");
}

export async function createAnnouncementAction(formData: FormData) {
  await requireOwner();
  const teamIds = formData.getAll("teamIds").map(String).filter(Boolean);
  const allTeams = formData.get("allTeams") === "on" || teamIds.length === 0;
  await prisma.announcement.create({
    data: {
      title: String(formData.get("title") ?? ""),
      message: String(formData.get("message") ?? ""),
      date: formData.get("date") ? new Date(String(formData.get("date"))) : new Date(),
      sportId: String(formData.get("sportId") ?? "") || null,
      priority: String(formData.get("priority") ?? "NORMAL") as AnnouncementPriority,
      allTeams,
      targets: allTeams
        ? undefined
        : { create: teamIds.map((teamId) => ({ teamId })) },
    },
  });
  revalidatePath("/owner/announcements");
  revalidatePath("/team/announcements");
}

export async function updateSettingsAction(formData: FormData) {
  await requireOwner();
  await prisma.tournamentSettings.update({
    where: { id: "default" },
    data: {
      name: String(formData.get("name") ?? ""),
      location: String(formData.get("location") ?? ""),
      startDate: new Date(String(formData.get("startDate"))),
      endDate: new Date(String(formData.get("endDate"))),
      maxTeams: Number(formData.get("maxTeams") ?? 12),
      maxPlayersPerTeam: Number(formData.get("maxPlayersPerTeam") ?? 10),
      registrationPrice: Number(formData.get("registrationPrice") ?? 500),
      primaryColor: String(formData.get("primaryColor") ?? "#DC2626"),
      logoUrl: String(formData.get("logoUrl") ?? "") || null,
    },
  });
  revalidatePath("/owner/settings");
}

export async function updateTeamProfileAction(formData: FormData) {
  const session = await requireTeam();
  const teamId = session.user.teamId!;
  await prisma.team.update({
    where: { id: teamId },
    data: {
      name: String(formData.get("name") ?? ""),
      captainName: String(formData.get("captainName") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      logoUrl: String(formData.get("logoUrl") ?? "") || null,
      bannerUrl: String(formData.get("bannerUrl") ?? "") || null,
    },
  });
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { email, name: String(formData.get("captainName") ?? "") },
    });
  }
  revalidatePath("/team/profile");
  revalidatePath("/team/equipa");
  revalidatePath("/team");
}

export async function updateTeamPasswordAction(password: string) {
  const session = await requireTeam();
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });
}

export async function updateOwnerAccountAction(formData: FormData) {
  const session = await requireOwner();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) throw new Error("O email é obrigatório.");

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: session.user.id } },
  });
  if (existing) throw new Error("Este email já está a ser utilizado.");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      email,
      name: name || "Organizador",
      ...(password.length >= 6
        ? { passwordHash: await bcrypt.hash(password, 12) }
        : {}),
    },
  });

  revalidatePath("/owner/settings");
}

export async function saveKartHeatAction(sportId: string, formData: FormData) {
  await requireOwner();
  const heatName = String(formData.get("heatName") ?? "");
  const order = Number(formData.get("order") ?? 0);
  let heat = await prisma.kartHeat.findFirst({
    where: { sportId, name: heatName },
  });
  if (!heat) {
    heat = await prisma.kartHeat.create({
      data: { sportId, name: heatName, order },
    });
  }
  const teamIds = formData.getAll("teamId").map(String);
  const positions = formData.getAll("position").map((v) => Number(v));
  const points = formData.getAll("points").map((v) => Number(v));
  await prisma.kartResult.deleteMany({ where: { heatId: heat.id } });
  for (let i = 0; i < teamIds.length; i++) {
    if (!teamIds[i]) continue;
    await prisma.kartResult.create({
      data: {
        heatId: heat.id,
        teamId: teamIds[i],
        position: positions[i] || i + 1,
        points: points[i] || 0,
      },
    });
  }
  await recalculateKartPoints(sportId);
  revalidatePath(`/owner/sports/${sportId}`);
  revalidatePath("/owner/rankings");
}
