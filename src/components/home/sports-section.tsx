"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SPORTS_SHOWCASE } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

export function SportsSection() {
  return (
    <section id="desportos" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            Quatro Desportos
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            QUATRO ARENAS. UMA COROA.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Cada modalidade conta para a classificação final. Os Karts fecham o
            torneio com a grande final mais decisiva.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          {SPORTS_SHOWCASE.map((sport, i) => (
            <motion.article
              key={sport.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="group relative h-[420px] overflow-hidden rounded-3xl border border-white/10"
            >
              <Image
                src={sport.image}
                alt={sport.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-3xl">{sport.icon}</p>
                <h3 className="font-display mt-2 text-3xl text-white">
                  {sport.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-red-400">
                  {sport.format}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {sport.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
