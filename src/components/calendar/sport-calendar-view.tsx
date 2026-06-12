"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import type { SportCalendarData } from "@/lib/calendar";
import { CALENDAR_SPORT_TABS } from "@/lib/sport-formats";
import { GroupStandingsCard } from "./group-standings-card";
import { KnockoutStage } from "./knockout-stage";
import { MatchCard } from "./match-card";

export function SportCalendarView({
  calendars,
  initialSlug = "futebol7",
  highlightTeamId,
  showDownload = true,
  compact = false,
}: {
  calendars: SportCalendarData[];
  initialSlug?: string;
  highlightTeamId?: string;
  showDownload?: boolean;
  compact?: boolean;
}) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const calendar = calendars.find((c) => c.slug === activeSlug) ?? calendars[0];

  if (!calendar) return null;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CALENDAR_SPORT_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setActiveSlug(tab.slug)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeSlug === tab.slug
                ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                : "border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showDownload && !calendar.isPlaceholder ? (
        <div className="mt-4 flex justify-end">
          <Link
            href={`/calendario/${calendar.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-red-500/40 hover:bg-red-500/10"
          >
            <Download className="h-4 w-4" />
            Descarregar calendário
          </Link>
        </div>
      ) : null}

      {calendar.isPlaceholder ? (
        <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
          <p className="font-display text-2xl text-white">Karts</p>
          <p className="mt-3 text-zinc-400">
            Formato dos Karts em preparação.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Heats, qualificação, final e pontuação serão adicionados em breve.
          </p>
        </div>
      ) : (
        <div className={`mt-6 space-y-10 ${compact ? "" : ""}`}>
          <section>
            <h3 className="font-display mb-4 text-xl tracking-wide text-white">
              Fase de Grupos
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {calendar.groups.map((group) => (
                <div key={group.id} className="space-y-3">
                  <GroupStandingsCard
                    group={group}
                    format={calendar.format}
                    highlightTeamId={highlightTeamId}
                  />
                  <div className="space-y-2">
                    {group.matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        highlightTeamId={highlightTeamId}
                        compact
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {calendar.format.knockoutRounds.length > 0 ? (
            <section>
              <h3 className="font-display mb-4 text-xl tracking-wide text-white">
                Fase Eliminatória
              </h3>
              <KnockoutStage
                calendar={calendar}
                highlightTeamId={highlightTeamId}
              />
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
