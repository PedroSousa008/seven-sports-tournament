import { PageHeader } from "@/components/layout/page-header";
import { PlayerSportSelector } from "@/components/teams/player-sport-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createPlayerAction, deletePlayerAction } from "@/lib/actions";
import { SPORTS } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export default async function TeamMyTeamPage() {
  const session = await requireSession("TEAM");
  const teamId = session.user.teamId!;
  const [team, sports] = await Promise.all([
    prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: { include: { sports: true } },
      },
    }),
    prisma.sport.findMany(),
  ]);
  if (!team) return null;

  const sportsWithLimits = sports.map((sport) => ({
    id: sport.id,
    name: sport.name,
    slug: sport.slug,
    maxPlayers: SPORTS.find((item) => item.slug === sport.slug)?.maxPlayers ?? 10,
  }));

  return (
    <div>
      <PageHeader
        title="My Team"
        description="Manage your squad and select players for each sport."
        action={
          team.selectionsLocked ? (
            <Badge variant="warning">Selections locked by organizer</Badge>
          ) : null
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add player</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPlayerAction.bind(null, teamId)} className="grid gap-4 md:grid-cols-4">
            <Input name="name" placeholder="Player name" required />
            <Input name="age" type="number" placeholder="Age" />
            <Input name="phone" placeholder="Phone" />
            <Input name="email" placeholder="Email" />
            <Button type="submit" className="md:col-span-4 md:w-fit">
              Add player
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {team.players.map((player) => (
          <Card key={player.id}>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{player.name}</p>
                  <p className="text-sm text-zinc-400">
                    {player.age ? `${player.age} years` : "Age not set"}
                    {player.phone ? ` · ${player.phone}` : ""}
                  </p>
                </div>
                <form action={deletePlayerAction.bind(null, player.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    disabled={team.selectionsLocked}
                  >
                    Remove
                  </Button>
                </form>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm text-zinc-500">Sports competing in</p>
                <PlayerSportSelector
                  playerId={player.id}
                  sports={sportsWithLimits}
                  selectedSportIds={player.sports.map((item) => item.sportId)}
                  locked={team.selectionsLocked}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
