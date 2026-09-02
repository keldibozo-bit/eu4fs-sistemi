import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, Badge, ProgressBar, EmptyState } from "@/components/ui";
import { fmtDate, fmtEUR, fmtNum, fmtPercent } from "@/lib/format";
import { EXPERT_ROLE_LABELS, EXPERT_STATUS_LABELS, type ExpertRole, type ExpertStatus } from "@/lib/enums";
import { EXPERT_STATUS_BADGE_LABELS } from "@/lib/compute";
import { buildExpertOverview } from "@/lib/aggregate";
import { deleteExpert } from "@/app/actions/expert";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { Expert, Lot, Deliverable, Timesheet, IssueLog } from "@/lib/types";

const BADGE_COLOR: Record<string, "green" | "yellow" | "red" | "gray"> = {
  KUJDES: "red",
  TEJKALIM: "red",
  AFER_KUFIRIT: "yellow",
  NE_RREGULL: "green",
};

export default async function EkspertetPage() {
  const [experts, lots, timesheets, deliverables, issues] = await Promise.all([
    prisma.expert.findMany({ orderBy: { name: "asc" } }) as Promise<Expert[]>,
    prisma.lot.findMany() as Promise<Lot[]>,
    prisma.timesheet.findMany() as Promise<Timesheet[]>,
    prisma.deliverable.findMany() as Promise<Deliverable[]>,
    prisma.issueLog.findMany() as Promise<IssueLog[]>,
  ]);

  const lotById = new Map(lots.map((l) => [l.id, l] as const));
  const overview = buildExpertOverview(
    experts as Expert[],
    timesheets as Timesheet[],
    deliverables as Deliverable[],
    issues as IssueLog[]
  );

  return (
    <div>
      <PageHeader
        title="Ekspertët"
        subtitle="Roster-i i ekspertëve dhe pasqyra e përdorimit"
        action={<LinkButton href="/ekspertet/new">+ Ekspert i Ri</LinkButton>}
      />

      <Card className="overflow-x-auto mb-8">
        {experts.length === 0 ? (
          <EmptyState text="Nuk ka ekspertë të regjistruar ende." />
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr>
                <Th>Emri</Th>
                <Th>Roli</Th>
                <Th>Loti</Th>
                <Th>Fusha e Ekspertizës</Th>
                <Th>Ditë Kontraktuara</Th>
                <Th>Tarifa €/ditë</Th>
                <Th>Fillimi</Th>
                <Th>Mbarimi</Th>
                <Th>Email</Th>
                <Th>Statusi</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {experts.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{e.name}</Td>
                  <Td>{EXPERT_ROLE_LABELS[e.role as ExpertRole] ?? e.role}</Td>
                  <Td>{lotById.get(e.lotId)?.code}</Td>
                  <Td>{e.expertiseArea}</Td>
                  <Td>{fmtNum(e.contractedDays)}</Td>
                  <Td>{fmtEUR(e.dailyRateEUR)}</Td>
                  <Td>{fmtDate(e.startDate)}</Td>
                  <Td>{fmtDate(e.endDate)}</Td>
                  <Td>{e.email}</Td>
                  <Td>{EXPERT_STATUS_LABELS[e.status as ExpertStatus] ?? e.status}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link href={`/ekspertet/${e.id}/edit`} className="text-slate-700 hover:underline text-sm">
                        Ndrysho
                      </Link>
                      <form action={deleteExpert.bind(null, e.id)}>
                        <DeleteSubmitButton />
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <h2 className="text-base font-semibold text-slate-900 mb-3">
        Pasqyra e Ekspertit
      </h2>
      <Card className="overflow-x-auto">
        {overview.length === 0 ? (
          <EmptyState text="Nuk ka të dhëna." />
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr>
                <Th>Emri</Th>
                <Th>Loti</Th>
                <Th>Ditë Kontraktuara</Th>
                <Th>Ditë Përdorur</Th>
                <Th>% Përdorimi</Th>
                <Th>Deliverables</Th>
                <Th>Aprovuar</Th>
                <Th>Me Vonesë</Th>
                <Th>Vlerësim Mesatar</Th>
                <Th>Probl./Bashkëp. të Lidhura</Th>
                <Th>Kosto e Përdorur</Th>
                <Th>Statusi</Th>
              </tr>
            </thead>
            <tbody>
              {overview.map((row) => (
                <tr key={row.expert.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{row.expert.name}</Td>
                  <Td>{lotById.get(row.expert.lotId)?.code}</Td>
                  <Td>{fmtNum(row.expert.contractedDays)}</Td>
                  <Td>{fmtNum(row.usedDays)}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <ProgressBar percent={row.usagePercent} />
                      <span>{fmtPercent(row.usagePercent)}</span>
                    </div>
                  </Td>
                  <Td>{row.totalDeliverables}</Td>
                  <Td>{row.approvedCount}</Td>
                  <Td>{row.lateCount > 0 ? <Badge color="red">{row.lateCount}</Badge> : 0}</Td>
                  <Td>{row.avgWeightedScore != null ? fmtNum(row.avgWeightedScore, 2) : "—"}</Td>
                  <Td>{row.linkedIssuesCount}</Td>
                  <Td>{fmtEUR(row.costUsed)}</Td>
                  <Td>
                    <Badge color={BADGE_COLOR[row.statusBadge]}>
                      {EXPERT_STATUS_BADGE_LABELS[row.statusBadge]}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
