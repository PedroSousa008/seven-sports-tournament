"use client";

import { useMemo, useState, useTransition } from "react";
import {
  APPLICATION_STATUS_LABELS,
  REGISTRATION_TERMS,
} from "@/lib/applications";
import { updateApplicationStatusAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { ApplicationStatus, TeamApplication } from "@prisma/client";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Search,
  Users,
  X,
} from "lucide-react";

type Filter = "ALL" | ApplicationStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendentes" },
  { value: "APPROVED", label: "Aprovadas" },
  { value: "REJECTED", label: "Rejeitadas" },
];

function statusVariant(status: ApplicationStatus) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "default" as const;
}

export function ApplicationsManager({
  applications,
}: {
  applications: TeamApplication[];
}) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (filter !== "ALL" && app.status !== filter) return false;
      if (!q) return true;
      return (
        app.teamName.toLowerCase().includes(q) ||
        app.captainName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q)
      );
    });
  }, [applications, filter, search]);

  const counts = useMemo(
    () => ({
      ALL: applications.length,
      PENDING: applications.filter((a) => a.status === "PENDING").length,
      APPROVED: applications.filter((a) => a.status === "APPROVED").length,
      REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    }),
    [applications]
  );

  function updateStatus(id: string, status: ApplicationStatus) {
    startTransition(() => updateApplicationStatusAction(id, status));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.value
                  ? "bg-red-600 text-white"
                  : "border border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">
                ({counts[f.value]})
              </span>
            </button>
          ))}
        </div>
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Equipa, capitão ou email..."
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-zinc-500">
          Nenhuma inscrição encontrada.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((app) => {
            const expanded = expandedId === app.id;
            return (
              <article
                key={app.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {app.teamName}
                        </h3>
                        <Badge variant={statusVariant(app.status)}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        Capitão: {app.captainName} · {app.captainAge} anos
                      </p>
                    </div>
                    <p className="text-xs text-zinc-600">
                      {formatDateTime(app.createdAt)}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <Mail className="h-4 w-4 shrink-0" />
                      {app.email}
                    </span>
                    <span className="flex items-center gap-2 text-zinc-400">
                      <Phone className="h-4 w-4 shrink-0" />
                      {app.phone}
                    </span>
                    <span className="flex items-center gap-2 text-zinc-400">
                      <Users className="h-4 w-4 shrink-0" />
                      {app.playerCount} jogadores
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setExpandedId(expanded ? null : app.id)
                      }
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Ver Detalhes
                        </>
                      )}
                    </Button>
                    {app.status !== "APPROVED" ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={pending}
                        onClick={() => updateStatus(app.id, "APPROVED")}
                      >
                        <Check className="h-4 w-4" />
                        Aprovar
                      </Button>
                    ) : null}
                    {app.status !== "REJECTED" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        disabled={pending}
                        onClick={() => updateStatus(app.id, "REJECTED")}
                      >
                        <X className="h-4 w-4" />
                        Rejeitar
                      </Button>
                    ) : null}
                    {app.status !== "PENDING" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={pending}
                        onClick={() => updateStatus(app.id, "PENDING")}
                      >
                        Repor Pendente
                      </Button>
                    ) : null}
                  </div>
                </div>

                {expanded ? (
                  <div className="border-t border-white/10 bg-black/30 px-5 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Termos aceites
                    </p>
                    <ul className="space-y-2">
                      {REGISTRATION_TERMS.map((term) => {
                        const accepted = app[term.key as keyof TeamApplication];
                        return (
                          <li
                            key={term.key}
                            className={`flex items-start gap-2 text-sm ${
                              accepted ? "text-zinc-300" : "text-red-400"
                            }`}
                          >
                            <Check
                              className={`mt-0.5 h-4 w-4 shrink-0 ${
                                accepted ? "text-emerald-400" : "opacity-30"
                              }`}
                            />
                            {term.label}
                          </li>
                        );
                      })}
                      <li
                        className={`flex items-start gap-2 text-sm ${
                          app.declarationAccepted
                            ? "text-zinc-300"
                            : "text-red-400"
                        }`}
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            app.declarationAccepted
                              ? "text-emerald-400"
                              : "opacity-30"
                          }`}
                        />
                        Declaração final aceite
                      </li>
                    </ul>
                    {app.status === "APPROVED" ? (
                      <p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                        Candidatura aprovada. Cria a equipa manualmente em{" "}
                        <strong>Equipas</strong> quando estiveres pronto.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
