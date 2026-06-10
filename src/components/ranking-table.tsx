import { TeamAvatar } from "@/components/ui/team-avatar";
import type { RankingEntry } from "@/lib/rankings";

export function RankingTable({
  entries,
  highlightTeamId,
}: {
  entries: RankingEntry[];
  highlightTeamId?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Equipa</th>
            <th className="px-4 py-3 font-medium">Pontos</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.teamId}
              className={
                entry.teamId === highlightTeamId
                  ? "bg-red-500/10"
                  : "border-t border-white/5"
              }
            >
              <td className="px-4 py-4 font-semibold text-zinc-300">
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
              <td className="px-4 py-4 font-bold text-red-400">
                {entry.totalPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
