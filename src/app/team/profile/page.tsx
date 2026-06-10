import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { updateTeamPasswordAction, updateTeamProfileAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export default async function TeamProfilePage() {
  const session = await requireSession("TEAM");
  const team = await prisma.team.findUnique({
    where: { id: session.user.teamId! },
    include: { user: true },
  });
  if (!team) return null;

  return (
    <div>
      <PageHeader
        title="Perfil"
        description="Atualiza a conta de capitão e os detalhes da equipa."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perfil da equipa</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateTeamProfileAction} className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nome da equipa</Label>
                <Input name="name" defaultValue={team.name} required />
              </div>
              <div>
                <Label>Nome do capitão</Label>
                <Input name="captainName" defaultValue={team.captainName} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={team.user?.email ?? team.captainEmail}
                  required
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input name="phone" defaultValue={team.phone ?? ""} />
              </div>
              <div className="md:col-span-2">
                <Label>URL do logótipo da equipa</Label>
                <Input name="logoUrl" defaultValue={team.logoUrl ?? ""} />
              </div>
              <Button type="submit">Guardar perfil</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <TeamAvatar
              name={team.name}
              color={team.color}
              logoUrl={team.logoUrl}
              size="lg"
            />
            <p className="text-center text-sm text-zinc-400">
              {team.captainName}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Alterar palavra-passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              const password = String(formData.get("password") ?? "");
              if (password.length >= 6) {
                await updateTeamPasswordAction(password);
              }
            }}
            className="flex max-w-md flex-col gap-4"
          >
            <Input
              name="password"
              type="password"
              placeholder="Nova palavra-passe"
              minLength={6}
              required
            />
            <Button type="submit" className="w-fit">
              Atualizar palavra-passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
