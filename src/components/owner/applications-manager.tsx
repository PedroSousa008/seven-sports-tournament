"use client";

import { useMemo, useState, useTransition } from "react";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_TYPE_LABELS,
  INDIVIDUAL_DECLARATION,
  INDIVIDUAL_REGISTRATION_TERMS,
  REGISTRATION_TERMS,
  type ApplicationType,
} from "@/lib/applications";
import { updateApplicationStatusAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type {
  ApplicationStatus,
  IndividualApplication,
  TeamApplication,
} from "@prisma/client";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Search,
  Trophy,
  Users,
  X,
} from "lucide-react";

type StatusFilter = "ALL" | ApplicationStatus;
type TypeFilter = "ALL" | ApplicationType;

export type ApplicationRecord =
  | { type: "TEAM"; data: TeamApplication }
  | { type: "INDIVIDUAL"; data: IndividualApplication };

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendentes" },
  { value: "APPROVED", label: "Aprovadas" },
  { value: "REJECTED", label: "Rejeitadas" },
];

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "TEAM", label: "Equipas" },
  { value: "INDIVIDUAL", label: "Individuais" },
];

function statusVariant(status: ApplicationStatus) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "default" as const;
}

function typeVariant(type: ApplicationType) {
  return type === "TEAM" ? ("team" as const) : ("individual" as const);
}

function recordKey(record: ApplicationRecord) {
  return `${record.type}-${record.data.id}`;
}

export function ApplicationsManager({
  applications,
}: {
  applications: ApplicationRecord[];
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [search, setSearch] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((record) => {
      if (typeFilter !== "ALL" && record.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && record.data.status !== statusFilter) {
        return false;
      }
      if (!q) return true;

      if (record.type === "TEAM") {
        const app = record.data;
        return (
          app.teamName.toLowerCase().includes(q) ||
          app.captainName.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q)
        );
      }

      const app = record.data;
      return (
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.preferredSports.toLowerCase().includes(q)
      );
    });
  }, [applications, statusFilter, typeFilter, search]);

  const statusCounts = useMemo(
    () => ({
      ALL: applications.length,
      PENDING: applications.filter((a) => a.data.status === "PENDING").length,
      APPROVED: applications.filter((a) => a.data.status === "APPROVED").length,
      REJECTED: applications.filter((a) => a.data.status === "REJECTED").length,
    }),
    [applications]
  );

  const typeCounts = useMemo(
    () => ({
      ALL: applications.length,
      TEAM: applications.filter((a) => a.type === "TEAM").length,
      INDIVIDUAL: applications.filter((a) => a.type === "INDIVIDUAL").length,
    }),
    [applications]
  );

  function updateStatus(
    id: string,
    status: ApplicationStatus,
    type: ApplicationType
  ) {
    startTransition(() => updateApplicationStatusAction(id, status, type));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  typeFilter === f.value
                    ? "bg-white/15 text-white"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-70">
                  ({typeCounts[f.value]})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === f.value
                    ? "bg-red-600 text-white"
                    : "border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs opacity-70">
                  ({statusCounts[f.value]})
                </span>
              </button>
            ))}
          </div>
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome, equipa ou email..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-zinc-500">
          Nenhuma inscrição encontrada.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((record) => {
            const key = recordKey(record);
            const expanded = expandedKey === key;
            const app = record.data;

            return (
              <article
                key={key}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={typeVariant(record.type)}>
                          {APPLICATION_TYPE_LABELS[record.type]}
                        </Badge>
                        <Badge variant={statusVariant(app.status)}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {record.type === "TEAM"
                          ? record.data.teamName
                          : record.data.fullName}
                      </h3>
                      {record.type === "TEAM" ? (
                        <p className="mt-1 text-sm text-zinc-400">
                          Capitão: {record.data.captainName} ·{" "}
                          {record.data.captainAge} anos
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-zinc-400">
                          {record.data.age} anos
                        </p>
                      )}
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
                    {record.type === "TEAM" ? (
                      <span className="flex items-center gap-2 text-zinc-400">
                        <Users className="h-4 w-4 shrink-0" />
                        {record.data.playerCount} jogadores
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-zinc-400 sm:col-span-1">
                        <Trophy className="h-4 w-4 shrink-0" />
                        {record.data.preferredSports}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedKey(expanded ? null : key)}
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
                        onClick={() =>
                          updateStatus(app.id, "APPROVED", record.type)
                        }
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
                        onClick={() =>
                          updateStatus(app.id, "REJECTED", record.type)
                        }
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
                        onClick={() =>
                          updateStatus(app.id, "PENDING", record.type)
                        }
                      >
                        Repor Pendente
                      </Button>
                    ) : null}
                  </div>
                </div>

                {expanded ? (
                  <div className="border-t border-white/10 bg-black/30 px-5 py-4">
                    {record.type === "TEAM" ? (
                      <TeamDetails app={record.data} />
                    ) : (
                      <IndividualDetails app={record.data} />
                    )}
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

function TeamDetails({ app }: { app: TeamApplication }) {
  return (
    <>
      <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
        <Detail label="Nome da Equipa" value={app.teamName} />
        <Detail label="Capitão" value={app.captainName} />
        <Detail label="Idade" value={`${app.captainAge} anos`} />
        <Detail label="Email" value={app.email} />
        <Detail label="Telemóvel" value={app.phone} />
        <Detail label="Número de Jogadores" value={String(app.playerCount)} />
        <Detail label="Data" value={formatDateTime(app.createdAt)} />
        <Detail
          label="Status"
          value={APPLICATION_STATUS_LABELS[app.status]}
        />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Termos aceites
      </p>
      <TermsList terms={REGISTRATION_TERMS} app={app} />
      <DeclarationItem accepted={app.declarationAccepted} />
      {app.status === "APPROVED" ? (
        <p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Candidatura aprovada. Cria a equipa manualmente em{" "}
          <strong>Equipas</strong> quando estiveres pronto.
        </p>
      ) : null}
    </>
  );
}

function IndividualDetails({ app }: { app: IndividualApplication }) {
  return (
    <>
      <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
        <Detail label="Nome Completo" value={app.fullName} />
        <Detail label="Idade" value={`${app.age} anos`} />
        <Detail label="Email" value={app.email} />
        <Detail label="Telemóvel" value={app.phone} />
        <Detail
          label="Modalidades Preferidas"
          value={app.preferredSports}
          className="sm:col-span-2"
        />
        {app.sportsExperience ? (
          <Detail
            label="Experiência Desportiva"
            value={app.sportsExperience}
            className="sm:col-span-2"
          />
        ) : null}
        <Detail label="Data" value={formatDateTime(app.createdAt)} />
        <Detail
          label="Status"
          value={APPLICATION_STATUS_LABELS[app.status]}
        />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Termos aceites
      </p>
      <TermsList terms={INDIVIDUAL_REGISTRATION_TERMS} app={app} />
      <DeclarationItem
        accepted={app.declarationAccepted}
        label={INDIVIDUAL_DECLARATION}
      />
      {app.status === "APPROVED" ? (
        <p className="mt-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Candidatura aprovada. Podes contactar o atleta e atribuí-lo a uma
          equipa quando estiveres pronto.
        </p>
      ) : null}
    </>
  );
}

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-0.5 text-white">{value}</p>
    </div>
  );
}

function TermsList({
  terms,
  app,
}: {
  terms: readonly { key: string; label: string }[];
  app: TeamApplication | IndividualApplication;
}) {
  return (
    <ul className="space-y-2">
      {terms.map((term) => {
        const accepted = app[term.key as keyof typeof app];
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
    </ul>
  );
}

function DeclarationItem({
  accepted,
  label = "Declaração final aceite",
}: {
  accepted: boolean;
  label?: string;
}) {
  return (
    <div
      className={`mt-3 flex items-start gap-2 text-sm ${
        accepted ? "text-zinc-300" : "text-red-400"
      }`}
    >
      <Check
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          accepted ? "text-emerald-400" : "opacity-30"
        }`}
      />
      {label}
    </div>
  );
}
