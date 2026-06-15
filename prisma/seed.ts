import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_POINTS, SPORTS, TOURNAMENT } from "../src/lib/constants";

const prisma = new PrismaClient();

const OWNER_EMAIL = "organizador@torneio5desportos.pt";
const OWNER_PASSWORD = "Torneio5Braga";

async function main() {
  await prisma.tournamentSettings.upsert({
    where: { id: "default" },
    update: {
      name: TOURNAMENT.name,
      logoUrl: TOURNAMENT.logoUrl,
      startDate: new Date(TOURNAMENT.startDate),
      endDate: new Date(TOURNAMENT.endDate),
    },
    create: {
      id: "default",
      name: TOURNAMENT.name,
      location: "Braga",
      logoUrl: TOURNAMENT.logoUrl,
      startDate: new Date(TOURNAMENT.startDate),
      endDate: new Date(TOURNAMENT.endDate),
      maxTeams: 12,
      maxPlayersPerTeam: 10,
      registrationPrice: 500,
      primaryColor: "#DC2626",
    },
  });

  const ownerPasswordHash = await bcrypt.hash(OWNER_PASSWORD, 12);

  // Remove conta antiga se existir
  await prisma.user.deleteMany({
    where: { email: "owner@torneio5desportos.pt", role: "OWNER" },
  });

  await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: {
      name: "Organizador",
      passwordHash: ownerPasswordHash,
      role: "OWNER",
    },
    create: {
      email: OWNER_EMAIL,
      name: "Organizador",
      passwordHash: ownerPasswordHash,
      role: "OWNER",
    },
  });

  await prisma.sport.deleteMany({ where: { slug: "tenis" } });

  for (const sport of SPORTS) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: {
        format: sport.format,
        name: sport.name,
        date: new Date(sport.date),
      },
      create: {
        slug: sport.slug,
        name: sport.name,
        format: sport.format,
        date: new Date(sport.date),
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

  console.log("Conta de organizador pronta:");
  console.log(`  Email: ${OWNER_EMAIL}`);
  console.log(`  Palavra-passe: ${OWNER_PASSWORD}`);
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
