import { TeamAvatar } from "@/components/ui/team-avatar";
import type { RankingEntry } from "@/lib/rankings";
import { LeaderboardClient } from "./leaderboard-client";

export function LeaderboardSection({
  ranking,
}: {
  ranking: RankingEntry[];
}) {
  const top5 = ranking.slice(0, 5);

  return (
    <section id="classificacao" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <LeaderboardClient top5={top5} />
      </div>
    </section>
  );
}

export function LeaderboardRow({
  entry,
  index,
}: {
  entry: RankingEntry;
  index: number;
}) {
  const medals = ["", "text-amber-400", "text-zinc-300", "text-orange-400"];

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur transition hover:border-red-500/30 hover:bg-white/[0.06]">
      <div
        className={`flex h-12 w-12 items-center justify-center font-display text-2xl ${
          index < 3 ? medals[index + 1] : "text-zinc-500"
        }`}
      >
        {entry.position}
      </div>

      <TeamAvatar
        name={entry.teamName}
        color={entry.teamColor}
        logoUrl={entry.logoUrl}
        size="md"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-white">
          {entry.teamName}
        </p>
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          {entry.totalPoints > 0 ? "Em competição" : "À espera do arranque"}
        </p>
      </div>

      <div className="text-right">
        <p className="font-display text-3xl text-red-400">{entry.totalPoints}</p>
        <p className="text-xs uppercase tracking-wider text-zinc-500">pts</p>
      </div>
    </div>
  );
}
