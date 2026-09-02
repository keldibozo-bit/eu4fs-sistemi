import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, Badge, EmptyState } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import {
  ISSUE_TYPE_LABELS,
  IMPACT_LEVEL_LABELS,
  ISSUE_STATUS_LABELS,
  type IssueTypeVal,
  type ImpactLevelVal,
  type IssueStatusVal,
} from "@/lib/enums";
import { deleteIssue } from "@/app/actions/issue";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { IssueLog, Lot } from "@/lib/types";

const IMPACT_COLOR: Record<string, "green" | "yellow" | "red"> = {
  I_LARTE: "red",
  MESATAR: "yellow",
  I_ULET: "green",
};

const STATUS_COLOR: Record<string, "gray" | "yellow" | "green"> = {
  HAPUR: "gray",
  NE_PROCES: "yellow",
  MBYLLUR: "green",
};

export default async function ProblematikaPage() {
  const [issues, lots] = await Promise.all([
    prisma.issueLog.findMany({ orderBy: { date: "desc" } }) as Promise<IssueLog[]>,
    prisma.lot.findMany() as Promise<Lot[]>,
  ]);
  const lotById = new Map(lots.map((l) => [l.id, l] as const));

  return (
    <div>
      <PageHeader
        title="Log Problematikash"
        subtitle="Problematika, rreziqe, varësi dhe raste bashkëpunimi (RAID log)"
        action={<LinkButton href="/problematika/new">+ Rresht i Ri</LinkButton>}
      />
      <Card className="overflow-x-auto">
        {issues.length === 0 ? (
          <EmptyState text="Nuk ka rreshta të regjistruar ende." />
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Tipi</Th>
                <Th>Loti</Th>
                <Th>Ekspertë të Përfshirë</Th>
                <Th>Përshkrimi</Th>
                <Th>Ndikimi</Th>
                <Th>Statusi</Th>
                <Th>Përgjegjës për Zgjidhje</Th>
                <Th>Data e Zgjidhjes</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50">
                  <Td>{fmtDate(i.date)}</Td>
                  <Td>{ISSUE_TYPE_LABELS[i.type as IssueTypeVal] ?? i.type}</Td>
                  <Td>{lotById.get(i.lotId)?.code}</Td>
                  <Td>{i.expertsInvolved}</Td>
                  <Td className="max-w-xs">{i.description}</Td>
                  <Td>
                    <Badge color={IMPACT_COLOR[i.impact]}>
                      {IMPACT_LEVEL_LABELS[i.impact as ImpactLevelVal] ?? i.impact}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge color={STATUS_COLOR[i.status]}>
                      {ISSUE_STATUS_LABELS[i.status as IssueStatusVal] ?? i.status}
                    </Badge>
                  </Td>
                  <Td>{i.responsibleForResolution ?? "—"}</Td>
                  <Td>{fmtDate(i.resolutionDate)}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/problematika/${i.id}/edit`}
                        className="text-slate-700 hover:underline text-sm"
                      >
                        Ndrysho
                      </Link>
                      <form action={deleteIssue.bind(null, i.id)}>
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
    </div>
  );
}
