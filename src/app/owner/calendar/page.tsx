import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createEventAction, deleteEventAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { eventStatusLabels, label } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

const viewLabels: Record<string, string> = {
  list: "Lista",
  month: "Mês",
  week: "Semana",
  day: "Dia",
};

export default async function OwnerCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view = "list" } = await searchParams;
  const [events, sports, teams] = await Promise.all([
    prisma.event.findMany({
      include: {
        sport: true,
        teams: { include: { team: true } },
      },
      orderBy: { date: "asc" },
    }),
    prisma.sport.findMany(),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  const now = new Date();
  const monthEvents = events.filter(
    (event) =>
      event.date.getMonth() === now.getMonth() &&
      event.date.getFullYear() === now.getFullYear()
  );
  const weekEvents = events.filter((event) => {
    const diff = Math.abs(event.date.getTime() - now.getTime());
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });
  const dayEvents = events.filter(
    (event) => event.date.toDateString() === now.toDateString()
  );

  const visibleEvents =
    view === "month"
      ? monthEvents
      : view === "week"
        ? weekEvents
        : view === "day"
          ? dayEvents
          : events;

  return (
    <div>
      <PageHeader
        title="Calendário"
        description="Cria e gere eventos do torneio visíveis para as equipas atribuídas."
        action={
          <div className="flex flex-wrap gap-2">
            {["list", "month", "week", "day"].map((item) => (
              <a
                key={item}
                href={`/owner/calendar?view=${item}`}
                className={`rounded-xl px-3 py-2 text-sm ${
                  view === item
                    ? "bg-red-600 text-white"
                    : "border border-white/10 text-zinc-400"
                }`}
              >
                {viewLabels[item]}
              </a>
            ))}
          </div>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Criar evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEventAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Título</Label>
              <Input name="title" required />
            </div>
            <div>
              <Label>Desporto</Label>
              <Select name="sportId" defaultValue="">
                <option value="">Evento geral</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input name="date" type="date" required />
            </div>
            <div>
              <Label>Hora</Label>
              <Input name="time" placeholder="14:30" />
            </div>
            <div>
              <Label>Local</Label>
              <Input name="location" />
            </div>
            <div>
              <Label>Estado</Label>
              <Select name="status" defaultValue="UPCOMING">
                <option value="UPCOMING">{eventStatusLabels.UPCOMING}</option>
                <option value="LIVE">{eventStatusLabels.LIVE}</option>
                <option value="FINISHED">{eventStatusLabels.FINISHED}</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Equipas (deixar vazio para todas as equipas)</Label>
              <select
                name="teamIds"
                multiple
                className="min-h-28 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Notas</Label>
              <Textarea name="notes" />
            </div>
            <Button type="submit">Criar evento</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {visibleEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
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
                {event.sport ? (
                  <Badge className="mt-2">{event.sport.name}</Badge>
                ) : null}
                <p className="mt-3 text-sm text-zinc-300">
                  Equipas:{" "}
                  {event.teams.length
                    ? event.teams.map((item) => item.team.name).join(", ")
                    : "Todas as equipas"}
                </p>
                {event.notes ? (
                  <p className="mt-2 text-sm text-zinc-500">{event.notes}</p>
                ) : null}
              </div>
              <form action={deleteEventAction.bind(null, event.id)}>
                <Button type="submit" variant="ghost">
                  Eliminar
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {!visibleEvents.length ? (
          <Card>
            <CardContent className="py-10 text-center text-zinc-500">
              Sem eventos nesta vista.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
