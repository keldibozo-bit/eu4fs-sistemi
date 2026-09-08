import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Badge, ProgressBar, Th, Td } from "@/components/ui";
import { buildProjectSummary, buildCatalogCoverage } from "@/lib/aggregate";
import { fmtEUR, fmtNum, fmtPercent, fmtDate } from "@/lib/format";
import { CATALOG_COVERAGE_LABELS } from "@/lib/compute";
import { PrintButton } from "@/components/TableTools";
import type {
  Lot,
  Expert,
  Deliverable,
  Timesheet,
  DeliverableCatalogItem,
  Cluster,
  Act,
} from "@/lib/types";
import Link from "next/link";

const UPCOMING_HORIZON_DAYS = 14;

type UpcomingItem = {
  type: string;
  label: string;
  lotCode: string;
  date: Date;
  daysLeft: number;
  href: string;
};

function buildUpcoming(
  lots: Lot[],
  experts: Expert[],
  deliverables: Deliverable[],
  clusters: Cluster[],
  acts: Act[]
): UpcomingItem[] {
  const now = Date.now();
  const lotCode = (lotId: string) => lots.find((l) => l.id === lotId)?.code ?? "—";
  const items: UpcomingItem[] = [];

  for (const d of deliverables) {
    if (!d.deadline || d.status === "APROVUAR") continue;
    const daysLeft = Math.floor((new Date(d.deadline).getTime() - now) / 86400000);
    if (daysLeft <= UPCOMING_HORIZON_DAYS) {
      items.push({
        type: "Deliverable",
        label: d.title,
        lotCode: lotCode(d.lotId),
        date: new Date(d.deadline),
        daysLeft,
        href: "/deliverables",
      });
    }
  }

  for (const e of experts) {
    if (!e.endDate || e.status !== "AKTIV") continue;
    const daysLeft = Math.floor((new Date(e.endDate).getTime() - now) / 86400000);
    if (daysLeft <= UPCOMING_HORIZON_DAYS) {
      items.push({
        type: "Kontratë Eksperti",
        label: e.name,
        lotCode: lotCode(e.lotId),
        date: new Date(e.endDate),
        daysLeft,
        href: "/ekspertet",
      });
    }
  }

  for (const a of acts) {
    if (!a.deadline || a.status === "MIRATUAR") continue;
    const daysLeft = Math.floor((new Date(a.deadline).getTime() - now) / 86400000);
    if (daysLeft <= UPCOMING_HORIZON_DAYS) {
      const cluster = clusters.find((c) => c.id === a.clusterId);
      items.push({
        type: "Transpozim Akti",
        label: a.euReference,
        lotCode: cluster ? lotCode(cluster.lotId) : "—",
        date: new Date(a.deadline),
        daysLeft,
        href: "/akte",
      });
    }
  }

  items.sort((a, b) => a.daysLeft - b.daysLeft);
  return items;
}

export default async function DashboardPage() {
  const [project, lots, experts, deliverables, timesheets, catalogItems, clusters, acts] =
    await Promise.all([
      prisma.project.findFirst(),
      prisma.lot.findMany({ orderBy: { code: "asc" } }) as Promise<Lot[]>,
      prisma.expert.findMany() as Promise<Expert[]>,
      prisma.deliverable.findMany() as Promise<Deliverable[]>,
      prisma.timesheet.findMany() as Promise<Timesheet[]>,
      prisma.deliverableCatalogItem.findMany({
        orderBy: { contractualId: "asc" },
      }) as Promise<DeliverableCatalogItem[]>,
      prisma.cluster.findMany() as Promise<Cluster[]>,
      prisma.act.findMany() as Promise<Act[]>,
    ]);

  const summary = buildProjectSummary(lots, experts, timesheets, deliverables);
  const coverage = buildCatalogCoverage(catalogItems, deliverables);
  const upcoming = buildUpcoming(lots, experts, deliverables, clusters, acts);

  const totals = {
    budgetDays: summary.reduce((s, r) => s + r.lot.budgetDaysExpert, 0),
    usedDays: summary.reduce((s, r) => s + r.usedDays, 0),
    activeExperts: summary.reduce((s, r) => s + r.activeExpertCount, 0),
    delivTotal: summary.reduce((s, r) => s + r.deliverableTotal, 0),
    delivApproved: summary.reduce((s, r) => s + r.deliverableApproved, 0),
    delivInProcess: summary.reduce((s, r) => s + r.deliverableInProcess, 0),
    delivLate: summary.reduce((s, r) => s + r.deliverableLate, 0),
    costUsed: summary.reduce((s, r) => s + r.costUsed, 0),
    budgetEUR: summary.reduce((s, r) => s + (r.lot.budgetEUR ?? 0), 0),
  };
  const totalsProgress = totals.budgetDays > 0 ? totals.usedDays / totals.budgetDays : 0;
  const totalsBudgetPct = totals.budgetEUR > 0 ? totals.costUsed / totals.budgetEUR : null;

  return (
    <div>
      <PageHeader
        title="Përmbledhja e Projektit"
        subtitle={
          project
            ? `${project.name} • Financuar nga ${project.funder} • ToR ${project.torReference} • PM: ${project.pmName}`
            : undefined
        }
        action={<PrintButton />}
      />

      <div className="mb-8 print:hidden">
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Afatet e Ardhshme{" "}
          <span className="text-sm font-normal text-slate-500">
            (brenda {UPCOMING_HORIZON_DAYS} ditësh, ose me vonesë)
          </span>
        </h2>
        <Card className="overflow-x-auto">
          {upcoming.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-8">
              Nuk ka afate urgjente për momentin.
            </div>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <Th>Tipi</Th>
                  <Th>Përshkrimi</Th>
                  <Th>Lot</Th>
                  <Th>Data</Th>
                  <Th>Ditë të Mbetura</Th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <Td className="text-slate-500">{item.type}</Td>
                    <Td className="font-medium text-slate-900">
                      <Link href={item.href} className="hover:underline">
                        {item.label}
                      </Link>
                    </Td>
                    <Td>{item.lotCode}</Td>
                    <Td>{fmtDate(item.date)}</Td>
                    <Td>
                      {item.daysLeft < 0 ? (
                        <Badge color="red">Vonesë {Math.abs(item.daysLeft)} ditë</Badge>
                      ) : item.daysLeft <= 7 ? (
                        <Badge color="yellow">{item.daysLeft} ditë</Badge>
                      ) : (
                        <Badge color="gray">{item.daysLeft} ditë</Badge>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card className="overflow-x-auto mb-8">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr>
              <Th>Lot</Th>
              <Th>Fokusi</Th>
              <Th>Ditë Buxhet</Th>
              <Th>Ditë Përdorur</Th>
              <Th>% Progres</Th>
              <Th>Ekspertë Aktivë</Th>
              <Th>Deliverables</Th>
              <Th>Aprovuar</Th>
              <Th>Në Proces</Th>
              <Th>Me Vonesë</Th>
              <Th>Vlerësim Mesatar</Th>
              <Th>Buxhet €</Th>
              <Th>Kosto e Përdorur</Th>
              <Th>% Buxheti</Th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={row.lot.id} className="hover:bg-slate-50">
                <Td className="font-medium text-slate-900">
                  <Link href="/lote" className="hover:underline">
                    {row.lot.code} — {row.lot.name}
                  </Link>
                </Td>
                <Td>{row.lot.focus}</Td>
                <Td>{row.lot.budgetDaysExpert}</Td>
                <Td>{fmtNum(row.usedDays)}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <ProgressBar percent={row.progressPercent} />
                    <span>{fmtPercent(row.progressPercent)}</span>
                  </div>
                </Td>
                <Td>{row.activeExpertCount}</Td>
                <Td>{row.deliverableTotal}</Td>
                <Td>{row.deliverableApproved}</Td>
                <Td>{row.deliverableInProcess}</Td>
                <Td>
                  {row.deliverableLate > 0 ? (
                    <Badge color="red">{row.deliverableLate}</Badge>
                  ) : (
                    0
                  )}
                </Td>
                <Td>{row.avgWeightedScore != null ? fmtNum(row.avgWeightedScore, 2) : "—"}</Td>
                <Td>{fmtEUR(row.lot.budgetEUR)}</Td>
                <Td>{fmtEUR(row.costUsed)}</Td>
                <Td>
                  {row.budgetUsedPercent != null ? (
                    <div className="flex items-center gap-2">
                      <ProgressBar percent={row.budgetUsedPercent} />
                      <span>{fmtPercent(row.budgetUsedPercent)}</span>
                    </div>
                  ) : (
                    "—"
                  )}
                </Td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-semibold">
              <Td>TOTALI</Td>
              <Td></Td>
              <Td>{totals.budgetDays}</Td>
              <Td>{fmtNum(totals.usedDays)}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <ProgressBar percent={totalsProgress} />
                  <span>{fmtPercent(totalsProgress)}</span>
                </div>
              </Td>
              <Td>{totals.activeExperts}</Td>
              <Td>{totals.delivTotal}</Td>
              <Td>{totals.delivApproved}</Td>
              <Td>{totals.delivInProcess}</Td>
              <Td>{totals.delivLate}</Td>
              <Td></Td>
              <Td>{fmtEUR(totals.budgetEUR || null)}</Td>
              <Td>{fmtEUR(totals.costUsed)}</Td>
              <Td>
                {totalsBudgetPct != null ? (
                  <div className="flex items-center gap-2">
                    <ProgressBar percent={totalsBudgetPct} />
                    <span>{fmtPercent(totalsBudgetPct)}</span>
                  </div>
                ) : (
                  "—"
                )}
              </Td>
            </tr>
          </tbody>
        </table>
      </Card>

      <h2 className="text-base font-semibold text-slate-900 mb-3">
        Katalogu i Deliverables — Mbulimi
      </h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Titulli</Th>
              <Th>Lot</Th>
              <Th>Afati Indikativ</Th>
              <Th>Deliverables të Lidhura</Th>
              <Th>Statusi i Mbulimit</Th>
            </tr>
          </thead>
          <tbody>
            {coverage.map((row) => (
              <tr key={row.item.id} className="hover:bg-slate-50">
                <Td className="font-medium">{row.item.contractualId}</Td>
                <Td>
                  <Link href="/katalogu" className="hover:underline">
                    {row.item.title}
                  </Link>
                </Td>
                <Td>{lots.find((l) => l.id === row.item.lotId)?.code}</Td>
                <Td>{fmtDate(row.item.indicativeDeadline)}</Td>
                <Td>{row.linkedCount}</Td>
                <Td>{CATALOG_COVERAGE_LABELS[row.coverage]}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
