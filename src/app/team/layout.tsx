import { TeamPortalShell } from "@/components/team/team-portal-shell";
import { teamNav } from "@/lib/team-nav";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession("TEAM");
  const team = session.user.teamId
    ? await prisma.team.findUnique({ where: { id: session.user.teamId } })
    : null;

  return (
    <TeamPortalShell teamName={team?.name ?? "Portal da Equipa"} navItems={teamNav}>
      {children}
    </TeamPortalShell>
  );
}
