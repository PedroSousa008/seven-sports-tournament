"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  MapPin,
  Trophy,
} from "lucide-react";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { DEFAULT_TEAM_BANNER, JOURNEY_STATUS_LABELS } from "@/lib/team-content";
import type { TeamHubData } from "@/lib/team-hub";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { SportCalendarView } from "@/components/calendar/sport-calendar-view";
import { SportDetailModal } from "./sport-detail-modal";
import type { SportCalendarData } from "@/lib/calendar";
import { TOURNAMENT } from "@/lib/constants";

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
        {eyebrow}
      </p>
      <h2 className="font-display mt-1 text-2xl tracking-wide text-white sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export function TeamHubView({
  data,
  calendars,
}: {
  data: TeamHubData;
  calendars: SportCalendarData[];
}) {
  const [selectedSport, setSelectedSport] = useState<
    TeamHubData["sportsHub"][number] | null
  >(null);
  const banner = data.team.bannerUrl || DEFAULT_TEAM_BANNER;
  const highlight = data.nextMatch ?? data.nextEvent;

  return (
    <div className="-mx-4 space-y-8 lg:-mx-8">
      {/* SECTION 1 — Team Hero */}
      <section className="relative min-h-[320px] overflow-hidden lg:min-h-[380px] lg:rounded-3xl">
        <Image src={banner} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${data.team.color}55, transparent 60%)`,
          }}
        />
        <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 lg:min-h-[380px] lg:p-10">
          <div className="flex items-end gap-4">
            <TeamAvatar
              name={data.team.name}
              color={data.team.color}
              logoUrl={data.team.logoUrl}
              size="lg"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                {data.team.captainName} · Capitão
              </p>
              <h1 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
                {data.team.name}
              </h1>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/15 bg-black/40 px-5 py-3 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-zinc-400">Posição</p>
              <p className="font-display text-3xl text-white">
                {data.position ? `#${data.position}` : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/40 px-5 py-3 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-zinc-400">Pontos</p>
              <p className="font-display text-3xl text-red-400">{data.totalPoints}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8 px-4 lg:px-8">
        {/* SECTION 2 — Next Event */}
        <section>
          <SectionTitle eyebrow="Em foco" title="Próximo Evento" />
          {highlight ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <div className="relative h-56 sm:h-64">
                <Image
                  src={data.nextMatch?.image ?? data.nextEvent?.image ?? ""}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                  {data.nextMatch?.sportName ?? data.nextEvent?.sportName ?? TOURNAMENT.name}
                </p>
                <h3 className="font-display mt-1 text-3xl text-white sm:text-4xl">
                  {data.nextMatch?.title ?? data.nextEvent?.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-red-500" />
                    {data.nextMatch?.scheduledAt
                      ? formatDateTime(data.nextMatch.scheduledAt)
                      : data.nextEvent
                        ? `${formatDate(data.nextEvent.date)}${data.nextEvent.time ? ` · ${data.nextEvent.time}` : ""}`
                        : ""}
                  </span>
                  {(data.nextMatch?.location ?? data.nextEvent?.location) ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-red-500" />
                      {data.nextMatch?.location ?? data.nextEvent?.location}
                    </span>
                  ) : null}
                </div>
                {data.nextMatch?.opponent ? (
                  <p className="mt-2 text-sm font-medium text-white">
                    Adversário: {data.nextMatch.opponent}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-zinc-500">
              Sem eventos agendados de momento.
            </div>
          )}
        </section>

        {/* SECTION 3 — Tournament Journey */}
        <section>
          <SectionTitle eyebrow="A jornada" title={`Roadmap ${TOURNAMENT.name}`} />
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {data.journey.map((step, i) => (
              <motion.div
                key={step.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative min-w-[160px] flex-1 shrink-0"
              >
                <div
                  className={`overflow-hidden rounded-2xl border ${
                    step.status === "next" || step.status === "live"
                      ? "border-red-500/50 shadow-lg shadow-red-600/10"
                      : "border-white/10"
                  }`}
                >
                  <div className="relative h-24">
                    <Image src={step.image} alt="" fill className="object-cover" sizes="160px" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="bg-black/60 p-3 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white">{step.name}</p>
                    <p className="text-xs text-zinc-400">{step.dateLabel}</p>
                    <p
                      className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                        step.status === "completed"
                          ? "text-emerald-400"
                          : step.status === "live" || step.status === "next"
                            ? "text-red-400"
                            : "text-zinc-500"
                      }`}
                    >
                      {JOURNEY_STATUS_LABELS[step.status]}
                    </p>
                  </div>
                </div>
                {i < data.journey.length - 1 ? (
                  <ChevronRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-zinc-600 sm:block" />
                ) : null}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — Ranking Podium */}
        <section>
          <SectionTitle eyebrow="Classificação" title="Top 5 Equipas" />
          <div className="grid gap-3 sm:grid-cols-5 sm:items-end">
            {data.ranking.map((entry, i) => (
              <motion.div
                key={entry.teamId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border p-4 text-center transition ${
                  entry.isUserTeam
                    ? "border-red-500/50 bg-red-500/10 shadow-lg shadow-red-600/10"
                    : "border-white/10 bg-white/[0.03]"
                } ${i === 0 ? "sm:order-2 sm:pb-8" : i === 1 ? "sm:order-1 sm:pb-4" : i === 2 ? "sm:order-3 sm:pb-2" : ""}`}
              >
                <div className="mx-auto mb-2 flex justify-center">
                  <TeamAvatar
                    name={entry.teamName}
                    color={entry.teamColor}
                    logoUrl={entry.logoUrl}
                    size="md"
                  />
                </div>
                <p className="font-display text-2xl text-amber-400">#{entry.position}</p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {entry.teamName}
                </p>
                <p className="text-xs text-zinc-400">{entry.totalPoints} pts</p>
                {entry.isUserTeam ? (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-400">
                    A tua equipa
                  </p>
                ) : null}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — Upcoming Events Carousel */}
        <section>
          <SectionTitle eyebrow="Calendário" title="Próximos Eventos" />
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {data.upcomingEvents.length ? (
              data.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative min-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10"
                >
                  <div className="relative h-36">
                    <Image src={event.image} alt="" fill className="object-cover" sizes="280px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xs text-red-400">{event.sportName}</p>
                    <p className="font-semibold text-white">{event.title}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDate(event.date)}
                      {event.time ? ` · ${event.time}` : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Sem eventos futuros.</p>
            )}
          </div>
        </section>

        {/* SECTION 6 — Sports Hub */}
        <section>
          <SectionTitle eyebrow="Modalidades" title="Sports Hub" />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.sportsHub.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => setSelectedSport(sport)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 text-left transition hover:border-red-500/40"
              >
                <div className="relative h-40">
                  <Image src={sport.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl">{sport.icon}</p>
                      <p className="font-display text-xl text-white">{sport.name}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                      {JOURNEY_STATUS_LABELS[sport.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    {sport.points} pts
                    {sport.groupPosition ? ` · Grupo #${sport.groupPosition}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 7 — Latest Results */}
        <section>
          <SectionTitle eyebrow="Resultados" title="Últimos Jogos" />
          <div className="space-y-3">
            {data.latestResults.length ? (
              data.latestResults.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="relative hidden h-20 w-20 shrink-0 sm:block">
                    <Image src={match.image} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                      {match.sportName}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {match.homeTeam}{" "}
                      <span className="text-red-400">
                        {match.homeScore ?? "–"}-{match.awayScore ?? "–"}
                      </span>{" "}
                      {match.awayTeam}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Ainda sem resultados publicados.</p>
            )}
          </div>
        </section>

        {/* SECTION — Calendar */}
        <section>
          <SectionTitle eyebrow="Calendário" title={`Calendário ${TOURNAMENT.name}`} />
          <p className="mb-4 text-sm text-zinc-500">
            A tua equipa está destacada a vermelho.
          </p>
          <SportCalendarView
            calendars={calendars}
            highlightTeamId={data.team.id}
            showDownload
            compact
          />
        </section>

        {/* SECTION 8 — Announcements */}
        <section>
          <SectionTitle eyebrow="Comunicados" title="Últimas Novidades" />
          <div className="space-y-4">
            {data.announcements.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative h-32 sm:h-36">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="800px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-zinc-500">{formatDate(item.date)}</p>
                    {item.sportName ? (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                        {item.sportName}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-zinc-400">{item.message}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 9 — Sponsor Highlights */}
        {(data.promotions.length > 0 || data.storeItems.length > 0) && (
          <section>
            <SectionTitle eyebrow="Parceiros" title="Destaques & Ofertas" />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {data.promotions.slice(0, 4).map((promo) => (
                <div
                  key={promo.id}
                  className="min-w-[240px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  {promo.partnerLogo ? (
                    <img
                      src={promo.partnerLogo}
                      alt={promo.partnerName}
                      className="mb-3 h-8 max-w-[120px] object-contain"
                    />
                  ) : (
                    <p className="mb-2 text-xs font-semibold text-zinc-500">
                      {promo.partnerName}
                    </p>
                  )}
                  <p className="font-semibold text-white">{promo.title}</p>
                  {promo.code ? (
                    <p className="mt-2 text-sm text-red-400">Código: {promo.code}</p>
                  ) : null}
                </div>
              ))}
            </div>
            {data.storeItems[0] ? (
              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs uppercase tracking-wider text-amber-400">Loja {TOURNAMENT.name}</p>
                <p className="mt-1 font-semibold text-white">{data.storeItems[0].name}</p>
                {data.storeItems[0].price ? (
                  <p className="text-sm text-zinc-400">
                    {formatCurrency(data.storeItems[0].price)}
                  </p>
                ) : null}
              </div>
            ) : null}
          </section>
        )}
      </div>

      <SportDetailModal sport={selectedSport} onClose={() => setSelectedSport(null)} />
    </div>
  );
}
