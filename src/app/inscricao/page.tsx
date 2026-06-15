import Link from "next/link";
import { RegistrationForm } from "@/components/registration/registration-form";
import { TOURNAMENT } from "@/lib/constants";

export const metadata = {
  title: `Inscrição | ${TOURNAMENT.name}`,
  description:
    "Submete a candidatura da tua equipa para a Four Sports Cup.",
};

export default function InscricaoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="group">
            <p className="font-display text-xs tracking-[0.35em] text-red-500">
              {TOURNAMENT.abbrev}
            </p>
            <p className="text-sm font-semibold text-white transition group-hover:text-red-400">
              {TOURNAMENT.shortName}
            </p>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Voltar
          </Link>
        </div>
      </header>
      <RegistrationForm />
    </div>
  );
}
