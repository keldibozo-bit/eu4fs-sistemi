// Formulat e llogaritjes (të njëjta me versionin Excel).
// Këto fusha NUK ruhen në databazë — llogariten gjithmonë "live" në kod.

export type Scores = {
  k1: number | null;
  k2: number | null;
  k3: number | null;
  k4: number | null;
  k5: number | null;
  k6: number | null;
};

const WEIGHTS = { k1: 0.3, k2: 0.2, k3: 0.15, k4: 0.15, k5: 0.15, k6: 0.05 };

/** Mesatarja e ponderuar e vlerësimit QC (K1..K6), vetëm nëse të gjashtë janë vendosur. */
export function weightedScore(s: Scores): number | null {
  const { k1, k2, k3, k4, k5, k6 } = s;
  if (k1 == null || k2 == null || k3 == null || k4 == null || k5 == null || k6 == null) {
    return null;
  }
  const raw =
    k1 * WEIGHTS.k1 +
    k2 * WEIGHTS.k2 +
    k3 * WEIGHTS.k3 +
    k4 * WEIGHTS.k4 +
    k5 * WEIGHTS.k5 +
    k6 * WEIGHTS.k6;
  return Math.round(raw * 100) / 100;
}

/** Vendimi i QC bazuar te weightedScore, me "override" kritik nëse K1 <= 2. */
export function decision(s: Scores): string | null {
  const score = weightedScore(s);
  if (score == null) return null;
  if (s.k1 != null && s.k1 <= 2) return "Kërkon Rishikim të Plotë";
  if (score >= 4) return "Aprovohet";
  if (score >= 3) return "Aprovohet me Ndryshime të Vogla";
  return "Kërkon Rishikim të Plotë";
}

/** A është dorëzuar me vonesë (submissionDate pas deadline-it)? */
export function isLate(deadline: Date | null, submissionDate: Date | null): boolean {
  if (!deadline || !submissionDate) return false;
  return submissionDate.getTime() > deadline.getTime();
}

export type ExpertStatusBadge =
  | "KUJDES"
  | "TEJKALIM"
  | "AFER_KUFIRIT"
  | "NE_RREGULL";

export const EXPERT_STATUS_BADGE_LABELS: Record<ExpertStatusBadge, string> = {
  KUJDES: "⚠ Kujdes",
  TEJKALIM: "🔴 Tejkalim Ditësh",
  AFER_KUFIRIT: "🟡 Afër Kufirit",
  NE_RREGULL: "✅ Në Rregull",
};

/**
 * Statusi i llogaritur i ekspertit, sipas rendit të prioritetit të përcaktuar:
 * 1) Kujdes nëse ka vonesa ose mesatarja e vlerësimit < 3
 * 2) Tejkalim ditësh nëse %përdorimi > 100%
 * 3) Afër kufirit nëse %përdorimi >= 85%
 * 4) Në rregull në çdo rast tjetër
 */
export function expertStatusBadge(
  lateCount: number,
  avgWeightedScore: number | null,
  usagePercent: number
): ExpertStatusBadge {
  if (lateCount > 0 || (avgWeightedScore != null && avgWeightedScore < 3)) {
    return "KUJDES";
  }
  if (usagePercent > 1) return "TEJKALIM";
  if (usagePercent >= 0.85) return "AFER_KUFIRIT";
  return "NE_RREGULL";
}

export type CatalogCoverage = "NUK_KA_FILLUAR" | "NE_PROCES" | "APROVUAR";

export const CATALOG_COVERAGE_LABELS: Record<CatalogCoverage, string> = {
  NUK_KA_FILLUAR: "⚪ Nuk ka Filluar",
  NE_PROCES: "🟡 Në Proces",
  APROVUAR: "✅ Aprovuar",
};

export function catalogCoverage(linkedStatuses: string[]): CatalogCoverage {
  if (linkedStatuses.length === 0) return "NUK_KA_FILLUAR";
  if (linkedStatuses.includes("APROVUAR")) return "APROVUAR";
  return "NE_PROCES";
}

/** Ngjyra e badge-it për %progres / %buxhet: jeshile <80%, verdhë 80-100%, kuqe >100%. */
export function progressColor(percent: number): "green" | "yellow" | "red" {
  if (percent > 1) return "red";
  if (percent >= 0.8) return "yellow";
  return "green";
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return round2(nums.reduce((a, b) => a + b, 0) / nums.length);
}
