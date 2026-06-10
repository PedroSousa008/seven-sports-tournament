import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { eventStatusLabels, label } from "@/lib/labels";
import { requireSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function TeamCalendarPage() {
  const session = await requireSession("TEAM");
  const teamId = session.user.teamId!;

  const events = await prisma.event.findMany({
    where: {
      OR: [{ teams: { none: {} } }, { teams: { some: { teamId } } }],
    },
    include: { sport: true, teams: { include: { team: true } } },
    orderBy: { date: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Calendário"
        description="Calendário completo do torneio com os eventos da sua equipa."
      />

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-white">{event.title}</p>
                <Badge
                  variant={
                    event.status === "LIVE"
                      ? "live"
                      : event.status === "FINISHED"
                        ? "success"
                        : "default"
                  }
                >
                  {label(eventStatusLabels, event.status)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                {formatDate(event.date)}
                {event.time ? ` · ${event.time}` : ""}
                {event.location ? ` · ${event.location}` : ""}
              </p>
              {event.sport ? <Badge className="mt-2">{event.sport.name}</Badge> : null}
              {event.notes ? (
                <p className="mt-3 text-sm text-zinc-500">{event.notes}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
