import { PageHeader } from "@/components/layout/page-header";
import {
  ApplicationsManager,
  type ApplicationRecord,
} from "@/components/owner/applications-manager";
import { getOwnerApplications } from "@/lib/applications";

export default async function OwnerApplicationsPage() {
  const { teamApplications, individualApplications } =
    await getOwnerApplications();

  const applications: ApplicationRecord[] = [
    ...teamApplications.map((data) => ({ type: "TEAM" as const, data })),
    ...individualApplications.map((data) => ({
      type: "INDIVIDUAL" as const,
      data,
    })),
  ].sort(
    (a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime()
  );

  const pending = applications.filter(
    (a) => a.data.status === "PENDING"
  ).length;

  return (
    <div>
      <PageHeader
        title="Inscrições"
        description={`Lista de espera de candidaturas de equipas e atletas individuais. ${pending} pendente${pending !== 1 ? "s" : ""}.`}
      />
      <ApplicationsManager applications={applications} />
    </div>
  );
}
