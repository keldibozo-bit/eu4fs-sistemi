// Tipe të thjeshta për format e rreshtave, të pavarura nga tipet e gjeneruara
// automatikisht nga Prisma (ato varen nga `prisma generate`, që kërkon qasje
// në internet te binaries.prisma.sh — shih README.md, seksioni "Shënim mbi
// mjedisin e ndërtimit"). Këto forma pasqyrojnë saktësisht modelet e
// prisma/schema.prisma dhe përdoren për siguri tipesh brenda kodit të UI-t.

export type Lot = {
  id: string;
  code: string;
  name: string;
  focus: string;
  budgetDaysExpert: number;
  budgetEUR: number | null;
  maxExperts: number | null;
  pmResponsible: string;
};

export type Expert = {
  id: string;
  name: string;
  role: string;
  lotId: string;
  lot?: Lot;
  expertiseArea: string;
  contractedDays: number;
  dailyRateEUR: number | null;
  startDate: Date;
  endDate: Date | null;
  email: string;
  phone: string | null;
  status: string;
  pmNotes: string | null;
};

export type DeliverableCatalogItem = {
  id: string;
  contractualId: string;
  lotId: string;
  lot?: Lot;
  title: string;
  reference: string;
  indicativeDeadline: Date | null;
  plannedExperts: string | null;
  notes: string | null;
};

export type Deliverable = {
  id: string;
  catalogItemId: string | null;
  catalogItem?: DeliverableCatalogItem | null;
  lotId: string;
  lot?: Lot;
  expertId: string;
  expert?: Expert;
  title: string;
  type: string;
  deadline: Date | null;
  submissionDate: Date | null;
  status: string;
  k1: number | null;
  k2: number | null;
  k3: number | null;
  k4: number | null;
  k5: number | null;
  k6: number | null;
  reviewer: string | null;
  qcComments: string | null;
  version: number;
  finalApprovalDate: Date | null;
  secondaryReviewer: string | null;
  secondaryReviewConfirmed: string | null;
};

export type VersionHistory = {
  id: string;
  deliverableId: string;
  version: number;
  date: Date;
  changesRequestedOrMade: string;
  by: string;
  statusOfThisVersion: string;
};

export type Timesheet = {
  id: string;
  date: Date;
  expertId: string;
  expert?: Expert;
  daysWorked: number;
  activityDescription: string;
  linkedDeliverableId: string | null;
  linkedDeliverable?: Deliverable | null;
  submittedBy: string | null;
  registeredAt: Date;
  notes: string | null;
};

export type IssueLog = {
  id: string;
  date: Date;
  type: string;
  lotId: string;
  lot?: Lot;
  expertsInvolved: string;
  description: string;
  impact: string;
  status: string;
  responsibleForResolution: string | null;
  resolutionDate: Date | null;
  notesResult: string | null;
};

export type RaciEntry = {
  id: string;
  activity: string;
  responsible: string;
  accountable: string;
  consulted: string;
  informed: string;
};

export type QcCriterion = {
  id: string;
  type: string;
  code: string;
  title: string;
  description: string;
  weightPercent: number;
};

export type Project = {
  id: string;
  name: string;
  funder: string;
  torReference: string;
  startDate: Date | null;
  endDate: Date | null;
  pmName: string;
};
