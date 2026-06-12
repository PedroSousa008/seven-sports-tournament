import { notFound } from "next/navigation";
import { TeamAvatar } from "@/components/ui/team-avatar";
import {
  calendarDownloadTitle,
  getSportCalendar,
} from "@/lib/calendar";
import { TOURNAMENT } from "@/lib/constants";
import { KNOCKOUT_LABELS } from "@/lib/sport-formats";
import { CalendarPrintButton } from "@/components/calendar/calendar-print-button";

export default async function CalendarDownloadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calendar = await getSportCalendar(slug);
  if (!calendar || calendar.isPlaceholder) notFound();

  return (
    <div className="min-h-screen bg-black text-white print:bg-white print:text-black">
      <div className="no-print fixed right-4 top-4 z-50">
        <CalendarPrintButton />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 print:px-8 print:py-10">
        <header className="border-b border-red-600 pb-6 print:border-black">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-red-500 print:text-red-700">
            {TOURNAMENT.name}
          </p>
          <h1 className="font-display mt-2 text-4xl tracking-wide">
            Calendário — {calendar.format.label}
          </h1>
          <p className="mt-2 text-sm text-zinc-400 print:text-zinc-600">
            {TOURNAMENT.dateRange} · Braga
          </p>
        </header>

        {calendar.groups.map((group) => (
          <section key={group.id} className="mt-10 break-inside-avoid">
            <h2 className="font-display text-2xl text-red-500 print:text-red-700">
              {group.name}
            </h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 text-left text-xs uppercase print:border-black">
                  <th className="py-2">{group.name}</th>
                  <th className="py-2 text-center">{calendar.format.diffLabel}</th>
                  <th className="py-2 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {group.standings.map((row) => (
                  <tr
                    key={row.teamId}
                    className={`border-b border-white/10 print:border-zinc-200 ${
                      row.qualified ? "bg-emerald-500/10 print:bg-emerald-50" : ""
                    }`}
                  >
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <TeamAvatar
                          name={row.teamName}
                          color={row.color}
                          logoUrl={row.logoUrl}
                          size="sm"
                        />
                        {row.teamName}
                      </div>
                    </td>
                    <td className="py-2 text-center">{row.diff > 0 ? `+${row.diff}` : row.diff}</td>
                    <td className="py-2 text-right font-bold">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-2">
              {group.matches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2 text-sm print:border-zinc-300"
                >
                  <span>{match.timeLabel}</span>
                  <span>
                    {match.homeTeam?.name ?? "—"}{" "}
                    {match.homeScore ?? "_"}-{match.awayScore ?? "_"}{" "}
                    {match.awayTeam?.name ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {calendar.knockout.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl text-red-500 print:text-red-700">
              Fase Eliminatória
            </h2>
            <div className="mt-4 space-y-3">
              {calendar.knockout.map((match) => (
                <div
                  key={match.id}
                  className="rounded-lg border border-white/10 px-4 py-3 print:border-zinc-300"
                >
                  <p className="text-xs uppercase text-zinc-500">
                    {KNOCKOUT_LABELS[match.round as keyof typeof KNOCKOUT_LABELS] ?? match.round}
                  </p>
                  <p className="mt-1 font-semibold">
                    {match.homeTeam?.name ?? "—"}{" "}
                    {match.homeScore ?? "_"}-{match.awayScore ?? "_"}{" "}
                    {match.awayTeam?.name ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-zinc-600 print:border-zinc-300">
          {calendarDownloadTitle(slug)} · Gerado em{" "}
          {new Date().toLocaleDateString("pt-PT")}
        </footer>
      </div>
    </div>
  );
}
