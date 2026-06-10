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
        title="Settings"
        description="Tournament configuration, branding and platform defaults."
      />

      <Card>
        <CardHeader>
          <CardTitle>Tournament settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Tournament name</Label>
              <Input name="name" defaultValue={settings?.name ?? ""} required />
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" defaultValue={settings?.location ?? ""} required />
            </div>
            <div>
              <Label>Start date</Label>
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
              <Label>End date</Label>
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
              <Label>Number of teams</Label>
              <Input
                name="maxTeams"
                type="number"
                defaultValue={settings?.maxTeams ?? 12}
              />
            </div>
            <div>
              <Label>Max players per team</Label>
              <Input
                name="maxPlayersPerTeam"
                type="number"
                defaultValue={settings?.maxPlayersPerTeam ?? 10}
              />
            </div>
            <div>
              <Label>Registration price (€)</Label>
              <Input
                name="registrationPrice"
                type="number"
                defaultValue={settings?.registrationPrice ?? 500}
              />
            </div>
            <div>
              <Label>Primary color</Label>
              <Input
                name="primaryColor"
                type="color"
                defaultValue={settings?.primaryColor ?? "#DC2626"}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Logo URL</Label>
              <Input name="logoUrl" defaultValue={settings?.logoUrl ?? ""} />
            </div>
            <Button type="submit">Save settings</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Default owner account</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400">
          <p>Email: owner@torneio5desportos.pt</p>
          <p>Password: owner2026</p>
          <p className="mt-3 text-zinc-500">
            Change this password after first login in production.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
