"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      start = Math.round(value * eased);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-6xl text-white sm:text-7xl">
      {display}
    </span>
  );
}

export function StatsSection() {
  return (
    <section id="estatisticas" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            O Torneio em Números
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            UMA COMPETIÇÃO À ESCALA DA GLÓRIA
          </h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl transition hover:border-red-500/30 hover:bg-white/[0.06]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
              <AnimatedNumber value={stat.value} />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
