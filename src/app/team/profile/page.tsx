import { ProfileView } from "@/components/team/profile-view";
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
    <ProfileView
      team={{
        id: team.id,
        name: team.name,
        color: team.color,
        logoUrl: team.logoUrl,
        bannerUrl: team.bannerUrl,
        captainName: team.captainName,
        captainEmail: team.captainEmail,
        phone: team.phone,
        userEmail: team.user?.email ?? team.captainEmail,
      }}
    />
  );
}
