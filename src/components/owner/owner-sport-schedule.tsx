"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateGroupStandings,
  type SportCalendarData,
  type MatchInfo,
} from "@/lib/calendar";
import { KNOCKOUT_LABELS, type KnockoutRound } from "@/lib/sport-formats";
import {
  createMatchAction,
  deleteCalendarMatchAction,
  saveCalendarMatchResultAction,
  saveSportGroupAction,
} from "@/lib/actions";
import { GroupStandingsCard } from "@/components/calendar/group-standings-card";
import { KnockoutStage } from "@/components/calendar/knockout-stage";

type Team = { id: string; name: string; logoUrl: string | null; color: string };

function StepHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="font-display text-xl tracking-wide text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function MatchResultRow({
  sportId,
  groupId,
  groupName,
  round,
  teams,
  allTeams,
  qualifiersPerGroup,
  existingMatch,
}: {
  sportId: string;
  groupId?: string;
  groupName?: string;
  round: string;
  teams: Team[];
  allTeams: Team[];
  qualifiersPerGroup?: number;
  existingMatch?: MatchInfo;
}) {
  const [pending, startTransition] = useTransition();
  const groupPending = groupId?.startsWith("pending-") ?? false;
  const isGroup = round === "GROUP";
  const teamOptions = isGroup ? teams : allTeams;

  const [time, setTime] = useState(existingMatch?.timeLabel ?? "");
  const [homeTeamId, setHomeTeamId] = useState(existingMatch?.homeTeam?.id ?? "");
  const [awayTeamId, setAwayTeamId] = useState(existingMatch?.awayTeam?.id ?? "");
  const [homeScore, setHomeScore] = useState(existingMatch?.homeScore ?? "");
  const [awayScore, setAwayScore] = useState(existingMatch?.awayScore ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  const groupTeams = teams.map((t) => ({
    id: t.id,
    name: t.name,
    logoUrl: t.logoUrl,
    color: t.color,
  }));

  function buildPreview() {
    if (!isGroup || !qualifiersPerGroup) return;
    if (!homeTeamId || !awayTeamId || homeScore === "" || awayScore === "") {
      setPreview("Preenche equipas e resultado para pré-visualizar.");
      return;
    }
    const home = groupTeams.find((t) => t.id === homeTeamId);
    const away = groupTeams.find((t) => t.id === awayTeamId);
    if (!home || !away || !groupName || !groupId) return;

    const fakeMatch: MatchInfo = {
      id: "preview",
      round: "GROUP",
      groupName,
      groupId,
      scheduledAt: null,
      timeLabel: time,
      location: null,
      status: "FINISHED",
      homeTeam: home,
      awayTeam: away,
      homeScore,
      awayScore,
    };

    const existing = existingMatch ? [existingMatch] : [];
    const others = existing.filter((m) => m.id !== existingMatch?.id);
    const standings = calculateGroupStandings(
      groupTeams,
      [...others, fakeMatch],
      qualifiersPerGroup
    );

    setPreview(
      standings
        .map(
          (r) =>
            `${r.position}. ${r.teamName} — ${r.points} pts (${r.diff > 0 ? "+" : ""}${r.diff})${r.qualified ? " ✓" : ""}`
        )
        .join("\n")
    );
  }

  function save() {
    if (isGroup && groupPending) {
      setPreview("Guarda o grupo antes de adicionar jogos.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("round", round);
      if (groupId) fd.set("groupId", groupId);
      if (groupName) fd.set("groupName", groupName);
      fd.set("title", groupName ?? KNOCKOUT_LABELS[round as KnockoutRound] ?? "Jogo");
      fd.set("homeTeamId", homeTeamId);
      fd.set("awayTeamId", awayTeamId);
      fd.set("homeScore", homeScore);
      fd.set("awayScore", awayScore);
      fd.set(
        "status",
        homeScore !== "" && awayScore !== "" ? "FINISHED" : "UPCOMING"
      );
      fd.set("time", time);
      fd.set("date", new Date().toISOString().slice(0, 10));

      if (existingMatch) {
        await saveCalendarMatchResultAction(existingMatch.id, fd);
      } else {
        await createMatchAction(sportId, fd);
      }
      setPreview(null);
    });
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="grid gap-2 sm:grid-cols-[72px_1fr_52px_20px_52px_1fr_auto_auto] sm:items-center">
        <Input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="10:00"
          className="h-10"
        />
        <select
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
        >
          <option value="">Equipa 1</option>
          {teamOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Input
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          placeholder="—"
          className="h-10 text-center"
        />
        <span className="hidden text-center text-zinc-500 sm:block">×</span>
        <Input
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          placeholder="—"
          className="h-10 text-center"
        />
        <select
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
        >
          <option value="">Equipa 2</option>
          {teamOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {isGroup ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={buildPreview}
            disabled={pending}
          >
            Preview
          </Button>
        ) : (
          <div />
        )}
        <Button type="button" size="sm" onClick={save} disabled={pending || (isGroup && groupPending)}>
          Guardar
        </Button>
      </div>
      {isGroup && groupPending ? (
        <p className="mt-2 text-xs text-amber-500">
          Guarda as equipas do grupo antes de inserir jogos.
        </p>
      ) : null}
      {preview ? (
        <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white/5 p-3 text-xs text-zinc-300">
          {preview}
        </pre>
      ) : null}
      {existingMatch ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 text-zinc-500"
          disabled={pending}
          onClick={() =>
            startTransition(() => deleteCalendarMatchAction(existingMatch.id))
          }
        >
          Eliminar jogo
        </Button>
      ) : null}
    </div>
  );
}

export function OwnerSportSchedule({
  calendar,
  teams,
}: {
  calendar: SportCalendarData;
  teams: Team[];
}) {
  const [knockoutRound, setKnockoutRound] = useState<KnockoutRound>("SEMI_FINAL");

  if (calendar.isPlaceholder) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
        <p className="font-display text-2xl text-white">Karts</p>
        <p className="mt-3 text-zinc-400">Formato dos Karts em preparação.</p>
        <p className="mt-2 text-sm text-zinc-600">
          Heats, qualificação, final e pontuação serão adicionados em breve.
        </p>
      </div>
    );
  }

  const formatSummary = [
    `${calendar.format.groups.length} grupos de ${calendar.format.teamsPerGroup}`,
    calendar.format.qualifiersPerGroup === 1
      ? "1º de cada grupo qualifica"
      : `Top ${calendar.format.qualifiersPerGroup} de cada grupo qualificam`,
    ...calendar.format.knockoutRounds.map((r) => KNOCKOUT_LABELS[r]),
  ].join(" · ");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <p className="text-sm text-zinc-400">{formatSummary}</p>
        <Link
          href={`/calendario/${calendar.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
        >
          <Download className="h-4 w-4" />
          Descarregar calendário
        </Link>
      </div>

      <section>
        <StepHeader
          step={1}
          title="Atribuir equipas aos grupos"
          description="Seleciona 3 equipas por grupo. Cada equipa só pode estar num grupo deste desporto."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {calendar.format.groups.map((groupName) => {
            const group = calendar.groups.find((g) => g.name === groupName);
            return (
              <form
                key={groupName}
                action={saveSportGroupAction.bind(
                  null,
                  calendar.sportId,
                  groupName
                )}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <p className="mb-3 font-semibold text-white">{groupName}</p>
                {Array.from({ length: calendar.format.teamsPerGroup }).map(
                  (_, i) => (
                    <select
                      key={i}
                      name="teamIds"
                      defaultValue={group?.teams[i]?.id ?? ""}
                      className="mb-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
                    >
                      <option value="">Selecionar equipa</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )
                )}
                <Button type="submit" variant="secondary" size="sm">
                  Guardar grupo
                </Button>
                {group?.teams.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.teams.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1"
                      >
                        <TeamAvatar
                          name={t.name}
                          color={t.color}
                          logoUrl={t.logoUrl}
                          size="sm"
                        />
                        <span className="text-xs text-white">{t.name}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </form>
            );
          })}
        </div>
      </section>

      <section>
        <StepHeader
          step={2}
          title="Classificação dos grupos"
          description="Calculada automaticamente a partir dos resultados guardados. Verde = qualificado."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {calendar.groups.map((group) => (
            <GroupStandingsCard
              key={group.id}
              group={group}
              format={calendar.format}
            />
          ))}
        </div>
      </section>

      <section>
        <StepHeader
          step={3}
          title="Resultados — Fase de grupos"
          description="Hora · Equipa 1 · Resultado · Equipa 2 · Preview · Guardar"
        />
        <div className="space-y-8">
          {calendar.groups.map((group) => (
            <div key={group.id}>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red-400">
                {group.name}
              </p>
              <div className="space-y-2">
                {group.matches.map((match) => (
                  <MatchResultRow
                    key={match.id}
                    sportId={calendar.sportId}
                    groupId={group.id}
                    groupName={group.name}
                    round="GROUP"
                    teams={group.teams}
                    allTeams={teams}
                    qualifiersPerGroup={calendar.format.qualifiersPerGroup}
                    existingMatch={match}
                  />
                ))}
                <MatchResultRow
                  sportId={calendar.sportId}
                  groupId={group.id}
                  groupName={group.name}
                  round="GROUP"
                  teams={group.teams}
                  allTeams={teams}
                  qualifiersPerGroup={calendar.format.qualifiersPerGroup}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {calendar.format.knockoutRounds.length > 0 ? (
        <section>
          <StepHeader
            step={4}
            title="Fase eliminatória"
            description="Adiciona ou edita jogos de quartos, meias e final."
          />

          <div className="mb-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Pré-visualização pública
            </p>
            <KnockoutStage calendar={calendar} />
          </div>

          <p className="mb-3 text-sm font-semibold text-white">
            Jogos eliminatórios
          </p>
          <div className="mb-4 space-y-2">
            {calendar.knockout.map((match) => (
              <div key={match.id}>
                <p className="mb-1 text-xs text-zinc-500">{match.roundLabel}</p>
                <MatchResultRow
                  sportId={calendar.sportId}
                  round={match.round ?? "SEMI_FINAL"}
                  teams={[]}
                  allTeams={teams}
                  existingMatch={match}
                />
              </div>
            ))}
          </div>

          <p className="mb-2 text-sm text-zinc-400">Adicionar jogo eliminatório</p>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {calendar.format.knockoutRounds.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setKnockoutRound(r)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                    knockoutRound === r
                      ? "bg-red-600 text-white"
                      : "border border-white/10 text-zinc-400"
                  }`}
                >
                  {KNOCKOUT_LABELS[r]}
                </button>
              ))}
            </div>
            <MatchResultRow
              sportId={calendar.sportId}
              round={knockoutRound}
              teams={[]}
              allTeams={teams}
            />
          </div>
        </section>
      ) : null}

      <p className="text-center text-sm text-zinc-600">
        A pontuação global do torneio é gerida em{" "}
        <Link href="/owner/rankings" className="text-red-400 hover:underline">
          Resultados
        </Link>
        .
      </p>
    </div>
  );
}
