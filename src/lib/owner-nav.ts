import {
  BarChart3,
  Calendar,
  Handshake,
  Home,
  Megaphone,
  Receipt,
  Settings,
  ShoppingBag,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import type { NavItem } from "@/components/layout/dashboard-shell";

export const ownerNav: NavItem[] = [
  { href: "/owner", label: "Início", icon: Home },
  { href: "/owner/teams", label: "Equipas", icon: Users },
  { href: "/owner/sports", label: "Desportos", icon: Trophy },
  { href: "/owner/calendar", label: "Calendário", icon: Calendar },
  { href: "/owner/rankings", label: "Resultados", icon: BarChart3 },
  { href: "/owner/partnerships", label: "Parcerias", icon: Handshake },
  { href: "/owner/revenue", label: "Receitas", icon: Wallet },
  { href: "/owner/costs", label: "Custos", icon: Receipt },
  { href: "/owner/store", label: "Loja", icon: ShoppingBag },
  { href: "/owner/announcements", label: "Comunicados", icon: Megaphone },
  { href: "/owner/settings", label: "Definições", icon: Settings },
];
