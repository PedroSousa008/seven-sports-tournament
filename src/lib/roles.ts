import type { UserRole } from "@prisma/client";

export const ROLE_HOME: Record<UserRole, string> = {
  OWNER: "/owner",
  TEAM: "/team",
};

export function roleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/owner")) return "OWNER";
  if (pathname.startsWith("/team")) return "TEAM";
  return null;
}
