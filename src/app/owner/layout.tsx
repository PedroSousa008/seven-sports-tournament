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
      title="Owner Dashboard"
      subtitle="Tournament control center"
      navItems={ownerNav}
    >
      {children}
    </DashboardShell>
  );
}
