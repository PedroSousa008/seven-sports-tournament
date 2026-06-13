"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO_SLIDES, TOURNAMENT } from "@/lib/home-content";

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_SLIDES[index].image}
            alt={HERO_SLIDES[index].alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-red-500"
        >
          Braga · Portugal
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="font-display max-w-5xl text-5xl leading-[0.95] tracking-wide text-white sm:text-7xl md:text-8xl"
        >
          {TOURNAMENT.name.toUpperCase()}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-lg tracking-[0.25em] text-zinc-300 sm:text-xl"
        >
          {TOURNAMENT.dateRangeUpper}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 sm:gap-10 sm:text-base"
        >
          <span>12 Equipas</span>
          <span className="h-1 w-1 rounded-full bg-red-500" />
          <span>4 Desportos</span>
          <span className="h-1 w-1 rounded-full bg-red-500" />
          <span>1 Campeão</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/inscricao"
            className="rounded-full bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-2xl shadow-red-600/30 transition hover:scale-105 hover:bg-red-500"
          >
            INSCREVE-TE
          </Link>
          <a
            href="#desportos"
            className="rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
          >
            Explorar o Torneio
          </a>
          <a
            href="#calendario"
            className="rounded-full border border-white/10 px-8 py-4 text-sm font-bold uppercase tracking-wider text-zinc-300 backdrop-blur transition hover:border-red-500/40 hover:text-white"
          >
            Calendário
          </a>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-red-500" : "w-4 bg-white/30"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <a
        href="#estatisticas"
        className="absolute bottom-8 right-8 hidden animate-bounce text-zinc-500 transition hover:text-white md:block"
        aria-label="Scroll"
      >
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
}
