export const paymentStatusLabels: Record<string, string> = {
  UNPAID: "Por pagar",
  PARTIAL: "Parcialmente pago",
  PAID: "Pago",
};

export const eventStatusLabels: Record<string, string> = {
  UPCOMING: "Próximo",
  LIVE: "A decorrer",
  FINISHED: "Concluído",
};

export const announcementPriorityLabels: Record<string, string> = {
  NORMAL: "Normal",
  IMPORTANT: "Importante",
  URGENT: "Urgente",
};

export const partnershipStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PAID: "Pago",
  COMPLETED: "Concluído",
};

export const partnershipTypeLabels: Record<string, string> = {
  MAIN_SPONSOR: "Patrocinador principal",
  OFFICIAL_PARTNER: "Parceiro oficial",
  SPORTS_PARTNER: "Parceiro desportivo",
  FOOD_BEVERAGE: "Parceiro de restauração",
  EQUIPMENT: "Parceiro de equipamento",
  HEALTH_PHYSIO: "Parceiro de saúde/fisioterapia",
  MEDIA: "Parceiro de media",
  LOCAL_BUSINESS: "Promoção de negócio local",
};

export function label(
  map: Record<string, string>,
  value: string
): string {
  return map[value] ?? value;
}
