export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <p className="text-sm font-semibold tracking-[0.2em] text-emerald-400 uppercase">
            7 Sports
          </p>
          <p className="text-sm text-zinc-400">Tournament 2026</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-wide text-emerald-400 uppercase">
            Coming soon
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            7 Sports Tournament
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            The official home for teams, fixtures, standings, and everything
            you need to follow the tournament.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Teams", description: "Meet the squads competing this year." },
            { title: "Schedule", description: "Fixtures and match times in one place." },
            { title: "Results", description: "Live scores and final standings." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h2 className="text-lg font-medium text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-zinc-500">
          Built for the 7 Sports Tournament.
        </div>
      </footer>
    </div>
  );
}
