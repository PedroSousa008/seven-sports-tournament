"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  BarChart3,
  CheckCircle2,
  Save,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalLeaderboardTable } from "@/components/owner/global-leaderboard-table";
import { TeamSearchSelect } from "@/components/owner/team-search-select";
import {
  saveKartRaceAction,
  saveSportPointsConfigAction,
  saveSportRankingAction,
} from "@/lib/actions";
import type { OwnerRankingsData } from "@/lib/owner-rankings";
import type { KartTotalEntry } from "@/lib/rankings";
import { TeamAvatar } from "@/components/ui/team-avatar";

type RankingRow = {
  position: number;
  points: number;
  teamId: string | null;
  useX2?: boolean;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

const SPORT_ICONS: Record<string, string> = {
  futebol7: "⚽",
  padel: "🎾",
  voleibol: "🏐",
  karts: "🏎️",
};

function positionBadgeClass(position: number) {
  if (position === 1) return "border-amber-500/40 bg-amber-500/10 text-amber-300";
  if (position === 2) return "border-zinc-400/30 bg-zinc-400/10 text-zinc-200";
  if (position === 3) return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  return "border-white/10 bg-white/5 text-zinc-400";
}

function buildRows(
  pointsConfig: { position: number; points: number }[],
  slots: RankingRow[]
): RankingRow[] {
  return pointsConfig.map((config) => {
    const slot = slots.find((row) => row.position === config.position);
    return {
      position: config.position,
      points: slot?.points ?? config.points,
      teamId: slot?.teamId ?? null,
      useX2: slot?.useX2 ?? false,
    };
  });
}

function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${
        toast.type === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : "border-red-500/30 bg-red-500/10 text-red-200"
      }`}
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-sm">{toast.message}</p>
    </div>
  );
}

export function OwnerRankingsManager({ data }: { data: OwnerRankingsData }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activePointsSport, setActivePointsSport] = useState(
    data.sportSections[0]?.sport.id ?? data.karts?.sportId ?? ""
  );
  const [kartTab, setKartTab] = useState<"race-0" | "race-1" | "race-2" | "total">(
    "race-0"
  );

  const [pointsConfigs, setPointsConfigs] = useState(() => {
    const map: Record<string, { position: number; points: number }[]> = {};
    for (const section of data.sportSections) {
      map[section.sport.id] = section.pointsConfig;
    }
    if (data.karts) map[data.karts.sportId] = data.karts.pointsConfig;
    return map;
  });

  const [sportRankings, setSportRankings] = useState(() => {
    const map: Record<string, RankingRow[]> = {};
    for (const section of data.sportSections) {
      map[section.sport.id] = buildRows(section.pointsConfig, section.slots);
    }
    return map;
  });

  const [kartRaces, setKartRaces] = useState(() => {
    if (!data.karts) return {};
    const map: Record<string, RankingRow[]> = {};
    for (const heat of data.karts.heats) {
      map[heat.id] = data.karts.pointsConfig.map((config) => {
        const result = heat.results.find(
          (item) => item.position === config.position
        );
        return {
          position: config.position,
          points: result?.points ?? config.points,
          teamId: result?.teamId ?? null,
          useX2: result?.useX2 ?? false,
        };
      });
    }
    return map;
  });

  const [kartTotals] = useState<KartTotalEntry[]>(data.karts?.totals ?? []);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const allPointsSports = useMemo(() => {
    const items = data.sportSections.map((section) => section.sport);
    if (data.karts) {
      items.push({ id: data.karts.sportId, slug: "karts", name: "Karts" });
    }
    return items;
  }, [data]);

  function showError(error: unknown) {
    setToast({
      type: "error",
      message:
        error instanceof Error ? error.message : "Não foi possível guardar.",
    });
  }

  function savePointsConfig(sportId: string) {
    startTransition(async () => {
      try {
        await saveSportPointsConfigAction(
          sportId,
          JSON.stringify(pointsConfigs[sportId] ?? [])
        );
        setToast({
          type: "success",
          message: "Sistema de pontos atualizado com sucesso.",
        });
      } catch (error) {
        showError(error);
      }
    });
  }

  function saveSportRanking(sportId: string, sportName: string) {
    const rows = sportRankings[sportId] ?? [];
    const assigned = rows
      .map((row) => row.teamId)
      .filter((teamId): teamId is string => Boolean(teamId));
    if (new Set(assigned).size !== assigned.length) {
      setToast({
        type: "error",
        message: "Esta equipa já foi atribuída a outra posição neste desporto.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const message = await saveSportRankingAction(
          sportId,
          sportName,
          JSON.stringify(rows)
        );
        setToast({ type: "success", message });
        router.refresh();
      } catch (error) {
        showError(error);
      }
    });
  }

  function saveKartRace(heatId: string, raceName: string) {
    if (!data.karts) return;
    const rows = kartRaces[heatId] ?? [];
    const assigned = rows
      .map((row) => row.teamId)
      .filter((teamId): teamId is string => Boolean(teamId));
    if (new Set(assigned).size !== assigned.length) {
      setToast({
        type: "error",
        message: "Esta equipa já foi atribuída a outra posição neste desporto.",
      });
      return;
    }

    const x2Teams = rows.filter((row) => row.useX2 && row.teamId).map((row) => row.teamId);
    if (new Set(x2Teams).size !== x2Teams.length) {
      setToast({
        type: "error",
        message: "Esta equipa já utilizou o x2 nos Karts.",
      });
      return;
    }

    for (const row of rows) {
      if (!row.teamId || !row.useX2) continue;
      const usedElsewhere = Object.entries(kartRaces).some(([id, raceRows]) => {
        if (id === heatId) return false;
        return raceRows.some(
          (item) => item.teamId === row.teamId && item.useX2
        );
      });
      if (usedElsewhere) {
        setToast({
          type: "error",
          message: "Esta equipa já utilizou o x2 nos Karts.",
        });
        return;
      }
    }

    startTransition(async () => {
      try {
        const message = await saveKartRaceAction(
          data.karts!.sportId,
          heatId,
          raceName,
          JSON.stringify(rows)
        );
        setToast({ type: "success", message });
        router.refresh();
      } catch (error) {
        showError(error);
      }
    });
  }

  function updateSportRow(
    sportId: string,
    position: number,
    patch: Partial<RankingRow>
  ) {
    setSportRankings((prev) => ({
      ...prev,
      [sportId]: (prev[sportId] ?? []).map((row) =>
        row.position === position ? { ...row, ...patch } : row
      ),
    }));
  }

  function updateKartRow(
    heatId: string,
    position: number,
    patch: Partial<RankingRow>
  ) {
    setKartRaces((prev) => ({
      ...prev,
      [heatId]: (prev[heatId] ?? []).map((row) =>
        row.position === position ? { ...row, ...patch } : row
      ),
    }));
  }

  function applyConfigPointsToSportRanking(sportId: string) {
    const config = pointsConfigs[sportId] ?? [];
    setSportRankings((prev) => ({
      ...prev,
      [sportId]: (prev[sportId] ?? []).map((row) => {
        const pointsRow = config.find((item) => item.position === row.position);
        return {
          ...row,
          points: pointsRow?.points ?? row.points,
        };
      }),
    }));
  }

  function renderRankingRows(
    rows: RankingRow[],
    onUpdate: (position: number, patch: Partial<RankingRow>) => void,
    options?: {
      heatId?: string;
      showMultiplier?: boolean;
      allKartRaces?: Record<string, RankingRow[]>;
    }
  ) {
    const disabledTeams = rows
      .map((row) => row.teamId)
      .filter((teamId): teamId is string => Boolean(teamId));

    return (
      <div className="space-y-3">
        {rows.map((row) => {
          const menuKey = `${options?.heatId ?? "sport"}-${row.position}`;
          const selectedTeam = data.teams.find((team) => team.id === row.teamId);

          return (
            <div
              key={row.position}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="grid gap-3 md:grid-cols-[72px_120px_1fr_auto] md:items-center">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border font-display text-lg ${positionBadgeClass(row.position)}`}
                >
                  #{row.position}
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500 md:hidden">
                    Pontos
                  </p>
                  <Input
                    type="number"
                    min={0}
                    value={row.points}
                    onChange={(e) =>
                      onUpdate(row.position, {
                        points: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500 md:hidden">
                    Equipa
                  </p>
                  <TeamSearchSelect
                    teams={data.teams}
                    value={row.teamId}
                    disabledTeamIds={disabledTeams.filter(
                      (teamId) => teamId !== row.teamId
                    )}
                    onChange={(teamId) => {
                      const configPoints =
                        pointsConfigs[
                          data.karts?.sportId && options?.heatId
                            ? data.karts.sportId
                            : activePointsSport
                        ]?.find((item) => item.position === row.position)
                          ?.points ?? row.points;
                      onUpdate(row.position, {
                        teamId,
                        points: row.points || configPoints,
                        useX2: teamId ? row.useX2 : false,
                      });
                    }}
                  />
                </div>

                {options?.showMultiplier && selectedTeam ? (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setOpenMenu((prev) => (prev === menuKey ? null : menuKey))
                      }
                    >
                      <span className="text-base leading-none">⋯</span>
                      {row.useX2 ? (
                        <span className="ml-1 text-xs text-amber-300">x2</span>
                      ) : null}
                    </Button>
                    {openMenu === menuKey ? (
                      <>
                        <button
                          type="button"
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenu(null)}
                          aria-label="Fechar menu"
                        />
                        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                            onClick={() => {
                              onUpdate(row.position, { teamId: null, useX2: false });
                              setOpenMenu(null);
                            }}
                          >
                            Remover equipa
                          </button>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                            onClick={() => {
                              if (!row.teamId) return;
                              const usedElsewhere = Object.entries(
                                options.allKartRaces ?? {}
                              ).some(([heatId, raceRows]) => {
                                if (heatId === options.heatId) return false;
                                return raceRows.some(
                                  (item) =>
                                    item.teamId === row.teamId && item.useX2
                                );
                              });
                              if (usedElsewhere) {
                                setToast({
                                  type: "error",
                                  message:
                                    "Esta equipa já utilizou o x2 nos Karts.",
                                });
                                return;
                              }
                              onUpdate(row.position, { useX2: !row.useX2 });
                              setOpenMenu(null);
                            }}
                          >
                            {row.useX2 ? "Remover x2" : "Aplicar x2"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toast toast={toast} />

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent">
        <div className="border-b border-white/10 bg-red-600/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-red-400" />
            <div>
              <h2 className="font-display text-2xl tracking-wide text-white">
                Classificação Geral
              </h2>
              <p className="text-sm text-zinc-400">
                Atualizada automaticamente quando guardas cada desporto.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <GlobalLeaderboardTable entries={data.globalRanking} />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-red-400" />
            <h2 className="font-display text-2xl tracking-wide text-white">
              Sistema de Pontos por Desporto
            </h2>
          </div>
        </div>
        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {allPointsSports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => setActivePointsSport(sport.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activePointsSport === sport.id
                    ? "bg-red-600 text-white"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {SPORT_ICONS[sport.slug]} {sport.name}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(pointsConfigs[activePointsSport] ?? []).map((row) => (
              <div
                key={row.position}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold ${positionBadgeClass(row.position)}`}
                >
                  #{row.position}
                </span>
                <Input
                  type="number"
                  min={0}
                  value={row.points}
                  onChange={(e) =>
                    setPointsConfigs((prev) => ({
                      ...prev,
                      [activePointsSport]: (prev[activePointsSport] ?? []).map(
                        (item) =>
                          item.position === row.position
                            ? { ...item, points: Number(e.target.value) || 0 }
                            : item
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="mt-5"
            disabled={pending}
            onClick={() => savePointsConfig(activePointsSport)}
          >
            <Save className="h-4 w-4" />
            Guardar Pontos
          </Button>
        </div>
      </section>

      {data.sportSections.map((section) => (
        <section
          key={section.sport.id}
          id={`sport-${section.sport.slug}`}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
        >
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{SPORT_ICONS[section.sport.slug]}</span>
              <div>
                <h2 className="font-display text-2xl tracking-wide text-white">
                  Classificação de {section.sport.name}
                </h2>
                <p className="text-sm text-zinc-400">
                  Ranking final · Posição, pontos e equipa
                </p>
              </div>
            </div>
          </div>
          <div className="hidden border-b border-white/10 px-6 py-3 text-xs uppercase tracking-wider text-zinc-500 md:grid md:grid-cols-[72px_120px_1fr] md:gap-3">
            <span>Ranking</span>
            <span>Pontos</span>
            <span>Equipa</span>
          </div>
          <div className="p-6">
            {renderRankingRows(
              sportRankings[section.sport.id] ?? [],
              (position, patch) =>
                updateSportRow(section.sport.id, position, patch)
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                disabled={pending}
                onClick={() => applyConfigPointsToSportRanking(section.sport.id)}
                variant="secondary"
              >
                Aplicar pontos predefinidos
              </Button>
              <Button
                type="button"
                disabled={pending}
                onClick={() =>
                  saveSportRanking(section.sport.id, section.sport.name)
                }
              >
                <Save className="h-4 w-4" />
                Guardar Classificação de {section.sport.name}
              </Button>
            </div>
          </div>
        </section>
      ))}

      {data.karts ? (
        <section
          id="sport-karts"
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
        >
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏎️</span>
              <div>
                <h2 className="font-display text-2xl tracking-wide text-white">
                  Classificação de Karts
                </h2>
                <p className="text-sm text-zinc-400">
                  3 corridas + total automático com multiplicador x2
                </p>
              </div>
            </div>
          </div>
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {data.karts.heats.map((heat, index) => (
                <button
                  key={heat.id}
                  type="button"
                  onClick={() => setKartTab(`race-${index}` as typeof kartTab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    kartTab === `race-${index}`
                      ? "bg-red-600 text-white"
                      : "border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="mr-1">🏁</span>
                  {heat.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setKartTab("total")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  kartTab === "total"
                    ? "bg-red-600 text-white"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                Total
              </button>
            </div>
          </div>

          <div className="p-6">
            {kartTab === "total" ? (
              <KartTotalsTable totals={kartTotals.length ? kartTotals : data.karts.totals} />
            ) : (
              (() => {
                const index =
                  kartTab === "race-0" ? 0 : kartTab === "race-1" ? 1 : 2;
                const heat = data.karts!.heats[index];
                return (
                  <>
                    <div className="hidden border-b border-white/10 pb-3 text-xs uppercase tracking-wider text-zinc-500 md:grid md:grid-cols-[72px_120px_1fr_auto] md:gap-3">
                      <span>Ranking</span>
                      <span>Pontos</span>
                      <span>Equipa</span>
                      <span>Multiplicador</span>
                    </div>
                    {renderRankingRows(
                      kartRaces[heat.id] ?? [],
                      (position, patch) => updateKartRow(heat.id, position, patch),
                      {
                        heatId: heat.id,
                        showMultiplier: true,
                        allKartRaces: kartRaces,
                      }
                    )}
                    <Button
                      type="button"
                      className="mt-5"
                      disabled={pending}
                      onClick={() => saveKartRace(heat.id, heat.name)}
                    >
                      <Save className="h-4 w-4" />
                      Guardar {heat.name}
                    </Button>
                  </>
                );
              })()
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function KartTotalsTable({ totals }: { totals: KartTotalEntry[] }) {
  if (totals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-zinc-500">
        O total será calculado automaticamente após guardares as corridas.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Equipa</th>
              <th className="px-4 py-3">Corrida 1</th>
              <th className="px-4 py-3">Corrida 2</th>
              <th className="px-4 py-3">Corrida 3</th>
              <th className="px-4 py-3">x2</th>
              <th className="px-4 py-3 text-red-400">Total</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((entry) => (
              <tr key={entry.teamId} className="border-t border-white/5">
                <td className="px-4 py-4 font-display text-xl text-zinc-300">
                  {entry.position}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <TeamAvatar
                      name={entry.teamName}
                      color={entry.teamColor}
                      logoUrl={entry.logoUrl}
                    />
                    <span className="text-white">{entry.teamName}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-zinc-300">{entry.corrida1}</td>
                <td className="px-4 py-4 text-zinc-300">{entry.corrida2}</td>
                <td className="px-4 py-4 text-zinc-300">{entry.corrida3}</td>
                <td className="px-4 py-4">
                  {entry.x2Used ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-300">
                      x2
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-4 font-bold text-red-400">
                  {entry.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {totals.map((entry) => (
          <div
            key={entry.teamId}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl text-zinc-300">
                #{entry.position}
              </span>
              <TeamAvatar
                name={entry.teamName}
                color={entry.teamColor}
                logoUrl={entry.logoUrl}
              />
              <div>
                <p className="font-semibold text-white">{entry.teamName}</p>
                <p className="text-sm font-bold text-red-400">
                  {entry.total} pts
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-white/10 px-3 py-2">
                <p className="text-zinc-500">Corrida 1</p>
                <p className="font-semibold text-white">{entry.corrida1}</p>
              </div>
              <div className="rounded-lg border border-white/10 px-3 py-2">
                <p className="text-zinc-500">Corrida 2</p>
                <p className="font-semibold text-white">{entry.corrida2}</p>
              </div>
              <div className="rounded-lg border border-white/10 px-3 py-2">
                <p className="text-zinc-500">Corrida 3</p>
                <p className="font-semibold text-white">{entry.corrida3}</p>
              </div>
              <div className="rounded-lg border border-white/10 px-3 py-2">
                <p className="text-zinc-500">x2</p>
                <p className="font-semibold text-white">
                  {entry.x2Used ? "Sim" : "Não"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
