import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/roles";
import type { UserRole } from "@prisma/client";

export const requireSession = cache(async (expectedRole?: UserRole) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (expectedRole && session.user.role !== expectedRole) {
    redirect(ROLE_HOME[session.user.role]);
  }
  return session;
});
