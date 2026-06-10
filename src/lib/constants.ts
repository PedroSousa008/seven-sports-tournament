export const SPORTS = [
  {
    slug: "futebol7",
    name: "Futebol 7",
    maxPlayers: 10,
    format:
      "12 equipas · 4 grupos de 3 · Apenas 1º de cada grupo qualifica · Meias-finais · Final · 7 jogadores em campo",
  },
  {
    slug: "padel",
    name: "Padel",
    maxPlayers: 2,
    format:
      "12 equipas · 4 grupos de 3 · Top 2 de cada grupo · Quartos · Meias · Final · Melhor de 3 sets · 2 jogadores",
  },
  {
    slug: "tenis",
    name: "Ténis",
    maxPlayers: 1,
    format:
      "12 equipas · 4 grupos de 3 · Top 2 qualificam · Quartos · Meias · Final · 1 jogador por equipa",
  },
  {
    slug: "karts",
    name: "Karts",
    maxPlayers: 2,
    format:
      "Grande final do torneio · Cada equipa seleciona 2 pilotos · Provas, finais e pontuação com peso elevado no ranking geral",
  },
  {
    slug: "voleibol",
    name: "Voleibol",
    maxPlayers: 10,
    format:
      "4 grupos de 3 equipas · Top 2 qualificam · Fase a eliminar · Até 10 jogadores por equipa",
  },
] as const;

export const DEFAULT_POINTS = [
  { position: 1, points: 100 },
  { position: 2, points: 80 },
  { position: 3, points: 65 },
  { position: 4, points: 55 },
  { position: 5, points: 45 },
  { position: 6, points: 40 },
  { position: 7, points: 35 },
  { position: 8, points: 30 },
  { position: 9, points: 20 },
  { position: 10, points: 15 },
  { position: 11, points: 10 },
  { position: 12, points: 5 },
];

export const REVENUE_CATEGORIES = [
  "Team registrations",
  "Sponsorships",
  "Equipment commissions",
  "Bar revenue",
  "Merchandise",
  "Other",
];

export const COST_CATEGORIES = [
  "Football field rental",
  "Padel court rental",
  "Tennis court rental",
  "Karting costs",
  "Volleyball costs",
  "Balls and equipment",
  "Trophies",
  "Medals",
  "Insurance",
  "Staff",
  "Photographer/videographer",
  "Marketing",
  "Printing flyers",
  "Food and drinks",
  "Other",
];

export const PARTNERSHIP_TYPES = [
  { value: "MAIN_SPONSOR", label: "Main sponsor" },
  { value: "OFFICIAL_PARTNER", label: "Official partner" },
  { value: "SPORTS_PARTNER", label: "Sports partner" },
  { value: "FOOD_BEVERAGE", label: "Food & beverage partner" },
  { value: "EQUIPMENT", label: "Equipment partner" },
  { value: "HEALTH_PHYSIO", label: "Health/physio partner" },
  { value: "MEDIA", label: "Media partner" },
  { value: "LOCAL_BUSINESS", label: "Local business promotion" },
];
