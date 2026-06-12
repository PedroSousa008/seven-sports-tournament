"use client";

import { useTransition } from "react";
import { togglePlayerSportAction } from "@/lib/actions";

type Player = {
  id: string;
  name: string;
  sports: { sportId: string; sport: { name: string } }[];
};

type Sport = {
  id: string;
  name: string;
  slug: string;
  maxPlayers: number;
};

export function SportAssignmentBoard({
  players,
  sports,
  locked,
}: {
  players: Player[];
  sports: Sport[];
  locked?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleDrop(sportId: string, playerId: string) {
    if (locked || pending) return;
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    const selected = player.sports.some((s) => s.sportId === sportId);
    startTransition(() => togglePlayerSportAction(playerId, sportId, !selected));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sports.map((sport) => {
        const assigned = players.filter((p) =>
          p.sports.some((s) => s.sportId === sport.id)
        );
        return (
          <div
            key={sport.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const playerId = e.dataTransfer.getData("playerId");
              if (playerId) handleDrop(sport.id, playerId);
            }}
            className="min-h-[180px] rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 transition hover:border-red-500/30"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">{sport.name}</p>
              <span className="text-xs text-zinc-500">
                {assigned.length}/{sport.maxPlayers}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {assigned.length ? (
                assigned.map((player) => (
                  <span
                    key={player.id}
                    className="rounded-full bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-300"
                  >
                    {player.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-zinc-600">
                  Arrasta jogadores para aqui
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DraggablePlayerCard({
  player,
  locked,
}: {
  player: Player;
  locked?: boolean;
}) {
  return (
    <div
      draggable={!locked}
      onDragStart={(e) => e.dataTransfer.setData("playerId", player.id)}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4 ${
        locked ? "opacity-60" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/20 text-lg font-bold text-red-300">
        {player.name.slice(0, 2).toUpperCase()}
      </div>
      <p className="mt-3 font-semibold text-white">{player.name}</p>
      <p className="mt-2 text-xs text-zinc-500">
        {player.sports.length
          ? player.sports.map((s) => s.sport.name).join(" · ")
          : "Sem modalidades"}
      </p>
    </div>
  );
}
