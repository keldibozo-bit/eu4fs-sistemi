import {
  weightedScore,
  isLate,
  expertStatusBadge,
  catalogCoverage,
  avg,
  round2,
  type ExpertStatusBadge,
  type CatalogCoverage,
} from "@/lib/compute";
import type {
  Lot,
  Expert,
  Deliverable,
  Timesheet,
  IssueLog,
  DeliverableCatalogItem,
} from "@/lib/types";

export type ExpertOverviewRow = {
  expert: Expert;
  usedDays: number;
  usagePercent: number;
  totalDeliverables: number;
  approvedCount: number;
  lateCount: number;
  avgWeightedScore: number | null;
  linkedIssuesCount: number;
  costUsed: number | null;
  statusBadge: ExpertStatusBadge;
};

export function buildExpertOverview(
  experts: Expert[],
  timesheets: Timesheet[],
  deliverables: Deliverable[],
  issues: IssueLog[]
): ExpertOverviewRow[] {
  return experts.map((expert) => {
    const ownTimesheets = timesheets.filter((t) => t.expertId === expert.id);
    const usedDays = round2(ownTimesheets.reduce((sum, t) => sum + t.daysWorked, 0));
    const usagePercent = expert.contractedDays > 0 ? usedDays / expert.contractedDays : 0;

    const ownDeliverables = deliverables.filter((d) => d.expertId === expert.id);
    const totalDeliverables = ownDeliverables.length;
    const approvedCount = ownDeliverables.filter((d) => d.status === "APROVUAR").length;
    const lateCount = ownDeliverables.filter((d) =>
      isLate(d.deadline, d.submissionDate)
    ).length;
    const scores = ownDeliverables
      .map((d) => weightedScore(d))
      .filter((s): s is number => s != null);
    const avgWeightedScore = avg(scores);

    const nameLower = expert.name.toLowerCase();
    const linkedIssuesCount = issues.filter((i) =>
      i.expertsInvolved.toLowerCase().includes(nameLower)
    ).length;

    const costUsed = expert.dailyRateEUR != null ? round2(usedDays * expert.dailyRateEUR) : null;

    const statusBadge = expertStatusBadge(lateCount, avgWeightedScore, usagePercent);

    return {
      expert,
      usedDays,
      usagePercent,
      totalDeliverables,
      approvedCount,
      lateCount,
      avgWeightedScore,
      linkedIssuesCount,
      costUsed,
      statusBadge,
    };
  });
}

export type LotSummaryRow = {
  lot: Lot;
  usedDays: number;
  progressPercent: number;
  activeExpertCount: number;
  deliverableTotal: number;
  deliverableApproved: number;
  deliverableInProcess: number;
  deliverableLate: number;
  avgWeightedScore: number | null;
  costUsed: number;
  budgetUsedPercent: number | null;
};

export function buildProjectSummary(
  lots: Lot[],
  experts: Expert[],
  timesheets: Timesheet[],
  deliverables: Deliverable[]
): LotSummaryRow[] {
  return lots.map((lot) => {
    const lotExperts = experts.filter((e) => e.lotId === lot.id);
    const lotExpertIds = new Set(lotExperts.map((e) => e.id));
    const lotTimesheets = timesheets.filter((t) => lotExpertIds.has(t.expertId));
    const usedDays = round2(lotTimesheets.reduce((sum, t) => sum + t.daysWorked, 0));
    const progressPercent = lot.budgetDaysExpert > 0 ? usedDays / lot.budgetDaysExpert : 0;

    const activeExpertCount = lotExperts.filter((e) => e.status === "AKTIV").length;

    const lotDeliverables = deliverables.filter((d) => d.lotId === lot.id);
    const deliverableTotal = lotDeliverables.length;
    const deliverableApproved = lotDeliverables.filter((d) => d.status === "APROVUAR").length;
    const deliverableInProcess = lotDeliverables.filter(
      (d) => d.status === "DOREZUAR" || d.status === "NE_RISHIKIM" || d.status === "KERKON_NDRYSHIME"
    ).length;
    const deliverableLate = lotDeliverables.filter((d) =>
      isLate(d.deadline, d.submissionDate)
    ).length;
    const scores = lotDeliverables
      .map((d) => weightedScore(d))
      .filter((s): s is number => s != null);
    const avgWeightedScore = avg(scores);

    const costUsed = round2(
      lotExperts.reduce((sum, e) => {
        const days = lotTimesheets
          .filter((t) => t.expertId === e.id)
          .reduce((s, t) => s + t.daysWorked, 0);
        return sum + (e.dailyRateEUR != null ? days * e.dailyRateEUR : 0);
      }, 0)
    );
    const budgetUsedPercent = lot.budgetEUR ? costUsed / lot.budgetEUR : null;

    return {
      lot,
      usedDays,
      progressPercent,
      activeExpertCount,
      deliverableTotal,
      deliverableApproved,
      deliverableInProcess,
      deliverableLate,
      avgWeightedScore,
      costUsed,
      budgetUsedPercent,
    };
  });
}

export type CatalogCoverageRow = {
  item: DeliverableCatalogItem;
  linkedCount: number;
  coverage: CatalogCoverage;
};

export function buildCatalogCoverage(
  catalogItems: DeliverableCatalogItem[],
  deliverables: Deliverable[]
): CatalogCoverageRow[] {
  return catalogItems.map((item) => {
    const linked = deliverables.filter((d) => d.catalogItemId === item.id);
    return {
      item,
      linkedCount: linked.length,
      coverage: catalogCoverage(linked.map((d) => d.status)),
    };
  });
}
