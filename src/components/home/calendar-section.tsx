import { SportCalendarView } from "@/components/calendar/sport-calendar-view";
import { FadeIn } from "./fade-in";
import { TOURNAMENT } from "@/lib/constants";
import type { SportCalendarData } from "@/lib/calendar";

export function CalendarSection({
  calendars,
}: {
  calendars: SportCalendarData[];
}) {
  return (
    <section id="calendario" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            Calendário
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            CALENDÁRIO {TOURNAMENT.name.toUpperCase()}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Consulta os grupos, horários, jogos e fases finais de cada
            modalidade.
          </p>
        </FadeIn>

        <SportCalendarView calendars={calendars} showDownload />
      </div>
    </section>
  );
}
