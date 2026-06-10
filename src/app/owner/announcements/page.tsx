import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createAnnouncementAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { announcementPriorityLabels, label } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default async function OwnerAnnouncementsPage() {
  const [announcements, sports, teams] = await Promise.all([
    prisma.announcement.findMany({
      include: { sport: true, targets: { include: { team: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.sport.findMany(),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Anúncios"
        description="Publica atualizações visíveis para todas as equipas ou equipas selecionadas."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Novo anúncio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAnnouncementAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Título</Label>
              <Input name="title" required />
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select name="priority" defaultValue="NORMAL">
                <option value="NORMAL">{announcementPriorityLabels.NORMAL}</option>
                <option value="IMPORTANT">{announcementPriorityLabels.IMPORTANT}</option>
                <option value="URGENT">{announcementPriorityLabels.URGENT}</option>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input name="date" type="date" />
            </div>
            <div>
              <Label>Desporto relacionado</Label>
              <Select name="sportId" defaultValue="">
                <option value="">Geral</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Mensagem</Label>
              <Textarea name="message" required />
            </div>
            <div className="md:col-span-2">
              <Label>Visível para equipas selecionadas</Label>
              <select
                name="teamIds"
                multiple
                className="min-h-28 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <label className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                <input type="checkbox" name="allTeams" defaultChecked />
                Visível para todas as equipas se nenhuma for selecionada
              </label>
            </div>
            <Button type="submit">Publicar anúncio</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {announcements.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-white">{item.title}</p>
                <Badge
                  variant={
                    item.priority === "URGENT"
                      ? "danger"
                      : item.priority === "IMPORTANT"
                        ? "warning"
                        : "default"
                  }
                >
                  {label(announcementPriorityLabels, item.priority)}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{formatDate(item.date)}</p>
              <p className="mt-3 text-zinc-300">{item.message}</p>
              <p className="mt-3 text-sm text-zinc-500">
                Visível para:{" "}
                {item.allTeams
                  ? "Todas as equipas"
                  : item.targets.map((target) => target.team.name).join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
