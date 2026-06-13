"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "./fade-in";

export function CtaSection() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <Image
        src="/home/cta/fundo.jpg"
        alt="Pódio e celebração"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />

      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-500">
            Junta-te à competição
          </p>
          <h2 className="font-display mt-6 max-w-4xl text-4xl leading-tight text-white sm:text-6xl md:text-7xl">
            ESTÁS PRONTO PARA REPRESENTAR A TUA EQUIPA?
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mt-12"
          >
            <Link
              href="/inscricao"
              className="inline-block rounded-full bg-red-600 px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-2xl shadow-red-600/40 transition hover:bg-red-500"
            >
              INSCREVE-TE
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
