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
            Cinco Desportos
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            CINCO ARENAS. UMA COROA.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Cada modalidade conta para a classificação final. Os Karts fecham o
            torneio com a grande final mais decisiva.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SPORTS_SHOWCASE.map((sport, i) => {
            const featured = "featured" in sport && sport.featured;
            return (
              <motion.article
                key={sport.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.7 }}
                className={`group relative overflow-hidden rounded-3xl border ${
                  featured
                    ? "border-red-500/50 shadow-2xl shadow-red-600/20 md:col-span-2 xl:col-span-1 xl:row-span-2"
                    : "border-white/10"
                }`}
              >
                <div
                  className={`relative ${featured ? "h-[420px]" : "h-72"} overflow-hidden`}
                >
                  <Image
                    src={sport.image}
                    alt={sport.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  {featured ? (
                    <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                      Grande Final
                    </div>
                  ) : null}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
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
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
