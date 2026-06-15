import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ownerNav } from "@/lib/owner-nav";
import { TOURNAMENT } from "@/lib/constants";
import { requireSession } from "@/lib/session";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession("OWNER");

  return (
    <DashboardShell
      title="Painel do Organizador"
      subtitle={`Centro de controlo · ${TOURNAMENT.name}`}
      navItems={ownerNav}
    >
      {children}
    </DashboardShell>
  );
}
