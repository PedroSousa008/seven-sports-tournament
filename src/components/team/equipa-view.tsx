"use client";

import Image from "next/image";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPlayerAction, deletePlayerAction } from "@/lib/actions";
import { SPORTS } from "@/lib/constants";
import { DEFAULT_TEAM_BANNER } from "@/lib/team-content";
import {
  DraggablePlayerCard,
  SportAssignmentBoard,
} from "./sport-assignment-board";

type Team = {
  id: string;
  name: string;
  color: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  captainName: string;
  selectionsLocked: boolean;
  players: Array<{
    id: string;
    name: string;
    age: number | null;
    phone: string | null;
    available: boolean;
    sports: { sportId: string; sport: { name: string } }[];
  }>;
};

type Sport = {
  id: string;
  name: string;
  slug: string;
};

export function EquipaView({
  team,
  sports,
}: {
  team: Team;
  sports: Sport[];
}) {
  const banner = team.bannerUrl || DEFAULT_TEAM_BANNER;
  const sportsWithLimits = sports.map((sport) => ({
    ...sport,
    maxPlayers: SPORTS.find((s) => s.slug === sport.slug)?.maxPlayers ?? 10,
  }));

  return (
    <div className="space-y-8">
      <section className="relative min-h-[260px] overflow-hidden rounded-3xl border border-white/10">
        <Image src={banner} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="relative flex min-h-[260px] flex-col justify-end p-6">
          <div className="flex items-end gap-4">
            <TeamAvatar
              name={team.name}
              color={team.color}
              logoUrl={team.logoUrl}
              size="lg"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-red-400">
                Capitão · {team.captainName}
              </p>
              <h1 className="font-display text-4xl tracking-wide text-white">
                {team.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {!team.selectionsLocked ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-display text-xl text-white">Adicionar jogador</h2>
          <form
            action={createPlayerAction.bind(null, team.id)}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <Input name="name" placeholder="Nome" required />
            <Input name="age" type="number" placeholder="Idade" />
            <Input name="phone" placeholder="Telefone" />
            <Input name="email" placeholder="Email" />
            <Button type="submit" className="sm:col-span-2 sm:w-fit">
              Adicionar à equipa
            </Button>
          </form>
        </section>
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Seleções bloqueadas pelo organizador.
        </div>
      )}

      <section>
        <h2 className="font-display mb-4 text-2xl text-white">Plantel</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {team.players.map((player) => (
            <div key={player.id} className="space-y-3">
              <DraggablePlayerCard player={player} locked={team.selectionsLocked} />
              {!team.selectionsLocked ? (
                <form action={deletePlayerAction.bind(null, player.id)}>
                  <Button type="submit" variant="ghost" className="w-full text-zinc-500">
                    Remover
                  </Button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-2 text-2xl text-white">
          Atribuição por modalidade
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Arrasta os jogadores para cada desporto.
        </p>
        <SportAssignmentBoard
          players={team.players}
          sports={sportsWithLimits}
          locked={team.selectionsLocked}
        />
      </section>
    </div>
  );
}
