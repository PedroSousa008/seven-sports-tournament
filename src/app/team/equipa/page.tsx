import { EquipaView } from "@/components/team/equipa-view";
import { getTeamEquipaData } from "@/lib/team-hub";
import { requireSession } from "@/lib/session";

export default async function TeamEquipaPage() {
  const session = await requireSession("TEAM");
  const { team, sports } = await getTeamEquipaData(session.user.teamId!);
  if (!team) return null;

  return <EquipaView team={team} sports={sports} />;
}
