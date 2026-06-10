import type { NavItem } from "@/components/layout/dashboard-shell";

export const teamNav: NavItem[] = [
  { href: "/team", label: "Início", icon: "home" },
  { href: "/team/my-team", label: "A Minha Equipa", icon: "users" },
  { href: "/team/calendar", label: "Calendário", icon: "calendar" },
  { href: "/team/sports", label: "Desportos", icon: "trophy" },
  { href: "/team/rankings", label: "Classificações", icon: "bar-chart" },
  { href: "/team/announcements", label: "Comunicados", icon: "megaphone" },
  { href: "/team/partners", label: "Parceiros", icon: "handshake" },
  { href: "/team/store", label: "Loja", icon: "shopping-bag" },
  { href: "/team/profile", label: "Perfil", icon: "user" },
];
