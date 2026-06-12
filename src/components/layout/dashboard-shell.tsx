"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { TOURNAMENT } from "@/lib/constants";
import {
  BarChart3,
  Calendar,
  Handshake,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Receipt,
  Settings,
  ShoppingBag,
  Trophy,
  User,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  trophy: Trophy,
  calendar: Calendar,
  "bar-chart": BarChart3,
  handshake: Handshake,
  wallet: Wallet,
  receipt: Receipt,
  "shopping-bag": ShoppingBag,
  megaphone: Megaphone,
  settings: Settings,
  user: User,
};

export type NavItem = {
  href: string;
  label: string;
  icon: string;
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Home;
  return <Icon className={className} />;
}

export function DashboardShell({
  title,
  subtitle,
  navItems,
  children,
}: {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn("space-y-1", mobile && "px-4 py-4")}>
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== navItems[0].href && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <NavIcon name={item.icon} className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-zinc-950 lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              {TOURNAMENT.shortName}
            </p>
            <h1 className="mt-2 text-xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <NavLinks />
          </div>
          <div className="border-t border-white/10 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              Terminar sessão
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-red-500">
                  {title}
                </p>
                <p className="text-sm text-zinc-400">{subtitle}</p>
              </div>
              <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-xl border border-white/10 p-2"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            {open ? (
              <div className="border-t border-white/10 bg-zinc-950 pb-4">
                <NavLinks mobile />
                <div className="px-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="h-4 w-4" />
                    Terminar sessão
                  </Button>
                </div>
              </div>
            ) : null}
          </header>

          <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">
            {children}
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-zinc-950/95 backdrop-blur lg:hidden">
            <div className="grid grid-cols-4 gap-1 px-2 py-2">
              {navItems.slice(0, 4).map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium",
                      active ? "text-red-400" : "text-zinc-500"
                    )}
                  >
                    <NavIcon name={item.icon} className="h-4 w-4" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
