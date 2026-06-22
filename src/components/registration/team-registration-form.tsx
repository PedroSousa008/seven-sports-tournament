"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  MapPin,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { TOURNAMENT } from "@/lib/constants";
import {
  REGISTRATION_SUMMARY,
  REGISTRATION_TERMS,
} from "@/lib/applications";
import { submitTeamApplicationAction } from "@/lib/actions";

type TermKey =
  | "termCaptain"
  | "termSchedule"
  | "termRegisteredOnly"
  | "termConduct"
  | "termRegulation"
  | "termPayment";

const INITIAL_TERMS: Record<TermKey, boolean> = {
  termCaptain: false,
  termSchedule: false,
  termRegisteredOnly: false,
  termConduct: false,
  termRegulation: false,
  termPayment: false,
};

export function TeamRegistrationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [captainName, setCaptainName] = useState("");
  const [captainAge, setCaptainAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teamName, setTeamName] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [terms, setTerms] = useState(INITIAL_TERMS);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const allTermsAccepted = Object.values(terms).every(Boolean);
  const fieldsComplete =
    captainName.trim() !== "" &&
    captainAge.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    teamName.trim() !== "" &&
    playerCount.trim() !== "";
  const canSubmit =
    fieldsComplete && allTermsAccepted && declarationAccepted && !pending;

  function toggleTerm(key: TermKey) {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("captainName", captainName);
        fd.set("captainAge", captainAge);
        fd.set("email", email);
        fd.set("phone", phone);
        fd.set("teamName", teamName);
        fd.set("playerCount", playerCount);
        if (terms.termCaptain) fd.set("termCaptain", "on");
        if (terms.termSchedule) fd.set("termSchedule", "on");
        if (terms.termRegisteredOnly) fd.set("termRegisteredOnly", "on");
        if (terms.termConduct) fd.set("termConduct", "on");
        if (terms.termRegulation) fd.set("termRegulation", "on");
        if (terms.termPayment) fd.set("termPayment", "on");
        if (declarationAccepted) fd.set("declarationAccepted", "on");

        await submitTeamApplicationAction(fd);
        setSubmitted(true);
        onSuccess?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao submeter inscrição."
        );
      }
    });
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg px-6 py-24 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h1 className="font-display mt-8 text-4xl tracking-wide text-white">
          Inscrição Submetida com Sucesso
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          A tua candidatura foi adicionada à lista de espera. A organização irá
          analisar a informação submetida e entrará em contacto caso a equipa
          seja selecionada.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-red-600 px-10 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
        >
          Voltar ao Início
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="pb-32">
      <section className="relative overflow-hidden px-6 pb-12 pt-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-500">
            Lista de Espera
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight tracking-wide text-white sm:text-5xl">
            Inscrição para o {TOURNAMENT.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Submete a candidatura da tua equipa e entra na lista de espera para
            participar na {TOURNAMENT.name}, o maior evento multidesportivo de
            Braga.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]">
          <div className="border-b border-white/10 bg-red-600/10 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Resumo da {TOURNAMENT.name}
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <SummaryItem icon={MapPin} label="Local" value={REGISTRATION_SUMMARY.location} />
            <SummaryItem icon={Calendar} label="Datas" value={REGISTRATION_SUMMARY.dates} />
            <SummaryItem icon={Trophy} label="Modalidades" value="4 Desportos" />
            <SummaryItem
              icon={Users}
              label="Jogadores"
              value={REGISTRATION_SUMMARY.playersLabel}
            />
            <SummaryItem
              icon={Users}
              label="Vagas"
              value={`${REGISTRATION_SUMMARY.maxTeams} Equipas Disponíveis`}
            />
            <SummaryItem
              icon={Wallet}
              label="Inscrição"
              value={`${REGISTRATION_SUMMARY.price}€ por equipa`}
            />
          </div>
          <div className="border-t border-white/10 px-6 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Modalidades
            </p>
            <div className="flex flex-wrap gap-2">
              {REGISTRATION_SUMMARY.sports.map((sport) => (
                <span
                  key={sport}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 bg-amber-500/5 px-6 py-4">
            <p className="text-sm leading-relaxed text-amber-200/80">
              As vagas são limitadas. A submissão da candidatura não garante a
              participação no torneio. Todas as equipas serão analisadas pela
              organização.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
        >
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-display text-2xl tracking-wide text-white">
              Candidatura
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Preenche os dados do capitão e da equipa.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <Field label="Nome Completo do Capitão">
              <Input
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                placeholder="Ex: João Silva"
                required
                autoComplete="name"
              />
            </Field>

            <Field label="Idade">
              <Input
                type="number"
                min={16}
                max={99}
                value={captainAge}
                onChange={(e) => setCaptainAge(e.target.value)}
                placeholder="Ex: 28"
                required
                inputMode="numeric"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="capitao@email.com"
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Telemóvel">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 912 345 678"
                required
                autoComplete="tel"
              />
            </Field>

            <Field label="Nome da Equipa">
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ex: Braga United"
                required
              />
            </Field>

            <Field label="Número de Jogadores na Equipa">
              <Input
                type="number"
                min={10}
                max={13}
                value={playerCount}
                onChange={(e) => setPlayerCount(e.target.value)}
                placeholder="Ex: 12 (10-13)"
                required
                inputMode="numeric"
              />
            </Field>
          </div>

          <div className="border-t border-white/10 px-6 py-6">
            <h3 className="font-display text-xl tracking-wide text-white">
              Termos Essenciais de Participação
            </h3>
            <p className="mt-1 mb-5 text-sm text-zinc-500">
              Deves aceitar todos os termos antes de submeter.
            </p>
            <div className="space-y-3">
              {REGISTRATION_TERMS.map((term) => (
                <label
                  key={term.key}
                  className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-red-500/30"
                >
                  <input
                    type="checkbox"
                    checked={terms[term.key as TermKey]}
                    onChange={() => toggleTerm(term.key as TermKey)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-white/20 accent-red-600"
                  />
                  <span className="text-sm leading-relaxed text-zinc-300">
                    {term.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-6">
            <h3 className="font-display text-xl tracking-wide text-white">
              Declaração
            </h3>
            <label className="mt-4 flex cursor-pointer items-start gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded accent-red-600"
              />
              <span className="text-sm leading-relaxed text-zinc-200">
                Confirmo que li e aceito as regras do torneio, represento a
                equipa inscrita e assumo a responsabilidade pela sua
                participação no evento.
              </span>
            </label>
          </div>

          {error ? (
            <p className="px-6 pb-4 text-sm text-red-400">{error}</p>
          ) : null}

          <div className="sticky bottom-0 border-t border-white/10 bg-black/90 px-6 py-5 backdrop-blur-xl">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-14 w-full rounded-full text-sm font-bold uppercase tracking-wider disabled:opacity-40"
            >
              {pending ? "A submeter..." : "Submeter Inscrição"}
            </Button>
            <p className="mt-3 text-center text-xs text-zinc-600">
              Já tens conta de capitão?{" "}
              <Link href="/login" className="text-zinc-400 hover:text-white">
                Entrar na plataforma
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/15 text-red-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
