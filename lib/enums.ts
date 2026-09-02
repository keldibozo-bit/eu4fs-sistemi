// Vlerat e enum-eve (të njëjta me prisma/schema.prisma) dhe etiketat e tyre
// në shqip për shfaqje në UI (dropdown-e, badge-e, tabela).

export const EXPERT_ROLES = ["LIGJOR", "TEKNIK", "LIGJOR_TEKNIK"] as const;
export type ExpertRole = (typeof EXPERT_ROLES)[number];
export const EXPERT_ROLE_LABELS: Record<ExpertRole, string> = {
  LIGJOR: "Ligjor",
  TEKNIK: "Teknik",
  LIGJOR_TEKNIK: "Ligjor & Teknik",
};

export const EXPERT_STATUSES = [
  "AKTIV",
  "PERFUNDUAR",
  "PEZULLUAR",
  "NUK_KA_FILLUAR",
] as const;
export type ExpertStatus = (typeof EXPERT_STATUSES)[number];
export const EXPERT_STATUS_LABELS: Record<ExpertStatus, string> = {
  AKTIV: "Aktiv",
  PERFUNDUAR: "Përfunduar",
  PEZULLUAR: "Pezulluar",
  NUK_KA_FILLUAR: "Nuk ka Filluar",
};

export const QC_TYPES = ["LIGJOR", "TEKNIK"] as const;
export type QcType = (typeof QC_TYPES)[number];
export const QC_TYPE_LABELS: Record<QcType, string> = {
  LIGJOR: "Ligjor",
  TEKNIK: "Teknik",
};

export const DELIVERABLE_TYPES = ["LIGJOR", "TEKNIK"] as const;
export type DeliverableTypeVal = (typeof DELIVERABLE_TYPES)[number];
export const DELIVERABLE_TYPE_LABELS: Record<DeliverableTypeVal, string> = {
  LIGJOR: "Ligjor",
  TEKNIK: "Teknik",
};

export const DELIVERABLE_STATUSES = [
  "DRAFT",
  "DOREZUAR",
  "NE_RISHIKIM",
  "KERKON_NDRYSHIME",
  "APROVUAR",
] as const;
export type DeliverableStatusVal = (typeof DELIVERABLE_STATUSES)[number];
export const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatusVal, string> = {
  DRAFT: "Draft",
  DOREZUAR: "Dorëzuar",
  NE_RISHIKIM: "Në Rishikim",
  KERKON_NDRYSHIME: "Kërkon Ndryshime",
  APROVUAR: "Aprovuar",
};

export const CONFIRM_VALUES = ["PO", "JO", "NA"] as const;
export type ConfirmVal = (typeof CONFIRM_VALUES)[number];
export const CONFIRM_LABELS: Record<ConfirmVal, string> = {
  PO: "Po",
  JO: "Jo",
  NA: "N/A",
};

export const ISSUE_TYPES = [
  "PROBLEMATIKE",
  "REREZIK",
  "VARESI",
  "BASHKEPUNIM",
] as const;
export type IssueTypeVal = (typeof ISSUE_TYPES)[number];
export const ISSUE_TYPE_LABELS: Record<IssueTypeVal, string> = {
  PROBLEMATIKE: "Problematikë",
  REREZIK: "Rrezik",
  VARESI: "Varësi",
  BASHKEPUNIM: "Bashkëpunim",
};

export const IMPACT_LEVELS = ["I_LARTE", "MESATAR", "I_ULET"] as const;
export type ImpactLevelVal = (typeof IMPACT_LEVELS)[number];
export const IMPACT_LEVEL_LABELS: Record<ImpactLevelVal, string> = {
  I_LARTE: "I Lartë",
  MESATAR: "Mesatar",
  I_ULET: "I Ulët",
};

export const ISSUE_STATUSES = ["HAPUR", "NE_PROCES", "MBYLLUR"] as const;
export type IssueStatusVal = (typeof ISSUE_STATUSES)[number];
export const ISSUE_STATUS_LABELS: Record<IssueStatusVal, string> = {
  HAPUR: "Hapur",
  NE_PROCES: "Në Proces",
  MBYLLUR: "Mbyllur",
};
