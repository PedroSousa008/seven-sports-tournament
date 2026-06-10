import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { updateSettingsAction } from "@/lib/actions";
import { getTournamentSettings } from "@/lib/tournament";

export default async function OwnerSettingsPage() {
  const settings = await getTournamentSettings();

  return (
    <div>
      <PageHeader
        title="Definições"
        description="Configuração do torneio, identidade visual e valores predefinidos da plataforma."
      />

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
              <Input name="logoUrl" defaultValue={settings?.logoUrl ?? ""} />
            </div>
            <Button type="submit">Guardar definições</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Conta de organizador predefinida</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400">
          <p>Email: owner@torneio5desportos.pt</p>
          <p>Palavra-passe: owner2026</p>
          <p className="mt-3 text-zinc-500">
            Altere esta palavra-passe após o primeiro acesso em produção.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
