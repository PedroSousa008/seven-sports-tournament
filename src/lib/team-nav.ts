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
  { href: "/team", label: "Home", icon: Home },
  { href: "/team/my-team", label: "My Team", icon: Users },
  { href: "/team/calendar", label: "Calendar", icon: Calendar },
  { href: "/team/sports", label: "Sports", icon: Trophy },
  { href: "/team/rankings", label: "Rankings", icon: BarChart3 },
  { href: "/team/announcements", label: "News", icon: Megaphone },
  { href: "/team/partners", label: "Partners", icon: Handshake },
  { href: "/team/store", label: "Store", icon: ShoppingBag },
  { href: "/team/profile", label: "Profile", icon: User },
];
