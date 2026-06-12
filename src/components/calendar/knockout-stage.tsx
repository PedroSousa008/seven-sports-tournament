import { MatchCard } from "./match-card";
import type { KnockoutMatch, SportCalendarData } from "@/lib/calendar";
import { getKnockoutPlaceholders } from "@/lib/calendar";
import { KNOCKOUT_LABELS, type KnockoutRound } from "@/lib/sport-formats";

export function KnockoutStage({
  calendar,
  highlightTeamId,
}: {
  calendar: SportCalendarData;
  highlightTeamId?: string;
}) {
  const rounds = calendar.format.knockoutRounds;
  const placeholders = getKnockoutPlaceholders(calendar.format, calendar.groups);

  const matchesByRound = rounds.reduce(
    (acc, round) => {
      acc[round] = calendar.knockout.filter((m) => m.round === round);
      return acc;
    },
    {} as Record<KnockoutRound, KnockoutMatch[]>
  );

  return (
    <div className="space-y-8">
      {rounds.map((round) => {
        const matches = matchesByRound[round];
        const roundPlaceholders = placeholders.filter((p) => p.round === round);

        return (
          <div key={round}>
            <h3 className="font-display mb-4 text-xl tracking-wide text-white">
              {KNOCKOUT_LABELS[round]}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {matches.length
                ? matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      highlightTeamId={highlightTeamId}
                    />
                  ))
                : roundPlaceholders.map((p, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center"
                    >
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        {p.label}
                      </p>
                      <p className="mt-3 font-semibold text-white">
                        {p.home}{" "}
                        <span className="text-zinc-600">vs</span> {p.away}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
