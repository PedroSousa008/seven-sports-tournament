export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-lg text-white">TORNEIO 5 DESPORTOS BRAGA</p>
          <p className="mt-1 text-sm text-zinc-500">04–09 Julho 2026 · Braga, Portugal</p>
        </div>
        <p className="text-xs text-zinc-600">
          © 2026 Torneio 5 Desportos Braga. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
