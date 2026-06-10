"use client";

import { FadeIn } from "./fade-in";
import { LeaderboardRow } from "./leaderboard-section";
import type { RankingEntry } from "@/lib/rankings";

export function LeaderboardClient({ top5 }: { top5: RankingEntry[] }) {
  return (
    <>
      <FadeIn className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
          Classificação ao Vivo
        </p>
        <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
          QUEM LIDERA A CORRIDA?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Atualizado automaticamente com os resultados de cada modalidade.
        </p>
      </FadeIn>

      {top5.length > 0 ? (
        <div className="space-y-3">
          {top5.map((entry, i) => (
            <LeaderboardRow key={entry.teamId} entry={entry} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
          <p className="font-display text-3xl text-white">A COMPETIÇÃO COMEÇA EM BREVE</p>
          <p className="mt-4 text-zinc-500">
            A classificação será revelada assim que as equipas entrarem em ação.
          </p>
        </div>
      )}
    </>
  );
}
