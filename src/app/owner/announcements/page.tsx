import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createAnnouncementAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
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
        title="Announcements"
        description="Publish updates visible to all teams or selected teams."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAnnouncementAction} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div>
              <Label>Priority</Label>
              <Select name="priority" defaultValue="NORMAL">
                <option value="NORMAL">Normal</option>
                <option value="IMPORTANT">Important</option>
                <option value="URGENT">Urgent</option>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input name="date" type="date" />
            </div>
            <div>
              <Label>Related sport</Label>
              <Select name="sportId" defaultValue="">
                <option value="">General</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Message</Label>
              <Textarea name="message" required />
            </div>
            <div className="md:col-span-2">
              <Label>Visible to selected teams</Label>
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
                Visible to all teams if none selected
              </label>
            </div>
            <Button type="submit">Publish announcement</Button>
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
                  {item.priority}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{formatDate(item.date)}</p>
              <p className="mt-3 text-zinc-300">{item.message}</p>
              <p className="mt-3 text-sm text-zinc-500">
                Visible to:{" "}
                {item.allTeams
                  ? "All teams"
                  : item.targets.map((target) => target.team.name).join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
