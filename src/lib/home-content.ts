export const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2400&q=80",
    alt: "Equipa de futebol a celebrar um golo",
  },
  {
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=2400&q=80",
    alt: "Jogadores de padel a celebrar",
  },
  {
    image:
      "https://images.unsplash.com/photo-1564782860294-67f70944e94c?auto=format&fit=crop&w=2400&q=80",
    alt: "Piloto de kart numa curva",
  },
  {
    image:
      "https://images.unsplash.com/photo-1595435934249-2068ecff81bc?auto=format&fit=crop&w=2400&q=80",
    alt: "Jogador de ténis ao serviço",
  },
  {
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=2400&q=80",
    alt: "Ação de voleibol",
  },
] as const;

export const STATS = [
  { value: 12, label: "Equipas", suffix: "" },
  { value: 120, label: "Atletas", suffix: "" },
  { value: 5, label: "Desportos", suffix: "" },
  { value: 6, label: "Dias", suffix: "" },
  { value: 1, label: "Campeão", suffix: "" },
] as const;

export const SPORTS_SHOWCASE = [
  {
    slug: "futebol7",
    name: "Futebol 7",
    format: "4 grupos · Eliminatórias · Final épica",
    description: "12 equipas, 7 em campo, emoção até ao último apito.",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80",
    icon: "⚽",
  },
  {
    slug: "padel",
    name: "Padel",
    format: "Grupos · Quartos · Melhor de 3 sets",
    description: "Duplas de elite em duelos intensos na rede.",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
    icon: "🎾",
  },
  {
    slug: "karts",
    name: "Karts",
    format: "Grande Final · Máxima pontuação",
    description: "O momento decisivo. Velocidade, estratégia e glória.",
    image:
      "https://images.unsplash.com/photo-1568605117032-25902a3a8229?auto=format&fit=crop&w=1200&q=80",
    icon: "🏎️",
    featured: true,
  },
  {
    slug: "tenis",
    name: "Ténis",
    format: "Grupos · Eliminatórias · 1 atleta por equipa",
    description: "Precisão, nervos de aço e pontos que contam.",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
    icon: "🎾",
  },
  {
    slug: "voleibol",
    name: "Voleibol",
    format: "Grupos · Fase final · Equipas completas",
    description: "Bloqueios, smashes e espírito de equipa em Braga.",
    image:
      "https://images.unsplash.com/photo-1614027162347-699efaea2c5a?auto=format&fit=crop&w=1200&q=80",
    icon: "🏐",
  },
] as const;

export const JOURNEY = [
  {
    day: "Dia 1",
    sport: "Padel",
    date: "04 Julho",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
  },
  {
    day: "Dia 2",
    sport: "Voleibol",
    date: "05 Julho",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    day: "Dia 3",
    sport: "Futebol 7",
    date: "06 Julho",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  },
  {
    day: "Dia 4",
    sport: "Ténis",
    date: "07 Julho",
    image:
      "https://images.unsplash.com/photo-1595435934249-2068ecff81bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    day: "Dia 5",
    sport: "Karts Grand Final",
    date: "08–09 Julho",
    image:
      "https://images.unsplash.com/photo-1564782860294-67f70944e94c?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
] as const;

export const TROPHIES = [
  {
    title: "Troféu de Campeão",
    subtitle: "1.º Lugar",
    image:
      "https://images.unsplash.com/photo-1562218800-97407e795049?auto=format&fit=crop&w=900&q=80",
    accent: "from-amber-400/30 to-yellow-600/10",
  },
  {
    title: "Troféu Vice-Campeão",
    subtitle: "2.º Lugar",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
    accent: "from-zinc-300/20 to-zinc-500/10",
  },
  {
    title: "Troféu 3.º Lugar",
    subtitle: "Pódio",
    image:
      "https://images.unsplash.com/photo-1486287140556-f5fcdebc3dd9?auto=format&fit=crop&w=900&q=80",
    accent: "from-orange-400/20 to-amber-700/10",
  },
  {
    title: "Troféu Fair Play",
    subtitle: "Espírito desportivo",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba7951?auto=format&fit=crop&w=900&q=80",
    accent: "from-red-500/20 to-red-900/10",
  },
] as const;

export const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    alt: "Celebração de equipa",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1564782860294-67f70944e94c?auto=format&fit=crop&w=800&q=80",
    alt: "Karting",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
    alt: "Voleibol",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    alt: "Padel",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80",
    alt: "Multidão",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1562218800-97407e795049?auto=format&fit=crop&w=800&q=80",
    alt: "Troféu",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1517649763962-0a6230683ca2?auto=format&fit=crop&w=800&q=80",
    alt: "Pódio",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    alt: "Futebol",
    tall: false,
  },
] as const;

export const SPONSOR_CATEGORIES = [
  { type: "MAIN_SPONSOR", label: "Patrocinador Principal" },
  { type: "OFFICIAL_PARTNER", label: "Parceiros Oficiais" },
  { type: "EQUIPMENT", label: "Parceiro de Equipamento" },
  { type: "HEALTH_PHYSIO", label: "Parceiro de Saúde" },
  { type: "FOOD_BEVERAGE", label: "Restauração" },
] as const;
