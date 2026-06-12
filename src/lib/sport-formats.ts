export type KnockoutRound = "QUARTER_FINAL" | "SEMI_FINAL" | "FINAL";

export type SportFormatConfig = {
  slug: string;
  label: string;
  groups: string[];
  teamsPerGroup: number;
  qualifiersPerGroup: number;
  diffLabel: string;
  knockoutRounds: KnockoutRound[];
  placeholder: boolean;
};

export const SPORT_FORMATS: Record<string, SportFormatConfig> = {
  futebol7: {
    slug: "futebol7",
    label: "Futebol",
    groups: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    teamsPerGroup: 3,
    qualifiersPerGroup: 1,
    diffLabel: "Dif. Golos",
    knockoutRounds: ["SEMI_FINAL", "FINAL"],
    placeholder: false,
  },
  padel: {
    slug: "padel",
    label: "Padel",
    groups: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    teamsPerGroup: 3,
    qualifiersPerGroup: 2,
    diffLabel: "Dif. Sets",
    knockoutRounds: ["QUARTER_FINAL", "SEMI_FINAL", "FINAL"],
    placeholder: false,
  },
  voleibol: {
    slug: "voleibol",
    label: "Voleibol",
    groups: ["Grupo A", "Grupo B", "Grupo C", "Grupo D"],
    teamsPerGroup: 3,
    qualifiersPerGroup: 1,
    diffLabel: "Dif. Sets",
    knockoutRounds: ["SEMI_FINAL", "FINAL"],
    placeholder: false,
  },
  karts: {
    slug: "karts",
    label: "Karts",
    groups: [],
    teamsPerGroup: 0,
    qualifiersPerGroup: 0,
    diffLabel: "",
    knockoutRounds: [],
    placeholder: true,
  },
};

export const KNOCKOUT_LABELS: Record<KnockoutRound, string> = {
  QUARTER_FINAL: "Quartos-de-final",
  SEMI_FINAL: "Meias-finais",
  FINAL: "Final",
};

export const CALENDAR_SPORT_SLUGS = ["futebol7", "padel", "voleibol", "karts"] as const;

export const CALENDAR_SPORT_TABS = [
  { slug: "futebol7", label: "Futebol" },
  { slug: "padel", label: "Padel" },
  { slug: "voleibol", label: "Voleibol" },
  { slug: "karts", label: "Karts" },
] as const;
