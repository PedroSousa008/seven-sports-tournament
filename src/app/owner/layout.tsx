import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ownerNav } from "@/lib/owner-nav";
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
      subtitle="Centro de controlo do torneio"
      navItems={ownerNav}
    >
      {children}
    </DashboardShell>
  );
}
