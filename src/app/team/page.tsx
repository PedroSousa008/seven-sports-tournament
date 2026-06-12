import { TeamHubView } from "@/components/team/team-hub-view";
import { getTeamHubData } from "@/lib/team-hub";
import { requireSession } from "@/lib/session";

export default async function TeamHomePage() {
  const session = await requireSession("TEAM");
  const data = await getTeamHubData(session.user.teamId!);

  return <TeamHubView data={data} />;
}
