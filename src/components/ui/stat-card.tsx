import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Megaphone,
  Receipt,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const STAT_ICONS: Record<string, LucideIcon> = {
  users: Users,
  wallet: Wallet,
  "trending-up": TrendingUp,
  trophy: Trophy,
  calendar: Calendar,
  megaphone: Megaphone,
  receipt: Receipt,
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "red",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: string;
  accent?: "red" | "white" | "green";
}) {
  const Icon = STAT_ICONS[icon] ?? Users;
  const accentClasses = {
    red: "text-red-400 bg-red-500/10",
    white: "text-white bg-white/10",
    green: "text-emerald-400 bg-emerald-500/10",
  };

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
        </div>
        <div className={cn("rounded-2xl p-3", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
