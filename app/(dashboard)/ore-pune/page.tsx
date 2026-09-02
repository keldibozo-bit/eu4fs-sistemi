import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, EmptyState } from "@/components/ui";
import { fmtDate, fmtNum } from "@/lib/format";
import { deleteTimesheet } from "@/app/actions/timesheet";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import type { Timesheet, Expert, Lot, Deliverable } from "@/lib/types";

export default async function OrePunePage() {
  const [timesheets, experts, lots, deliverables] = await Promise.all([
    prisma.timesheet.findMany({ orderBy: { date: "desc" } }) as Promise<Timesheet[]>,
    prisma.expert.findMany() as Promise<Expert[]>,
    prisma.lot.findMany() as Promise<Lot[]>,
    prisma.deliverable.findMany() as Promise<Deliverable[]>,
  ]);

  const expertById = new Map(experts.map((e) => [e.id, e] as const));
  const lotById = new Map(lots.map((l) => [l.id, l] as const));
  const deliverableById = new Map(deliverables.map((d) => [d.id, d] as const));

  return (
    <div>
      <PageHeader
        title="Fletë Kohe"
        subtitle="Ditët e punës së raportuara nga ekspertët (loti llogaritet automatikisht nga eksperti)"
        action={<LinkButton href="/ore-pune/new">+ Regjistro Ditë</LinkButton>}
      />
      <Card className="overflow-x-auto">
        {timesheets.length === 0 ? (
          <EmptyState text="Nuk ka fletë kohe të regjistruara ende." />
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Eksperti</Th>
                <Th>Loti</Th>
                <Th>Ditë të Punuara</Th>
                <Th>Përshkrimi i Aktivitetit</Th>
                <Th>Deliverable i Lidhur</Th>
                <Th>Regjistruar Nga</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((t) => {
                const expert = expertById.get(t.expertId);
                const lot = expert ? lotById.get(expert.lotId) : undefined;
                const linked = t.linkedDeliverableId
                  ? deliverableById.get(t.linkedDeliverableId)
                  : null;
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <Td>{fmtDate(t.date)}</Td>
                    <Td className="font-medium text-slate-900">{expert?.name ?? "—"}</Td>
                    <Td>{lot?.code ?? "—"}</Td>
                    <Td>{fmtNum(t.daysWorked)}</Td>
                    <Td>{t.activityDescription}</Td>
                    <Td>{linked?.title ?? "—"}</Td>
                    <Td>{t.submittedBy ?? "—"}</Td>
                    <Td>
                      <form action={deleteTimesheet.bind(null, t.id)}>
                        <DeleteSubmitButton />
                      </form>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
