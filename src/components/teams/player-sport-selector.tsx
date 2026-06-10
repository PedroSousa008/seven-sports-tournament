"use client";

import { useTransition } from "react";
import { togglePlayerSportAction } from "@/lib/actions";

export function PlayerSportSelector({
  playerId,
  sports,
  selectedSportIds,
  locked,
}: {
  playerId: string;
  sports: { id: string; name: string; slug: string; maxPlayers: number }[];
  selectedSportIds: string[];
  locked?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {sports.map((sport) => {
        const selected = selectedSportIds.includes(sport.id);
        return (
          <button
            key={sport.id}
            type="button"
            disabled={locked || pending}
            onClick={() =>
              startTransition(() =>
                togglePlayerSportAction(playerId, sport.id, !selected)
              )
            }
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selected
                ? "bg-red-600 text-white"
                : "border border-white/10 text-zinc-400"
            }`}
          >
            {sport.name}
          </button>
        );
      })}
    </div>
  );
}
