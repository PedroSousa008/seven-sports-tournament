import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Settings2 } from "lucide-react";
import { OwnerSportSchedule } from "@/components/owner/owner-sport-schedule";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { getSportCalendar } from "@/lib/calendar";
import { updateSportAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { SPORT_FORMATS, KNOCKOUT_LABELS } from "@/lib/sport-formats";
import { formatDate } from "@/lib/utils";

export default async function OwnerSportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [sport, calendar, teams] = await Promise.all([
    prisma.sport.findUnique({ where: { slug } }),
    getSportCalendar(slug),
    prisma.team.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, logoUrl: true, color: true },
    }),
  ]);

  if (!sport || !calendar) notFound();

  const format = SPORT_FORMATS[slug];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/owner/sports"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar aos desportos
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-wide text-white">
              {sport.name}
            </h1>
            <p className="mt-2 text-zinc-400">
              {sport.date ? formatDate(sport.date) : "Data a definir"}
              {sport.time ? ` · ${sport.time}` : ""}
              {sport.location ? ` · ${sport.location}` : ""}
            </p>
            {format && !format.placeholder ? (
              <p className="mt-1 text-sm text-zinc-500">
                {format.groups.length} grupos ·{" "}
                {format.qualifiersPerGroup === 1
                  ? "1º qualifica"
                  : `Top ${format.qualifiersPerGroup} qualificam`}{" "}
                · {format.knockoutRounds.map((r) => KNOCKOUT_LABELS[r]).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <details className="group rounded-2xl border border-white/10 bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-semibold text-zinc-400 transition hover:text-white [&::-webkit-details-marker]:hidden">
          <Settings2 className="h-4 w-4" />
          Definições do desporto
          <span className="ml-auto text-xs text-zinc-600 group-open:hidden">
            Data, hora, local, regras
          </span>
        </summary>
        <form
          action={updateSportAction.bind(null, sport.id)}
          className="space-y-4 border-t border-white/10 px-5 py-5"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Data</Label>
              <Input
                name="date"
                type="date"
                defaultValue={
                  sport.date ? sport.date.toISOString().slice(0, 10) : ""
                }
              />
            </div>
            <div>
              <Label>Hora</Label>
              <Input name="time" defaultValue={sport.time ?? ""} placeholder="09:00" />
            </div>
            <div>
              <Label>Local</Label>
              <Input name="location" defaultValue={sport.location ?? ""} />
            </div>
          </div>
          <div>
            <Label>Regras</Label>
            <Textarea name="rules" defaultValue={sport.rules ?? ""} rows={2} />
          </div>
          <div>
            <Label>Formato (texto público)</Label>
            <Textarea name="format" defaultValue={sport.format ?? ""} rows={2} />
          </div>
          <div>
            <Label>Notas internas</Label>
            <Textarea name="notes" defaultValue={sport.notes ?? ""} rows={2} />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Guardar definições
          </Button>
        </form>
      </details>

      <OwnerSportSchedule calendar={calendar} teams={teams} />
    </div>
  );
}
