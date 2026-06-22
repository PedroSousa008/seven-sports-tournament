"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, User } from "lucide-react";
import { TeamRegistrationForm } from "./team-registration-form";
import { IndividualRegistrationForm } from "./individual-registration-form";

type RegistrationType = "team" | "individual";

const OPTIONS: {
  value: RegistrationType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "team",
    label: "Inscrição da Equipa",
    description: "Tenho uma equipa e quero candidatar-nos ao torneio.",
    icon: Users,
  },
  {
    value: "individual",
    label: "Inscrição Individual",
    description: "Não tenho equipa mas quero participar no torneio.",
    icon: User,
  },
];

export function RegistrationSelector() {
  const [active, setActive] = useState<RegistrationType>("team");
  const [hideTabs, setHideTabs] = useState(false);

  return (
    <div>
      {!hideTabs ? (
        <section className="px-6 pt-28 pb-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {OPTIONS.map((option) => {
                const selected = active === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActive(option.value)}
                    className={`relative rounded-xl px-5 py-5 text-left transition-all duration-300 ${
                      selected
                        ? "bg-gradient-to-br from-red-600/25 to-red-900/10 shadow-[inset_0_0_0_1px_rgba(220,38,38,0.4)]"
                        : "bg-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          selected
                            ? "bg-red-600 text-white"
                            : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p
                          className={`font-display text-lg tracking-wide ${
                            selected ? "text-white" : "text-zinc-300"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {selected ? (
                      <motion.div
                        layoutId="registration-selector-indicator"
                        className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-red-500"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {active === "team" ? (
            <TeamRegistrationForm onSuccess={() => setHideTabs(true)} />
          ) : (
            <IndividualRegistrationForm onSuccess={() => setHideTabs(true)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
