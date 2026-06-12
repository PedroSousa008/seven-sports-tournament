import { PageHeader } from "@/components/layout/page-header";
import { OwnerCalendarManager } from "@/components/owner/owner-calendar-manager";
import { getAllSportCalendars } from "@/lib/calendar";
import { prisma } from "@/lib/db";

export default async function OwnerCalendarPage() {
  const [calendars, teams] = await Promise.all([
    getAllSportCalendars(),
    prisma.team.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, logoUrl: true, color: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Calendário & Resultados"
        description="Gere grupos, horários, jogos e fases eliminatórias de cada modalidade."
      />
      <OwnerCalendarManager calendars={calendars} teams={teams} />
    </div>
  );
}
