import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_POINTS, SPORTS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  await prisma.tournamentSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Torneio 5 Desportos Braga",
      location: "Braga",
      startDate: new Date("2026-07-04"),
      endDate: new Date("2026-07-09"),
      maxTeams: 12,
      maxPlayersPerTeam: 10,
      registrationPrice: 500,
      primaryColor: "#DC2626",
    },
  });

  const ownerPassword = await bcrypt.hash("owner2026", 12);
  await prisma.user.upsert({
    where: { email: "owner@torneio5desportos.pt" },
    update: {},
    create: {
      email: "owner@torneio5desportos.pt",
      name: "Organizador do Torneio",
      passwordHash: ownerPassword,
      role: "OWNER",
    },
  });

  for (const sport of SPORTS) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: {
        format: sport.format,
        name: sport.name,
      },
      create: {
        slug: sport.slug,
        name: sport.name,
        format: sport.format,
        location: "Braga",
        rules: `Regras oficiais de ${sport.name}.`,
      },
    });
  }

  for (const row of DEFAULT_POINTS) {
    const existing = await prisma.pointsConfig.findFirst({
      where: { position: row.position, sportId: null },
    });
    if (existing) {
      await prisma.pointsConfig.update({
        where: { id: existing.id },
        data: { points: row.points },
      });
    } else {
      await prisma.pointsConfig.create({
        data: { position: row.position, points: row.points },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
