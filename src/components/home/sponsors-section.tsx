"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SPONSOR_CATEGORIES } from "@/lib/home-content";
import { FadeIn } from "./fade-in";

type Sponsor = {
  id: string;
  brandName: string;
  logoUrl: string | null;
  partnershipType: string;
  websiteUrl?: string | null;
  logoFit?: "fill" | "fit";
};

function PartnerLogoCard({ partner }: { partner: Sponsor }) {
  const fill = partner.logoFit === "fill";

  const content = partner.logoUrl ? (
    <Image
      src={partner.logoUrl}
      alt={partner.brandName}
      fill
      className={fill ? "object-cover" : "object-contain p-4"}
      sizes="220px"
    />
  ) : (
    <span className="text-lg font-bold text-zinc-900">{partner.brandName}</span>
  );

  const className = fill
    ? "relative block h-28 w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/20 transition hover:border-white/25"
    : "relative flex h-28 w-[220px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg shadow-black/20 transition hover:border-white/25 hover:bg-white/95";

  const motionProps = {
    whileHover: { scale: 1.05, y: -4 } as const,
    className,
  };

  if (partner.websiteUrl) {
    return (
      <motion.a
        href={partner.websiteUrl}
        target="_blank"
        rel="noreferrer"
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return <motion.div {...motionProps}>{content}</motion.div>;
}

export function SponsorsSection({ partners }: { partners: Sponsor[] }) {
  const grouped = SPONSOR_CATEGORIES.map((cat) => ({
    ...cat,
    partners: partners.filter((p) => p.partnershipType === cat.type),
  }));

  const hasPartners = partners.length > 0;

  return (
    <section className="border-y border-white/10 bg-zinc-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            Patrocinadores & Parceiros
          </p>
          <h2 className="font-display mt-4 text-4xl text-white sm:text-5xl">
            MARCAS QUE FAZEM PARTE DA LENDA
          </h2>
        </FadeIn>

        {hasPartners ? (
          <div className="space-y-14">
            {grouped.map(
              (group) =>
                group.partners.length > 0 && (
                  <div key={group.type}>
                    <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                      {group.partners.map((partner) => (
                        <PartnerLogoCard key={partner.id} partner={partner} />
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPONSOR_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-400">
                    {cat.label}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">Em breve</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
