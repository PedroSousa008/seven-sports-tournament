import { TeamHubView } from "@/components/team/team-hub-view";
import { getAllSportCalendars } from "@/lib/calendar";
import { getTeamHubData } from "@/lib/team-hub";
import { requireSession } from "@/lib/session";

export default async function TeamHomePage() {
  const session = await requireSession("TEAM");
  const [data, calendars] = await Promise.all([
    getTeamHubData(session.user.teamId!),
    getAllSportCalendars(),
  ]);

  return <TeamHubView data={data} calendars={calendars} />;
}
