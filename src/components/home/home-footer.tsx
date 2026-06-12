import { TOURNAMENT } from "@/lib/constants";

export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-lg text-white">
            {TOURNAMENT.name.toUpperCase()}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {TOURNAMENT.dateRange} · Braga, Portugal
          </p>
        </div>
        <p className="text-xs text-zinc-600">
          © 2026 {TOURNAMENT.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
