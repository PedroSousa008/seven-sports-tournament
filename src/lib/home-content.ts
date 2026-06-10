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
    image: "/home/hero/04-tenis.jpg",
    alt: "Jogador de ténis ao serviço",
  },
  {
    image: "/home/hero/05-voleibol.jpg",
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
    image: "/home/sports/futebol7.jpg",
    icon: "⚽",
  },
  {
    slug: "padel",
    name: "Padel",
    format: "Grupos · Quartos · Melhor de 3 sets",
    description: "Duplas de elite em duelos intensos na rede.",
    image: "/home/sports/padel.jpg",
    icon: "🎾",
  },
  {
    slug: "karts",
    name: "Karts",
    format: "Grande Final · Máxima pontuação",
    description: "O momento decisivo. Velocidade, estratégia e glória.",
    image: "/home/sports/karts.jpg",
    icon: "🏎️",
    featured: true,
  },
  {
    slug: "tenis",
    name: "Ténis",
    format: "Grupos · Eliminatórias · 1 atleta por equipa",
    description: "Precisão, nervos de aço e pontos que contam.",
    image: "/home/sports/tenis.jpg",
    icon: "🎾",
  },
  {
    slug: "voleibol",
    name: "Voleibol",
    format: "Grupos · Fase final · Equipas completas",
    description: "Bloqueios, smashes e espírito de equipa em Braga.",
    image: "/home/sports/voleibol.jpg",
    icon: "🏐",
  },
] as const;

export const JOURNEY = [
  {
    day: "Dia 1",
    sport: "Padel",
    date: "04 Julho",
    image: "/home/journey/dia1-padel.jpg",
  },
  {
    day: "Dia 2",
    sport: "Voleibol",
    date: "05 Julho",
    image: "/home/journey/dia2-voleibol.jpg",
  },
  {
    day: "Dia 3",
    sport: "Futebol 7",
    date: "06 Julho",
    image: "/home/journey/dia3-futebol7.jpg",
  },
  {
    day: "Dia 4",
    sport: "Ténis",
    date: "07 Julho",
    image: "/home/journey/dia4-tenis.jpg",
  },
  {
    day: "Dia 5",
    sport: "Karts Grand Final",
    date: "08–09 Julho",
    image: "/home/journey/dia5-karts-final.jpg",
    featured: true,
  },
] as const;

export const TROPHIES = [
  {
    title: "Troféu de Campeão",
    subtitle: "1.º Lugar",
    image: "/home/trophies/campeao.jpg",
    accent: "from-amber-400/30 to-yellow-600/10",
  },
  {
    title: "Troféu Vice-Campeão",
    subtitle: "2.º Lugar",
    image: "/home/trophies/vice-campeao.jpg",
    accent: "from-zinc-300/20 to-zinc-500/10",
  },
  {
    title: "Troféu 3.º Lugar",
    subtitle: "Pódio",
    image: "/home/trophies/terceiro-lugar.jpg",
    accent: "from-orange-400/20 to-amber-700/10",
  },
  {
    title: "Troféu Fair Play",
    subtitle: "Espírito desportivo",
    image: "/home/trophies/fair-play.jpg",
    accent: "from-red-500/20 to-red-900/10",
  },
] as const;

export const GALLERY_IMAGES = [
  {
    src: "/home/gallery/01-celebracao-equipa.jpg",
    alt: "Celebração de equipa",
    tall: true,
  },
  {
    src: "/home/gallery/02-karting.jpg",
    alt: "Karting",
    tall: false,
  },
  {
    src: "/home/gallery/03-voleibol.jpg",
    alt: "Voleibol",
    tall: false,
  },
  {
    src: "/home/gallery/04-padel.jpg",
    alt: "Padel",
    tall: true,
  },
  {
    src: "/home/gallery/05-multidao.jpg",
    alt: "Multidão",
    tall: false,
  },
  {
    src: "/home/gallery/06-trofeu.jpg",
    alt: "Troféu",
    tall: true,
  },
  {
    src: "/home/gallery/07-podio.jpg",
    alt: "Pódio",
    tall: false,
  },
  {
    src: "/home/gallery/08-futebol.jpg",
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
