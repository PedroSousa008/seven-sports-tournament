import type { ApplicationStatus } from "@prisma/client";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

export const APPLICATION_STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "success" | "danger"
> = {
  PENDING: "default",
  APPROVED: "success",
  REJECTED: "danger",
};

export const REGISTRATION_TERMS = [
  {
    key: "termCaptain",
    label:
      "O capitão é o responsável pela equipa e pela comunicação com a organização.",
  },
  {
    key: "termSchedule",
    label:
      "Todos os participantes devem respeitar horários, regras das modalidades e instruções da organização.",
  },
  {
    key: "termRegisteredOnly",
    label:
      "Apenas atletas inscritos podem competir; substituições ou participantes não registados não são permitidos.",
  },
  {
    key: "termConduct",
    label:
      "Condutas antidesportivas, agressivas ou perigosas podem resultar em penalizações ou desclassificação.",
  },
  {
    key: "termRegulation",
    label:
      "A participação implica aceitação do regulamento do torneio, autorização de captação de imagem e reconhecimento de que cada atleta compete por sua própria responsabilidade.",
  },
  {
    key: "termPayment",
    label:
      "Após confirmação da participação por parte da organização, a equipa dispõe de 3 dias para efetuar o pagamento total da inscrição (500€).",
  },
] as const;

export const REGISTRATION_SUMMARY = {
  location: "Braga",
  dates: "04 – 09 Julho 2026",
  sports: ["Futebol 7", "Padel", "Voleibol", "Karts"],
  maxPlayers: 10,
  maxTeams: 12,
  price: 500,
} as const;
