import type { NavItem } from "@/components/layout/dashboard-shell";

export const ownerNav: NavItem[] = [
  { href: "/owner", label: "Início", icon: "home" },
  { href: "/owner/inscricoes", label: "Inscrições", icon: "clipboard-list" },
  { href: "/owner/teams", label: "Equipas", icon: "users" },
  { href: "/owner/sports", label: "Desportos", icon: "trophy" },
  { href: "/owner/calendar", label: "Calendário", icon: "calendar" },
  { href: "/owner/rankings", label: "Classificações", icon: "bar-chart" },
  { href: "/owner/partnerships", label: "Parcerias", icon: "handshake" },
  { href: "/owner/revenue", label: "Receitas", icon: "wallet" },
  { href: "/owner/costs", label: "Custos", icon: "receipt" },
  { href: "/owner/store", label: "Loja", icon: "shopping-bag" },
  { href: "/owner/announcements", label: "Comunicados", icon: "megaphone" },
  { href: "/owner/settings", label: "Configurações", icon: "settings" },
];
