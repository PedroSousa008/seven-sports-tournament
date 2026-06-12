export const TOURNAMENT = {
  name: "Torneio 4 Desportos Braga",
  shortName: "Torneio 4 Desportos",
  startDate: "2026-07-10",
  endDate: "2026-07-18",
  dateRange: "10–18 Julho 2026",
  dateRangeUpper: "10–18 JULHO 2026",
} as const;

export const SPORTS = [
  {
    slug: "futebol7",
    name: "Futebol 7",
    date: "2026-07-10",
    dateLabel: "10 Julho",
    maxPlayers: 10,
    format:
      "12 equipas · 4 grupos de 3 · Apenas 1º de cada grupo qualifica · Meias-finais · Final · 7 jogadores em campo",
  },
  {
    slug: "padel",
    name: "Padel",
    date: "2026-07-11",
    dateLabel: "11 Julho",
    maxPlayers: 2,
    format:
      "12 equipas · 4 grupos de 3 · Top 2 de cada grupo · Quartos-de-final · Meias-finais · Final · Melhor de 3 sets · 2 jogadores",
  },
  {
    slug: "voleibol",
    name: "Voleibol",
    date: "2026-07-17",
    dateLabel: "17 Julho",
    maxPlayers: 10,
    format:
      "4 grupos de 3 equipas · Top 2 qualificam · Fase a eliminar · Até 10 jogadores por equipa",
  },
  {
    slug: "karts",
    name: "Karts",
    date: "2026-07-18",
    dateLabel: "18 Julho",
    maxPlayers: 2,
    format:
      "Grande final do torneio · Cada equipa seleciona 2 pilotos · Provas, finais e pontuação com peso elevado no ranking geral",
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
  "Inscrições de equipas",
  "Patrocínios",
  "Comissões de equipamento",
  "Receita do bar",
  "Merchandising",
  "Outros",
];

export const COST_CATEGORIES = [
  "Aluguer de campo de futebol",
  "Aluguer de courts de padel",
  "Custos de karting",
  "Custos de voleibol",
  "Bolas e equipamento",
  "Troféus",
  "Medalhas",
  "Seguro",
  "Staff",
  "Fotógrafo/videógrafo",
  "Marketing",
  "Impressão de flyers",
  "Comida e bebidas",
  "Outros",
];

export const PARTNERSHIP_TYPES = [
  { value: "MAIN_SPONSOR", label: "Patrocinador principal" },
  { value: "OFFICIAL_PARTNER", label: "Parceiro oficial" },
  { value: "SPORTS_PARTNER", label: "Parceiro desportivo" },
  { value: "FOOD_BEVERAGE", label: "Parceiro de restauração" },
  { value: "EQUIPMENT", label: "Parceiro de equipamento" },
  { value: "HEALTH_PHYSIO", label: "Parceiro de saúde/fisioterapia" },
  { value: "MEDIA", label: "Parceiro de media" },
  { value: "LOCAL_BUSINESS", label: "Promoção de negóio local" },
];
