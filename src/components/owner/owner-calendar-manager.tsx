"use client";

import { useMemo, useState, useTransition } from "react";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateGroupStandings,
  type SportCalendarData,
  type MatchInfo,
} from "@/lib/calendar";
import { CALENDAR_SPORT_TABS } from "@/lib/sport-formats";
import {
  createMatchAction,
  deleteCalendarMatchAction,
  saveCalendarMatchResultAction,
  saveSportGroupAction,
} from "@/lib/actions";
import { GroupStandingsCard } from "@/components/calendar/group-standings-card";
import { MatchCard } from "@/components/calendar/match-card";

type Team = { id: string; name: string; logoUrl: string | null; color: string };

function MatchInputRow({
  sportId,
  groupId,
  groupName,
  teams,
  qualifiersPerGroup,
  existingMatch,
}: {
  sportId: string;
  groupId: string;
  groupName: string;
  teams: Team[];
  qualifiersPerGroup: number;
  existingMatch?: MatchInfo;
}) {
  const [pending, startTransition] = useTransition();
  const groupPending = groupId.startsWith("pending-");
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
    if (!homeTeamId || !awayTeamId || homeScore === "" || awayScore === "") {
      setPreview("Preenche equipas e resultado para pré-visualizar.");
      return;
    }
    const home = groupTeams.find((t) => t.id === homeTeamId);
    const away = groupTeams.find((t) => t.id === awayTeamId);
    if (!home || !away) return;

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
    if (groupPending) {
      setPreview("Guarda o grupo antes de adicionar jogos.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("round", "GROUP");
      fd.set("groupId", groupId);
      fd.set("groupName", groupName);
      fd.set("title", `${groupName}`);
      fd.set("homeTeamId", homeTeamId);
      fd.set("awayTeamId", awayTeamId);
      fd.set("homeScore", homeScore);
      fd.set("awayScore", awayScore);
      fd.set("status", "FINISHED");
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
      <div className="grid gap-2 sm:grid-cols-[80px_1fr_60px_24px_60px_1fr_auto_auto] sm:items-center">
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
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Input
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          placeholder="0"
          className="h-10 text-center"
        />
        <span className="hidden text-center text-zinc-500 sm:block">×</span>
        <Input
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          placeholder="0"
          className="h-10 text-center"
        />
        <select
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
        >
          <option value="">Equipa 2</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={buildPreview}
          disabled={pending}
        >
          Preview
        </Button>
        <Button type="button" size="sm" onClick={save} disabled={pending || groupPending}>
          Guardar
        </Button>
      </div>
      {groupPending ? (
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

export function OwnerCalendarManager({
  calendars,
  teams,
}: {
  calendars: SportCalendarData[];
  teams: Team[];
}) {
  const [activeSlug, setActiveSlug] = useState("futebol7");
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

      {calendar.isPlaceholder ? (
        <p className="text-zinc-400">Formato dos Karts em preparação.</p>
      ) : (
        <>
          <section>
            <h2 className="font-display mb-4 text-xl text-white">Grupos</h2>
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
                    className="rounded-2xl border border-white/10 p-4"
                  >
                    <p className="mb-3 font-semibold text-white">{groupName}</p>
                    {[0, 1, 2].map((i) => (
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
                    ))}
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
            <h2 className="font-display mb-4 text-xl text-white">
              Classificações (automáticas)
            </h2>
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
            <h2 className="font-display mb-4 text-xl text-white">
              Inserir resultados — Fase de grupos
            </h2>
            <div className="space-y-6">
              {calendar.groups.map((group) => (
                <div key={group.id}>
                  <p className="mb-2 text-sm font-semibold text-red-400">
                    {group.name}
                  </p>
                  <div className="space-y-2">
                    {group.matches.map((match) => (
                      <MatchInputRow
                        key={match.id}
                        sportId={calendar.sportId}
                        groupId={group.id}
                        groupName={group.name}
                        teams={group.teams}
                        qualifiersPerGroup={calendar.format.qualifiersPerGroup}
                        existingMatch={match}
                      />
                    ))}
                    <MatchInputRow
                      sportId={calendar.sportId}
                      groupId={group.id}
                      groupName={group.name}
                      teams={group.teams}
                      qualifiersPerGroup={calendar.format.qualifiersPerGroup}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display mb-4 text-xl text-white">
              Fase eliminatória
            </h2>
            <form
              action={createMatchAction.bind(null, calendar.sportId)}
              className="mb-4 grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-4"
            >
              <select
                name="round"
                className="h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
              >
                <option value="QUARTER_FINAL">Quartos-de-final</option>
                <option value="SEMI_FINAL">Meias-finais</option>
                <option value="FINAL">Final</option>
              </select>
              <Input name="time" placeholder="Hora (10:00)" />
              <Input name="date" type="date" />
              <select
                name="homeTeamId"
                className="h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
              >
                <option value="">Equipa 1</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <select
                name="awayTeamId"
                className="h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white"
              >
                <option value="">Equipa 2</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <Input name="homeScore" placeholder="Resultado 1" />
              <Input name="awayScore" placeholder="Resultado 2" />
              <input type="hidden" name="title" value="Eliminatória" />
              <input type="hidden" name="status" value="UPCOMING" />
              <Button type="submit">Adicionar jogo</Button>
            </form>
            <div className="grid gap-3 sm:grid-cols-2">
              {calendar.knockout.map((match) => (
                <div key={match.id}>
                  <MatchCard match={match} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCalendarMatchAction(match.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
