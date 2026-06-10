import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { CreateTeamForm } from "@/components/teams/create-team-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { prisma } from "@/lib/db";
import { label, paymentStatusLabels } from "@/lib/labels";
import { getTournamentSettings } from "@/lib/tournament";

export default async function OwnerTeamsPage() {
  const [teams, settings] = await Promise.all([
    prisma.team.findMany({
      include: { players: true, user: true },
      orderBy: { name: "asc" },
    }),
    getTournamentSettings(),
  ]);

  return (
    <div>
      <PageHeader
        title="Equipas"
        description={`Gira até ${settings?.maxTeams ?? 12} contas de equipa. Cada equipa tem um acesso de capitão.`}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Criar conta de equipa</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTeamForm />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <TeamAvatar
                  name={team.name}
                  color={team.color}
                  logoUrl={team.logoUrl}
                  size="lg"
                />
                <div>
                  <Link
                    href={`/owner/teams/${team.id}`}
                    className="text-lg font-semibold text-white hover:text-red-400"
                  >
                    {team.name}
                  </Link>
                  <p className="text-sm text-zinc-400">
                    Capitão: {team.captainName} · {team.captainEmail}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {team.players.length} jogadores ·{" "}
                    {team.user ? "Acesso ativo" : "Sem acesso criado"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    team.paymentStatus === "PAID"
                      ? "success"
                      : team.paymentStatus === "PARTIAL"
                        ? "warning"
                        : "danger"
                  }
                >
                  {label(paymentStatusLabels, team.paymentStatus)}
                </Badge>
                {team.selectionsLocked ? (
                  <Badge variant="warning">Seleções bloqueadas</Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
        {!teams.length ? (
          <Card>
            <CardContent className="py-10 text-center text-zinc-500">
              Ainda não foram criadas equipas.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
