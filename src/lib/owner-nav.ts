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
  { href: "/owner", label: "Home", icon: Home },
  { href: "/owner/teams", label: "Teams", icon: Users },
  { href: "/owner/sports", label: "Sports", icon: Trophy },
  { href: "/owner/calendar", label: "Calendar", icon: Calendar },
  { href: "/owner/rankings", label: "Results", icon: BarChart3 },
  { href: "/owner/partnerships", label: "Partners", icon: Handshake },
  { href: "/owner/revenue", label: "Revenue", icon: Wallet },
  { href: "/owner/costs", label: "Costs", icon: Receipt },
  { href: "/owner/store", label: "Store", icon: ShoppingBag },
  { href: "/owner/announcements", label: "News", icon: Megaphone },
  { href: "/owner/settings", label: "Settings", icon: Settings },
];
