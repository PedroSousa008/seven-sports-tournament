import { SPORTS, TOURNAMENT } from "./constants";

export { TOURNAMENT };

export const HERO_SLIDES = [
  {
    image: "/home/hero/01-futebol-celebracao.jpg",
    alt: "Equipa de futebol a celebrar um golo",
  },
  {
    image: "/home/hero/02-padel.jpg",
    alt: "Jogadores de padel a celebrar",
  },
  {
    image: "/home/hero/03-karts.jpg",
    alt: "Piloto de kart numa curva",
  },
  {
    image: "/home/hero/04-voleibol.jpg",
    alt: "Ação de voleibol",
  },
] as const;

export const STATS = [
  { value: 12, label: "Equipas", suffix: "" },
  { value: 120, label: "Atletas", suffix: "" },
  { value: 4, label: "Desportos", suffix: "" },
  { value: 4, label: "Dias", suffix: "" },
  { value: 1, label: "Campeão", suffix: "" },
] as const;

export const SPORTS_SHOWCASE = [
  {
    slug: "futebol7",
    name: "Futebol 7",
    format: "10 Julho · 4 grupos · Eliminatórias · Final épica",
    description: "12 equipas, 7 em campo, emoção até ao último apito.",
    image: "/home/sports/futebol7.jpg",
    icon: "⚽",
  },
  {
    slug: "padel",
    name: "Padel",
    format: "11 Julho · Grupos · Quartos · Meias · Final · Proset",
    description: "Entre 1-2 Duplas por Equipa",
    image: "/home/sports/padel.png",
    icon: "🎾",
  },
  {
    slug: "voleibol",
    name: "Voleibol",
    format: "17 Julho · Grupos · Meias · Final · Melhor de 3 sets",
    description: "4x4 com substituições ilimitadas",
    image: "/home/sports/voleibol.jpg",
    icon: "🏐",
  },
  {
    slug: "karts",
    name: "Karts",
    format: "18 Julho · Grande Final · Máxima pontuação",
    description: "O momento decisivo. Velocidade, estratégia e glória.",
    image: "/home/sports/karts.jpg",
    icon: "🏎️",
  },
] as const;

export const JOURNEY = [
  {
    day: "Dia 1",
    sport: "Futebol 7",
    date: SPORTS[0].dateLabel,
    image: "/home/journey/dia3-futebol7.jpg",
  },
  {
    day: "Dia 2",
    sport: "Padel",
    date: SPORTS[1].dateLabel,
    image: "/home/journey/dia1-padel.jpg",
  },
  {
    day: "Dia 3",
    sport: "Voleibol",
    date: SPORTS[2].dateLabel,
    image: "/home/journey/dia2-voleibol.jpg",
  },
  {
    day: "Dia 4",
    sport: "Karts Grand Final",
    date: SPORTS[3].dateLabel,
    image: "/home/journey/dia4-karts-final.jpg",
    featured: true,
  },
] as const;

export const SPORT_TROPHIES = [
  {
    slug: "futebol7",
    title: "Troféu de Campeão",
    subtitle: "Futebol 7",
    image: "/home/trophies/futebol7.png",
    accent: "from-amber-400/30 to-yellow-600/10",
  },
  {
    slug: "padel",
    title: "Troféu de Campeão",
    subtitle: "Padel",
    image: "/home/trophies/padel.png",
    accent: "from-zinc-300/20 to-zinc-500/10",
  },
  {
    slug: "voleibol",
    title: "Troféu de Campeão",
    subtitle: "Voleibol",
    image: "/home/trophies/voleibol.png",
    accent: "from-orange-400/20 to-amber-700/10",
  },
  {
    slug: "karts",
    title: "Troféu de Campeão",
    subtitle: "Karts",
    image: "/home/trophies/karts.png",
    accent: "from-red-500/20 to-red-900/10",
  },
] as const;

export const GRAND_TROPHY = {
  slug: "campeoes-torneio",
  title: "1.ª Edição",
  subtitle: "Campeões Four Sports Cup",
  image: "/home/trophies/campeoes-torneio.png",
  accent: "from-amber-300/30 to-yellow-500/20",
} as const;

export const SPONSOR_CATEGORIES = [
  { type: "MAIN_SPONSOR", label: "Patrocinador Principal" },
  { type: "OFFICIAL_PARTNER", label: "Parceiros Oficiais" },
  { type: "EQUIPMENT", label: "Parceiro de Equipamento" },
  { type: "HEALTH_PHYSIO", label: "Parceiro de Saúde" },
  { type: "FOOD_BEVERAGE", label: "Restauração" },
] as const;
