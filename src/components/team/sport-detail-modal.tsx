"use client";

import { X } from "lucide-react";
import Image from "next/image";
import type { TeamHubData } from "@/lib/team-hub";
import { JOURNEY_STATUS_LABELS } from "@/lib/team-content";

export function SportDetailModal({
  sport,
  onClose,
}: {
  sport: TeamHubData["sportsHub"][number] | null;
  onClose: () => void;
}) {
  if (!sport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="relative h-48">
          <Image src={sport.image} alt="" fill className="object-cover" sizes="512px" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-3xl">{sport.icon}</p>
          <h2 className="font-display mt-2 text-3xl text-white">{sport.name}</h2>
          <p className="mt-1 text-sm text-red-400">
            {JOURNEY_STATUS_LABELS[sport.status]}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs text-zinc-500">Pontos</p>
              <p className="font-display text-2xl text-white">{sport.points}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs text-zinc-500">Grupo</p>
              <p className="font-display text-2xl text-white">
                {sport.groupPosition ? `#${sport.groupPosition}` : "—"}
              </p>
            </div>
          </div>
          {sport.nextMatch ? (
            <div className="mt-4 rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Próximo jogo
              </p>
              <p className="mt-1 font-medium text-white">{sport.nextMatch}</p>
            </div>
          ) : null}
          {sport.recentResults.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
                Resultados recentes
              </p>
              <ul className="space-y-2">
                {sport.recentResults.map((result) => (
                  <li
                    key={result}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300"
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
