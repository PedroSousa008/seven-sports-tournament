"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { TeamAvatar } from "@/components/ui/team-avatar";
import type { OwnerTeamOption } from "@/lib/owner-rankings";

export function TeamSearchSelect({
  teams,
  value,
  onChange,
  disabledTeamIds = [],
  placeholder = "Selecionar equipa...",
}: {
  teams: OwnerTeamOption[];
  value: string | null;
  onChange: (teamId: string | null) => void;
  disabledTeamIds?: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = teams.find((team) => team.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter((team) => {
      if (!q) return true;
      return team.name.toLowerCase().includes(q);
    });
  }, [teams, query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 px-3 text-left text-sm transition hover:border-red-500/30"
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2">
            <TeamAvatar
              name={selected.name}
              color={selected.color}
              logoUrl={selected.logoUrl}
              size="sm"
            />
            <span className="truncate text-white">{selected.name}</span>
          </span>
        ) : (
          <span className="text-zinc-500">{placeholder}</span>
        )}
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="Fechar"
          />
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="border-b border-white/10 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar equipa..."
                  className="h-10 w-full rounded-lg border border-white/10 bg-black/50 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto p-1">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-zinc-400 hover:bg-white/5"
              >
                Sem equipa
              </button>
              {filtered.map((team) => {
                const disabled =
                  disabledTeamIds.includes(team.id) && team.id !== value;
                return (
                  <button
                    key={team.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(team.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                      disabled
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <TeamAvatar
                      name={team.name}
                      color={team.color}
                      logoUrl={team.logoUrl}
                      size="sm"
                    />
                    <span className="truncate text-white">{team.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
