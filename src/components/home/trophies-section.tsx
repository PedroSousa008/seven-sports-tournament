"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TROPHIES } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

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
            Cinco troféus por modalidade. Uma coroa para o grande campeão do
            torneio.
          </p>
        </FadeIn>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TROPHIES.map((trophy, i) => {
            const featured = "featured" in trophy && trophy.featured;

            return (
              <motion.div
                key={trophy.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="group relative"
              >
                <div
                  className={`absolute -inset-4 rounded-full bg-gradient-to-b ${trophy.accent} opacity-0 blur-2xl transition duration-700 group-hover:opacity-100`}
                />
                <div
                  className={`relative overflow-hidden rounded-3xl border bg-zinc-950 p-6 text-center transition ${
                    featured
                      ? "border-amber-500/40 hover:border-amber-400/60"
                      : "border-white/10 hover:border-amber-500/30"
                  }`}
                >
                  <div className="relative mx-auto mb-6 h-48 w-full overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                    <Image
                      src={trophy.image}
                      alt={`${trophy.subtitle} — ${trophy.title}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="250px"
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                    {trophy.subtitle}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {trophy.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
