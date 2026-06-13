import { PageHeader } from "@/components/layout/page-header";
import { ApplicationsManager } from "@/components/owner/applications-manager";
import { prisma } from "@/lib/db";

export default async function OwnerApplicationsPage() {
  const applications = await prisma.teamApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pending = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div>
      <PageHeader
        title="Inscrições"
        description={`Lista de espera de candidaturas de equipas. ${pending} pendente${pending !== 1 ? "s" : ""}.`}
      />
      <ApplicationsManager applications={applications} />
    </div>
  );
}
