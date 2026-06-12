"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { TOURNAMENT } from "@/lib/constants";
import {
  Handshake,
  Home,
  LogOut,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  handshake: Handshake,
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

function isActive(pathname: string, href: string) {
  if (href === "/team") return pathname === "/team";
  return pathname.startsWith(href);
}

export function TeamPortalShell({
  teamName,
  navItems,
  children,
}: {
  teamName: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.12),transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.03),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              {TOURNAMENT.shortName}
            </p>
            <h1 className="font-display mt-2 text-2xl tracking-wide">{teamName}</h1>
            <p className="mt-1 text-sm text-zinc-500">Portal da equipa</p>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive(pathname, item.href)
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <NavIcon name={item.icon} className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Terminar sessão
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-500">
                  {TOURNAMENT.shortName}
                </p>
                <p className="font-display text-lg tracking-wide">{teamName}</p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-xl border border-white/10 p-2 text-zinc-400"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 pb-28 lg:px-8 lg:py-8 lg:pb-8">
            {children}
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-semibold transition",
                      active
                        ? "bg-red-600/15 text-red-400"
                        : "text-zinc-500"
                    )}
                  >
                    <NavIcon name={item.icon} className="h-5 w-5" />
                    <span>{item.label}</span>
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
