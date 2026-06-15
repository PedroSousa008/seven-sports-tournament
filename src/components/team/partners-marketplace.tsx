"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TOURNAMENT } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type Promotion = {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  url: string | null;
  partnerName: string;
  partnerLogo: string | null;
};

type StoreItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  partnerName: string | null;
  contactUrl: string | null;
};

export function PartnersMarketplace({
  promotions,
  storeItems,
}: {
  promotions: Promotion[];
  storeItems: StoreItem[];
}) {
  const featured = promotions[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
          Marketplace
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-wide text-white sm:text-4xl">
          Parceiros & Ofertas
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Promoções exclusivas e produtos da {TOURNAMENT.name}.
        </p>
      </div>

      {featured ? (
        <section className="relative overflow-hidden rounded-3xl border border-red-500/30">
          <div className="relative h-48 bg-gradient-to-br from-red-600/30 to-black sm:h-56">
            {featured.partnerLogo ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src={featured.partnerLogo}
                  alt={featured.partnerName}
                  className="max-h-16 max-w-[200px] object-contain"
                />
              </div>
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-xs uppercase tracking-wider text-red-400">Destaque</p>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              {featured.title}
            </h2>
            {featured.description ? (
              <p className="mt-2 text-sm text-zinc-300">{featured.description}</p>
            ) : null}
            {featured.code ? (
              <p className="mt-3 inline-block rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white">
                {featured.code}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-display mb-4 text-xl text-white">Promoções</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {promotions.map((promo) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative h-28 bg-gradient-to-br from-zinc-800 to-black">
                {promo.partnerLogo ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <img
                      src={promo.partnerLogo}
                      alt=""
                      className="max-h-10 max-w-[120px] object-contain brightness-0 invert"
                    />
                  </div>
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-xs text-zinc-500">{promo.partnerName}</p>
                <h3 className="mt-1 font-semibold text-white">{promo.title}</h3>
                {promo.description ? (
                  <p className="mt-2 text-sm text-zinc-400">{promo.description}</p>
                ) : null}
                {promo.code ? (
                  <p className="mt-3 text-sm font-semibold text-red-400">
                    Código: {promo.code}
                  </p>
                ) : null}
                {promo.url ? (
                  <a href={promo.url} target="_blank" rel="noreferrer">
                    <Button variant="secondary" className="mt-4 w-full">
                      Ver oferta
                    </Button>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 text-xl text-white">Loja {TOURNAMENT.name}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {storeItems.map((item) => (
            <article
              key={item.id}
              className="min-w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative h-40 bg-zinc-900">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="260px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-red-400">
                    {item.name}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-white">{item.name}</p>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {item.description}
                  </p>
                ) : null}
                <p className="mt-3 font-display text-xl text-red-400">
                  {item.price ? formatCurrency(item.price) : "Sob consulta"}
                </p>
                {item.contactUrl ? (
                  <a href={item.contactUrl} target="_blank" rel="noreferrer">
                    <Button className="mt-3 w-full">Reservar</Button>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
