import Link from "next/link";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTournamentSettings } from "@/lib/tournament";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const settings = await getTournamentSettings();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Braga · Julho 2026
            </p>
            <h1 className="text-xl font-bold">
              {settings?.name ?? "Torneio 5 Desportos Braga"}
            </h1>
          </div>
          <Link href="/login">
            <Button>Iniciar sessão</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Torneio multidesportivo
          </p>
          <h2 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            A plataforma completa para equipas e organizadores.
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Gira inscrições, calendários, classificações, parcerias e
            comunicações do Torneio 5 Desportos Braga — Futebol 7, Padel,
            Karts, Ténis e Voleibol.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login">
              <Button size="lg">Entrar na plataforma</Button>
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "12 equipas", value: "Máx. 10 jogadores" },
            {
              icon: Calendar,
              label: settings
                ? `${formatDate(settings.startDate)} – ${formatDate(settings.endDate)}`
                : "04–09 julho",
              value: "Semana do torneio",
            },
            { icon: MapPin, label: "Braga", value: "Portugal" },
            { icon: Trophy, label: "5 desportos", value: "Classificação global" },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent>
                <item.icon className="h-5 w-5 text-red-500" />
                <p className="mt-4 text-lg font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-sm text-zinc-400">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent>
              <p className="text-sm uppercase tracking-wide text-red-500">
                Acesso de organizador
              </p>
              <h3 className="mt-2 text-2xl font-bold">Painel do organizador</h3>
              <p className="mt-3 text-zinc-400">
                Controlo total sobre equipas, desportos, calendário, classificações,
                receitas, custos, parcerias e anúncios.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm uppercase tracking-wide text-red-500">
                Acesso de equipa
              </p>
              <h3 className="mt-2 text-2xl font-bold">Portal do capitão</h3>
              <p className="mt-3 text-zinc-400">
                Gira o plantel, seleciona jogadores por desporto, acompanha horários,
                classificações, promoções e ofertas da loja.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
