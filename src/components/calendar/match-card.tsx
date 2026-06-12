import { TeamAvatar } from "@/components/ui/team-avatar";
import type { MatchInfo } from "@/lib/calendar";
import { eventStatusLabels, label } from "@/lib/labels";

export function MatchCard({
  match,
  highlightTeamId,
  compact = false,
}: {
  match: MatchInfo;
  highlightTeamId?: string;
  compact?: boolean;
}) {
  const homeHighlight = match.homeTeam?.id === highlightTeamId;
  const awayHighlight = match.awayTeam?.id === highlightTeamId;
  const hasScore =
    match.homeScore !== null &&
    match.homeScore !== "" &&
    match.awayScore !== null &&
    match.awayScore !== "";

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white/[0.03] transition ${
        homeHighlight || awayHighlight
          ? "border-red-500/40 shadow-lg shadow-red-600/10"
          : "border-white/10"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
          {match.timeLabel || "—"}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            match.status === "LIVE"
              ? "bg-red-600 text-white"
              : match.status === "FINISHED"
                ? "bg-emerald-600/20 text-emerald-400"
                : "bg-white/10 text-zinc-400"
          }`}
        >
          {label(eventStatusLabels, match.status)}
        </span>
      </div>
      {match.groupName || match.round ? (
        <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">
          {match.groupName ?? match.round}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <div
          className={`flex min-w-0 flex-1 items-center gap-2 ${
            homeHighlight ? "text-red-300" : "text-white"
          }`}
        >
          {match.homeTeam ? (
            <>
              <TeamAvatar
                name={match.homeTeam.name}
                color={match.homeTeam.color}
                logoUrl={match.homeTeam.logoUrl}
                size="sm"
              />
              <span className="truncate text-sm font-semibold">
                {match.homeTeam.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-zinc-500">A definir</span>
          )}
        </div>

        <div className="shrink-0 px-2 text-center">
          <p className="font-display text-xl text-white">
            {hasScore ? (
              <>
                {match.homeScore}
                <span className="mx-1 text-zinc-600">-</span>
                {match.awayScore}
              </>
            ) : (
              <span className="text-zinc-600">_ - _</span>
            )}
          </p>
        </div>

        <div
          className={`flex min-w-0 flex-1 items-center justify-end gap-2 text-right ${
            awayHighlight ? "text-red-300" : "text-white"
          }`}
        >
          {match.awayTeam ? (
            <>
              <span className="truncate text-sm font-semibold">
                {match.awayTeam.name}
              </span>
              <TeamAvatar
                name={match.awayTeam.name}
                color={match.awayTeam.color}
                logoUrl={match.awayTeam.logoUrl}
                size="sm"
              />
            </>
          ) : (
            <span className="text-sm text-zinc-500">A definir</span>
          )}
        </div>
      </div>
    </article>
  );
}
