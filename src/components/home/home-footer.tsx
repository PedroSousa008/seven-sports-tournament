import { TOURNAMENT } from "@/lib/constants";

const KARTODROMO_INSTAGRAM_URL =
  "https://www.instagram.com/kartodromo_braga?igsh=amV0dTRlOXNkYmN3";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

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
            <InstagramIcon className="h-4 w-4 shrink-0" />
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
