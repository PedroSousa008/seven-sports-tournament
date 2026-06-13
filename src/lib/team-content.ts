import { SPORTS } from "./constants";

export const DEFAULT_TEAM_BANNER = "/home/hero/01-futebol-celebracao.jpg";

export const SPORT_IMAGES: Record<string, string> = {
  futebol7: "/home/sports/futebol7.jpg",
  padel: "/home/sports/padel.png",
  voleibol: "/home/sports/voleibol.jpg",
  karts: "/home/sports/karts.jpg",
};

export const SPORT_ICONS: Record<string, string> = {
  futebol7: "⚽",
  padel: "🎾",
  voleibol: "🏐",
  karts: "🏎️",
};

export const JOURNEY_SPORTS = SPORTS.map((sport) => ({
  slug: sport.slug,
  name: sport.slug === "karts" ? "Karts Grand Final" : sport.name,
  date: sport.date,
  dateLabel: sport.dateLabel,
  image: SPORT_IMAGES[sport.slug],
}));

export type JourneyStatus = "completed" | "live" | "next" | "upcoming";

export function getJourneyStatus(
  sportDate: string,
  allDates: string[]
): JourneyStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(sportDate);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "live";
  if (date.getTime() < today.getTime()) return "completed";

  const futureDates = allDates
    .map((d) => new Date(d))
    .filter((d) => {
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    })
    .sort((a, b) => a.getTime() - b.getTime());

  const nextDate = futureDates[0];
  if (nextDate && date.getTime() === nextDate.getTime()) return "next";
  return "upcoming";
}

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  completed: "Concluído",
  live: "A decorrer",
  next: "Próximo",
  upcoming: "Em breve",
};
