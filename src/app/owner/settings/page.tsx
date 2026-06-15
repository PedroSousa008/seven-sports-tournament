import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { updateOwnerAccountAction, updateSettingsAction } from "@/lib/actions";
import { OWNER_EMAIL } from "@/lib/owner-account";
import { prisma } from "@/lib/db";
import { getTournamentSettings } from "@/lib/tournament";
import { requireSession } from "@/lib/session";

export default async function OwnerSettingsPage() {
  await requireSession("OWNER");
  const [settings, owner] = await Promise.all([
    getTournamentSettings(),
    prisma.user.findFirst({ where: { role: "OWNER" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Definições"
        description="Configuração do torneio, conta de organizador e identidade visual."
      />

      <Card className="mb-6 border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle>Acesso de organizador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-zinc-300">
            Utiliza estas credenciais para iniciar sessão em{" "}
            <strong className="text-white">/login</strong> e gerir todo o
            torneio.
          </p>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm">
            <p className="text-zinc-400">Email</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {owner?.email ?? OWNER_EMAIL}
            </p>
            <p className="mt-4 text-zinc-400">Palavra-passe inicial</p>
            <p className="mt-1 text-lg font-semibold text-red-400">
              Torneio5Braga
            </p>
          </div>
          <p className="text-zinc-500">
            Recomendamos alterar a palavra-passe abaixo após o primeiro acesso.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conta de organizador</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateOwnerAccountAction}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <Label>Nome</Label>
              <Input
                name="name"
                defaultValue={owner?.name ?? "Organizador"}
                required
              />
            </div>
            <div>
              <Label>Email de acesso</Label>
              <Input
                name="email"
                type="email"
                defaultValue={owner?.email ?? OWNER_EMAIL}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label>Nova palavra-passe (opcional)</Label>
              <Input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>
            <Button type="submit">Guardar conta</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Definições do torneio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome do torneio</Label>
              <Input name="name" defaultValue={settings?.name ?? ""} required />
            </div>
            <div>
              <Label>Local</Label>
              <Input name="location" defaultValue={settings?.location ?? ""} required />
            </div>
            <div>
              <Label>Data de início</Label>
              <Input
                name="startDate"
                type="date"
                defaultValue={
                  settings?.startDate
                    ? settings.startDate.toISOString().slice(0, 10)
                    : ""
                }
                required
              />
            </div>
            <div>
              <Label>Data de fim</Label>
              <Input
                name="endDate"
                type="date"
                defaultValue={
                  settings?.endDate
                    ? settings.endDate.toISOString().slice(0, 10)
                    : ""
                }
                required
              />
            </div>
            <div>
              <Label>Número de equipas</Label>
              <Input
                name="maxTeams"
                type="number"
                defaultValue={settings?.maxTeams ?? 12}
              />
            </div>
            <div>
              <Label>Máx. jogadores por equipa</Label>
              <Input
                name="maxPlayersPerTeam"
                type="number"
                defaultValue={settings?.maxPlayersPerTeam ?? 10}
              />
            </div>
            <div>
              <Label>Preço de inscrição (€)</Label>
              <Input
                name="registrationPrice"
                type="number"
                defaultValue={settings?.registrationPrice ?? 500}
              />
            </div>
            <div>
              <Label>Cor principal</Label>
              <Input
                name="primaryColor"
                type="color"
                defaultValue={settings?.primaryColor ?? "#DC2626"}
              />
            </div>
            <div className="md:col-span-2">
              <Label>URL do logótipo</Label>
              <Input
                name="logoUrl"
                defaultValue={settings?.logoUrl ?? ""}
                placeholder="/logo.png"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Coloca o ficheiro em{" "}
                <code className="text-zinc-400">public/logo.png</code> e usa o
                caminho <code className="text-zinc-400">/logo.png</code>. Aparece
                no canto superior esquerdo da homepage e da página de inscrição.
              </p>
            </div>
            <Button type="submit">Guardar definições</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
