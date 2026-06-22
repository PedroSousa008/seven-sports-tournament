import type {
  ApplicationStatus,
  IndividualApplication,
  TeamApplication,
} from "@prisma/client";
import { prisma } from "@/lib/db";

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

export const INDIVIDUAL_REGISTRATION_TERMS = REGISTRATION_TERMS.filter(
  (term) => term.key !== "termCaptain"
);

export const INDIVIDUAL_DECLARATION =
  "Confirmo que li e aceito as regras do torneio e assumo a responsabilidade pela minha participação no evento caso venha a ser selecionado pela organização.";

export const INDIVIDUAL_REGISTRATION_INFO =
  "Esta inscrição destina-se a atletas que não possuem equipa mas gostariam de participar no Torneio 4 Desportos Braga. A submissão da candidatura não garante a participação no evento. Todas as inscrições serão analisadas pela organização, que poderá posteriormente contactar os candidatos para integrar equipas com vagas disponíveis ou projetos criados para o torneio.";

export type ApplicationType = "TEAM" | "INDIVIDUAL";

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  TEAM: "Equipa",
  INDIVIDUAL: "Individual",
};

export const REGISTRATION_SUMMARY = {
  location: "Braga",
  dates: "10–18 Julho 2026",
  sports: ["Futebol 7", "Padel", "Voleibol", "Karts"],
  playersLabel: "10 + 2 opcionais",
  maxTeams: 12,
  price: 500,
} as const;

export async function getOwnerApplications(): Promise<{
  teamApplications: TeamApplication[];
  individualApplications: IndividualApplication[];
}> {
  const teamApplications = await prisma.teamApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  let individualApplications: IndividualApplication[] = [];
  try {
    individualApplications = await prisma.individualApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    individualApplications = [];
  }

  return { teamApplications, individualApplications };
}
