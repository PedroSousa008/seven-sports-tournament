import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { TeamAvatar } from "@/components/ui/team-avatar";
import {
  createMatchAction,
  saveSportGroupAction,
  setTeamSportPositionAction,
  updateMatchResultAction,
  updateSportAction,
} from "@/lib/actions";
import { SPORTS } from "@/lib/constants";
import { getSportRanking } from "@/lib/rankings";
import { prisma } from "@/lib/db";
import { eventStatusLabels, label } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";

export default async function OwnerSportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sport = await prisma.sport.findUnique({
    where: { slug },
    include: {
      groups: {
        include: {
          teams: { include: { team: true } },
        },
        orderBy: { order: "asc" },
      },
      matches: {
        include: { homeTeam: true, awayTeam: true, group: true },
        orderBy: { scheduledAt: "asc" },
      },
      kartHeats: {
        include: { results: { include: { team: true } } },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!sport) notFound();

  const [teams, ranking] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    getSportRanking(sport.id),
  ]);
  const sportMeta = SPORTS.find((item) => item.slug === slug);

  return (
    <div>
      <PageHeader
        title={sport.name}
        description={sport.format ?? sportMeta?.format}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visão geral do desporto</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateSportAction.bind(null, sport.id)} className="space-y-4">
              <div>
                <Label>Data</Label>
                <Input
                  name="date"
                  type="date"
                  defaultValue={
                    sport.date ? sport.date.toISOString().slice(0, 10) : ""
                  }
                />
              </div>
              <div>
                <Label>Hora</Label>
                <Input name="time" defaultValue={sport.time ?? ""} />
              </div>
              <div>
                <Label>Local</Label>
                <Input name="location" defaultValue={sport.location ?? ""} />
              </div>
              <div>
                <Label>Regras</Label>
                <Textarea name="rules" defaultValue={sport.rules ?? ""} />
              </div>
              <div>
                <Label>Formato</Label>
                <Textarea name="format" defaultValue={sport.format ?? ""} />
              </div>
              <div>
                <Label>Notas</Label>
                <Textarea name="notes" defaultValue={sport.notes ?? ""} />
              </div>
              <Button type="submit">Guardar definições do desporto</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ranking.map((row) => (
              <div
                key={row.teamId}
                className="flex items-center justify-between rounded-xl border border-white/10 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-zinc-500">{row.position}</span>
                  <TeamAvatar
                    name={row.teamName}
                    color={row.teamColor}
                    logoUrl={row.logoUrl}
                  />
                  <span className="font-medium text-white">{row.teamName}</span>
                </div>
                <span className="font-bold text-red-400">{row.points} pts</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grupos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {["Grupo A", "Grupo B", "Grupo C", "Grupo D"].map((groupName) => {
            const group = sport.groups.find((g) => g.name === groupName);
            return (
              <form
                key={groupName}
                action={saveSportGroupAction.bind(null, sport.id, groupName)}
                className="rounded-2xl border border-white/10 p-4"
              >
                <p className="mb-4 font-semibold text-white">{groupName}</p>
                {[0, 1, 2].map((index) => (
                  <select
                    key={index}
                    name={`teamIds`}
                    defaultValue={group?.teams[index]?.teamId ?? ""}
                    className="mb-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white"
                  >
                    <option value="">Selecionar equipa</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                ))}
                <Button type="submit" variant="secondary" className="mt-2">
                  Guardar grupo
                </Button>
              </form>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Jogos e resultados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createMatchAction.bind(null, sport.id)} className="grid gap-4 md:grid-cols-3">
            <Input name="title" placeholder="Título do jogo" required />
            <Input name="round" placeholder="Fase (grupo, meias, final)" />
            <Input name="scheduledAt" type="datetime-local" />
            <select
              name="homeTeamId"
              className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white"
            >
              <option value="">Equipa da casa</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              name="awayTeamId"
              className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white"
            >
              <option value="">Equipa visitante</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Button type="submit">Adicionar jogo</Button>
          </form>

          {sport.matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-white/10 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{match.title}</p>
                  <p className="text-sm text-zinc-400">
                    {match.round ?? "Jogo"}
                    {match.scheduledAt
                      ? ` · ${formatDateTime(match.scheduledAt)}`
                      : ""}
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {match.homeTeam?.name ?? "A definir"} vs {match.awayTeam?.name ?? "A definir"}
                  </p>
                </div>
                <Badge
                  variant={
                    match.status === "LIVE"
                      ? "live"
                      : match.status === "FINISHED"
                        ? "success"
                        : "default"
                  }
                >
                  {label(eventStatusLabels, match.status)}
                </Badge>
              </div>
              <form
                action={updateMatchResultAction.bind(null, match.id)}
                className="mt-4 grid gap-3 md:grid-cols-4"
              >
                <Input name="homeScore" placeholder="Resultado casa" defaultValue={match.homeScore ?? ""} />
                <Input name="awayScore" placeholder="Resultado visitante" defaultValue={match.awayScore ?? ""} />
                <Input name="detail" placeholder="Sets / detalhe" defaultValue={match.detail ?? ""} />
                <select
                  name="status"
                  defaultValue={match.status}
                  className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white"
                >
                  <option value="UPCOMING">{eventStatusLabels.UPCOMING}</option>
                  <option value="LIVE">{eventStatusLabels.LIVE}</option>
                  <option value="FINISHED">{eventStatusLabels.FINISHED}</option>
                </select>
                <Button type="submit" className="md:col-span-4 md:w-fit">
                  Guardar resultado
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Atribuir posições finais e pontos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {teams.map((team) => (
            <form
              key={team.id}
              action={async (formData) => {
                "use server";
                const position = Number(formData.get("position"));
                await setTeamSportPositionAction(sport.id, team.id, position);
              }}
              className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
            >
              <TeamAvatar name={team.name} color={team.color} logoUrl={team.logoUrl} />
              <span className="flex-1 text-white">{team.name}</span>
              <Input
                name="position"
                type="number"
                min={1}
                max={12}
                className="w-20"
                placeholder="#"
              />
              <Button type="submit" size="sm">
                Definir
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
