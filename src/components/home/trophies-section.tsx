"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GRAND_TROPHY, SPORT_TROPHIES } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

type Trophy = (typeof SPORT_TROPHIES)[number] | typeof GRAND_TROPHY;

function TrophyCard({
  trophy,
  featured = false,
  delay = 0,
}: {
  trophy: Trophy;
  featured?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: featured ? 40 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
      className={`group relative ${featured ? "mx-auto w-full max-w-xl" : ""}`}
    >
      <div
        className={`absolute rounded-full bg-gradient-to-b ${trophy.accent} blur-2xl transition duration-700 group-hover:opacity-100 ${
          featured
            ? "-inset-8 opacity-60"
            : "-inset-4 opacity-0 group-hover:opacity-100"
        }`}
      />
      <div
        className={`relative overflow-hidden rounded-3xl border bg-zinc-950 text-center transition ${
          featured
            ? "border-amber-500/50 p-8 shadow-2xl shadow-amber-500/10 hover:border-amber-400/70 sm:p-10"
            : "border-white/10 p-6 hover:border-amber-500/30"
        }`}
      >
        <div
          className={`relative mx-auto mb-6 w-full overflow-hidden rounded-2xl ${
            featured ? "h-64 sm:h-80" : "h-48"
          }`}
        >
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <Image
            src={trophy.image}
            alt={`${trophy.subtitle} — ${trophy.title}`}
            fill
            className={`transition duration-700 group-hover:scale-105 object-contain p-2 ${
              featured ? "p-4" : ""
            }`}
            sizes={featured ? "512px" : "250px"}
          />
        </div>
        <p
          className={`font-semibold uppercase tracking-[0.2em] text-amber-500 ${
            featured
              ? "text-sm sm:text-base sm:tracking-[0.3em]"
              : "text-xs"
          }`}
        >
          {trophy.subtitle}
        </p>
        <h3
          className={`mt-2 font-semibold text-white ${
            featured ? "font-display text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          {trophy.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function TrophiesSection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-500">
            Troféus
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            A GLÓRIA ESPERA
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Quatro troféus de campeão por modalidade. Uma coroa suprema para os
            vencedores do torneio.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {SPORT_TROPHIES.map((trophy, i) => (
            <TrophyCard key={trophy.slug} trophy={trophy} delay={i * 0.08} />
          ))}
        </div>

        <div className="relative mt-16 sm:mt-20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <div className="mx-auto mt-16 max-w-2xl">
            <TrophyCard trophy={GRAND_TROPHY} featured delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
}
