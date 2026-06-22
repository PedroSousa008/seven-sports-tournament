"use client";

import { TeamAvatar } from "@/components/ui/team-avatar";
import type { RankingEntry } from "@/lib/rankings";

const SPORT_COLUMNS = [
  { slug: "futebol7", label: "Futebol" },
  { slug: "padel", label: "Padel" },
  { slug: "voleibol", label: "Voleibol" },
  { slug: "karts", label: "Karts" },
] as const;

function positionStyle(position: number) {
  if (position === 1) return "text-amber-400";
  if (position === 2) return "text-zinc-300";
  if (position === 3) return "text-orange-400";
  return "text-zinc-500";
}

function sportPoints(entry: RankingEntry, slug: string) {
  return entry.sportBreakdown.find((item) => item.sportSlug === slug)?.points ?? 0;
}

export function GlobalLeaderboardTable({
  entries,
}: {
  entries: RankingEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-zinc-500">
        Ainda não há pontos atribuídos. Guarda as classificações por desporto
        para atualizar o ranking global.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Equipa</th>
              {SPORT_COLUMNS.map((sport) => (
                <th key={sport.slug} className="px-4 py-3 font-semibold">
                  {sport.label}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-red-400">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.teamId} className="border-t border-white/5">
                <td
                  className={`px-4 py-4 font-display text-xl ${positionStyle(entry.position)}`}
                >
                  {entry.position}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <TeamAvatar
                      name={entry.teamName}
                      color={entry.teamColor}
                      logoUrl={entry.logoUrl}
                    />
                    <span className="font-medium text-white">{entry.teamName}</span>
                  </div>
                </td>
                {SPORT_COLUMNS.map((sport) => (
                  <td key={sport.slug} className="px-4 py-4 text-zinc-300">
                    {sportPoints(entry, sport.slug)}
                  </td>
                ))}
                <td className="px-4 py-4 font-bold text-red-400">
                  {entry.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {entries.map((entry) => (
          <div
            key={entry.teamId}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`font-display text-2xl ${positionStyle(entry.position)}`}
              >
                #{entry.position}
              </span>
              <TeamAvatar
                name={entry.teamName}
                color={entry.teamColor}
                logoUrl={entry.logoUrl}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">
                  {entry.teamName}
                </p>
                <p className="text-sm font-bold text-red-400">
                  {entry.totalPoints} pts
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {SPORT_COLUMNS.map((sport) => (
                <div
                  key={sport.slug}
                  className="rounded-lg border border-white/10 bg-black/30 px-3 py-2"
                >
                  <p className="text-zinc-500">{sport.label}</p>
                  <p className="font-semibold text-white">
                    {sportPoints(entry, sport.slug)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
