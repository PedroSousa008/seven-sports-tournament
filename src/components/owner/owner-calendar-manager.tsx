"use client";

import { useMemo, useState } from "react";
import type { SportCalendarData } from "@/lib/calendar";
import { CALENDAR_SPORT_TABS } from "@/lib/sport-formats";
import { OwnerSportSchedule } from "./owner-sport-schedule";

type Team = { id: string; name: string; logoUrl: string | null; color: string };

export function OwnerCalendarManager({
  calendars,
  teams,
  initialSlug = "futebol7",
}: {
  calendars: SportCalendarData[];
  teams: Team[];
  initialSlug?: string;
}) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const calendar = useMemo(
    () => calendars.find((c) => c.slug === activeSlug),
    [calendars, activeSlug]
  );

  if (!calendar) return null;

  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CALENDAR_SPORT_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setActiveSlug(tab.slug)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold ${
              activeSlug === tab.slug
                ? "bg-red-600 text-white"
                : "border border-white/10 text-zinc-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <OwnerSportSchedule calendar={calendar} teams={teams} />
    </div>
  );
}
