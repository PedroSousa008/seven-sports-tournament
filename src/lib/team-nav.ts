import {
  Calendar,
  Handshake,
  Home,
  Megaphone,
  ShoppingBag,
  Trophy,
  User,
  Users,
  BarChart3,
} from "lucide-react";
import type { NavItem } from "@/components/layout/dashboard-shell";

export const teamNav: NavItem[] = [
  { href: "/team", label: "Início", icon: Home },
  { href: "/team/my-team", label: "A Minha Equipa", icon: Users },
  { href: "/team/calendar", label: "Calendário", icon: Calendar },
  { href: "/team/sports", label: "Desportos", icon: Trophy },
  { href: "/team/rankings", label: "Classificações", icon: BarChart3 },
  { href: "/team/announcements", label: "Comunicados", icon: Megaphone },
  { href: "/team/partners", label: "Parceiros", icon: Handshake },
  { href: "/team/store", label: "Loja", icon: ShoppingBag },
  { href: "/team/profile", label: "Perfil", icon: User },
];
