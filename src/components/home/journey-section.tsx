"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { JOURNEY } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

export function JourneySection() {
  return (
    <section id="jornada" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn className="mb-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            A Jornada
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            SEIS DIAS PARA A HISTÓRIA
          </h2>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-red-500/80 via-white/20 to-red-500/80 md:left-1/2 md:block" />

          <div className="space-y-16">
            {JOURNEY.map((step, i) => {
              const featured = "featured" in step && step.featured;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step.day}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8 }}
                  className={`relative grid items-center gap-8 md:grid-cols-2 ${
                    isLeft ? "" : "md:[&>div:first-child]:order-2"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl border ${
                      featured
                        ? "border-red-500/40 shadow-xl shadow-red-600/10"
                        : "border-white/10"
                    }`}
                  >
                    <div className="relative h-64 sm:h-80">
                      <Image
                        src={step.image}
                        alt={step.sport}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  </div>

                  <div className={`${isLeft ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                      {step.day} · {step.date}
                    </p>
                    <h3
                      className={`font-display mt-3 text-white ${
                        featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
                      }`}
                    >
                      {step.sport}
                    </h3>
                    {featured ? (
                      <p className="mt-4 text-zinc-400">
                        O clímax do torneio. A modalidade com maior peso na
                        classificação final.
                      </p>
                    ) : null}
                  </div>

                  <div className="absolute left-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full border-4 border-black bg-red-500 md:left-1/2 md:-translate-x-1/2 md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
