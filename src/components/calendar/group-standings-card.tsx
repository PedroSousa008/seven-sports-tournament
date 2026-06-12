import { TeamAvatar } from "@/components/ui/team-avatar";
import type { GroupCalendar, SportCalendarData } from "@/lib/calendar";

export function GroupStandingsCard({
  group,
  format,
  highlightTeamId,
}: {
  group: GroupCalendar;
  format: SportCalendarData["format"];
  highlightTeamId?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <h3 className="font-display text-lg tracking-wide text-white">
          {group.name}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-2">{group.name}</th>
              <th className="px-2 py-2 text-center">{format.diffLabel}</th>
              <th className="px-4 py-2 text-right">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {group.standings.length ? (
              group.standings.map((row) => (
                <tr
                  key={row.teamId}
                  className={`border-t border-white/5 ${
                    row.qualified
                      ? "bg-emerald-500/10"
                      : row.teamId === highlightTeamId
                        ? "bg-red-500/10"
                        : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-xs text-zinc-600">
                        {row.position}
                      </span>
                      <TeamAvatar
                        name={row.teamName}
                        color={row.color}
                        logoUrl={row.logoUrl}
                        size="sm"
                      />
                      <span
                        className={`font-medium ${
                          row.teamId === highlightTeamId
                            ? "text-red-300"
                            : "text-white"
                        }`}
                      >
                        {row.teamName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center font-mono text-zinc-300">
                    {row.diff > 0 ? `+${row.diff}` : row.diff}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    {row.points}
                  </td>
                </tr>
              ))
            ) : (
              group.teams.map((team, i) => (
                <tr key={team.id} className="border-t border-white/5">
                  <td className="px-4 py-3" colSpan={3}>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-xs text-zinc-600">{i + 1}</span>
                      <TeamAvatar
                        name={team.name}
                        color={team.color}
                        logoUrl={team.logoUrl}
                        size="sm"
                      />
                      <span className="text-white">{team.name}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!group.teams.length ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-zinc-600">
                  Sem equipas atribuídas
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {group.matches.length > 0 ? (
        <div className="space-y-2 border-t border-white/10 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Jogos do grupo
          </p>
        </div>
      ) : null}
    </div>
  );
}
