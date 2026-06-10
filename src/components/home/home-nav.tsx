"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="group">
          <p className="font-display text-xs tracking-[0.35em] text-red-500">
            T5DB
          </p>
          <p className="text-sm font-semibold text-white transition group-hover:text-red-400">
            Torneio 5 Desportos
          </p>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#desportos" className="transition hover:text-white">
            Desportos
          </a>
          <a href="#jornada" className="transition hover:text-white">
            Jornada
          </a>
          <a href="#classificacao" className="transition hover:text-white">
            Classificação
          </a>
          <a href="#galeria" className="transition hover:text-white">
            Galeria
          </a>
        </nav>

        <Link
          href="/login"
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 hover:shadow-red-500/30"
        >
          Entrar
        </Link>
      </div>
    </motion.header>
  );
}
