import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAnnouncementsForTeam } from "@/lib/tournament";
import { announcementPriorityLabels, label } from "@/lib/labels";
import { requireSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function TeamAnnouncementsPage() {
  const session = await requireSession("TEAM");
  const announcements = await getAnnouncementsForTeam(session.user.teamId);

  return (
    <div>
      <PageHeader
        title="Anúncios"
        description="Atualizações oficiais dos organizadores do torneio."
      />

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
              <p className="mt-1 text-sm text-zinc-400">{formatDate(item.date)}</p>
              {item.sport ? (
                <Badge className="mt-2">{item.sport.name}</Badge>
              ) : null}
              <p className="mt-3 text-zinc-300">{item.message}</p>
            </CardContent>
          </Card>
        ))}
        {!announcements.length ? (
          <Card>
            <CardContent className="py-10 text-center text-zinc-500">
              Ainda sem anúncios.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
