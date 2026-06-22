import { Instagram } from "lucide-react";
import { TOURNAMENT } from "@/lib/constants";

const KARTODROMO_INSTAGRAM_URL =
  "https://www.instagram.com/kartodromo_braga?igsh=amV0dTRlOXNkYmN3";

export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 text-center md:grid-cols-3 md:gap-6">
        <div className="md:text-left">
          <p className="font-display text-lg text-white">
            {TOURNAMENT.name.toUpperCase()}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {TOURNAMENT.dateRange} · {TOURNAMENT.locationFull}
          </p>
        </div>

        <div className="flex justify-center">
          <a
            href={KARTODROMO_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Instagram @kartodromo_braga"
          >
            <Instagram className="h-4 w-4 shrink-0" />
            <span>@kartodromo_braga</span>
          </a>
        </div>

        <p className="text-xs text-zinc-600 md:text-right">
          © 2026 {TOURNAMENT.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
