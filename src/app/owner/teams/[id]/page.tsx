import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { TeamAvatar } from "@/components/ui/team-avatar";
import {
  createPlayerAction,
  deletePlayerAction,
  deleteTeamAction,
  updateTeamAction,
} from "@/lib/actions";
import { prisma } from "@/lib/db";
import { label, paymentStatusLabels } from "@/lib/labels";

export default async function OwnerTeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      players: {
        include: { sports: { include: { sport: true } } },
      },
      user: true,
      sportSelections: { include: { sport: true, player: true } },
    },
  });
  if (!team) notFound();

  return (
    <div>
      <PageHeader
        title={team.name}
        description={`Capitão ${team.captainName} · ${team.captainEmail}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes da equipa</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateTeamAction.bind(null, team.id)} className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nome da equipa</Label>
                <Input name="name" defaultValue={team.name} required />
              </div>
              <div>
                <Label>Nome do capitão</Label>
                <Input name="captainName" defaultValue={team.captainName} required />
              </div>
              <div>
                <Label>Email do capitão</Label>
                <Input name="captainEmail" defaultValue={team.captainEmail} required />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input name="phone" defaultValue={team.phone ?? ""} />
              </div>
              <div>
                <Label>Cor</Label>
                <Input name="color" type="color" defaultValue={team.color} />
              </div>
              <div>
                <Label>Estado de pagamento</Label>
                <Select name="paymentStatus" defaultValue={team.paymentStatus}>
                  <option value="UNPAID">{paymentStatusLabels.UNPAID}</option>
                  <option value="PARTIAL">{paymentStatusLabels.PARTIAL}</option>
                  <option value="PAID">{paymentStatusLabels.PAID}</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>URL do logótipo</Label>
                <Input name="logoUrl" defaultValue={team.logoUrl ?? ""} />
              </div>
              <div className="md:col-span-2">
                <Label>URL do banner</Label>
                <Input name="bannerUrl" defaultValue={team.bannerUrl ?? ""} />
              </div>
              <div className="md:col-span-2">
                <Label>Notas</Label>
                <Textarea name="notes" defaultValue={team.notes ?? ""} />
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-2">
                <input
                  type="checkbox"
                  name="selectionsLocked"
                  defaultChecked={team.selectionsLocked}
                />
                Bloquear seleções de jogadores desta equipa
              </label>
              <Button type="submit">Guardar equipa</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <TeamAvatar
              name={team.name}
              color={team.color}
              logoUrl={team.logoUrl}
              size="lg"
            />
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
            <p className="text-sm text-zinc-400">
              Acesso: {team.user ? team.user.email : "Não criado"}
            </p>
            <form action={deleteTeamAction.bind(null, team.id)}>
              <Button type="submit" variant="danger">
                Eliminar equipa
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Jogadores ({team.players.length}/10)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createPlayerAction.bind(null, team.id)} className="grid gap-4 md:grid-cols-4">
            <Input name="name" placeholder="Nome do jogador" required />
            <Input name="age" type="number" placeholder="Idade" />
            <Input name="phone" placeholder="Telefone" />
            <Input name="email" placeholder="Email" />
            <Button type="submit" className="md:col-span-4 md:w-fit">
              Adicionar jogador
            </Button>
          </form>

          <div className="space-y-3">
            {team.players.map((player) => (
              <div
                key={player.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{player.name}</p>
                  <p className="text-sm text-zinc-400">
                    {player.age ? `${player.age} anos` : "Idade n/d"}
                    {player.phone ? ` · ${player.phone}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {player.sports.map((selection) => (
                      <Badge key={selection.id}>{selection.sport.name}</Badge>
                    ))}
                  </div>
                </div>
                <form action={deletePlayerAction.bind(null, player.id)}>
                  <Button type="submit" variant="ghost">
                    Remover
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
