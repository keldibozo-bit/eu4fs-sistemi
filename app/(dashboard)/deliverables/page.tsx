import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, Badge, EmptyState, inputCls } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import { weightedScore, decision, isLate } from "@/lib/compute";
import { DELIVERABLE_STATUS_LABELS, DELIVERABLE_TYPE_LABELS, type DeliverableStatusVal, type DeliverableTypeVal } from "@/lib/enums";
import { deleteDeliverable } from "@/app/actions/deliverable";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { Deliverable, Lot, Expert } from "@/lib/types";

const STATUS_COLOR: Record<string, "green" | "yellow" | "red" | "gray" | "blue"> = {
  DRAFT: "gray",
  DOREZUAR: "blue",
  NE_RISHIKIM: "yellow",
  KERKON_NDRYSHIME: "red",
  APROVUAR: "green",
};

export default async function DeliverablesPage({
  searchParams,
}: {
  searchParams: Promise<{ lotId?: string; expertId?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const [allDeliverables, lots, experts] = await Promise.all([
    prisma.deliverable.findMany({ orderBy: { title: "asc" } }) as Promise<Deliverable[]>,
    prisma.lot.findMany({ orderBy: { code: "asc" } }) as Promise<Lot[]>,
    prisma.expert.findMany({ orderBy: { name: "asc" } }) as Promise<Expert[]>,
  ]);

  const deliverables = allDeliverables.filter((d) => {
    if (sp.lotId && d.lotId !== sp.lotId) return false;
    if (sp.expertId && d.expertId !== sp.expertId) return false;
    if (sp.status && d.status !== sp.status) return false;
    return true;
  });

  const lotById = new Map(lots.map((l) => [l.id, l] as const));
  const expertById = new Map(experts.map((e) => [e.id, e] as const));

  return (
    <div>
      <PageHeader
        title="Deliverables & QC"
        subtitle="Lista e deliverables, statusi dhe vlerësimi i cilësisë"
        action={<LinkButton href="/deliverables/new">+ Deliverable i Ri</LinkButton>}
      />

      <Card className="p-4 mb-6">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Loti</label>
            <select name="lotId" defaultValue={sp.lotId ?? ""} className={inputCls}>
              <option value="">Të gjitha</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Eksperti</label>
            <select name="expertId" defaultValue={sp.expertId ?? ""} className={inputCls}>
              <option value="">Të gjithë</option>
              {experts.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Statusi</label>
            <select name="status" defaultValue={sp.status ?? ""} className={inputCls}>
              <option value="">Të gjitha</option>
              {(Object.keys(DELIVERABLE_STATUS_LABELS) as DeliverableStatusVal[]).map((s) => (
                <option key={s} value={s}>
                  {DELIVERABLE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2 hover:bg-slate-800"
          >
            Filtro
          </button>
          <Link href="/deliverables" className="text-sm text-slate-500 hover:underline pb-2">
            Pastro filtrat
          </Link>
        </form>
      </Card>

      <Card className="overflow-x-auto">
        {deliverables.length === 0 ? (
          <EmptyState text="Nuk u gjetën deliverables me këto filtra." />
        ) : (
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr>
                <Th>Titulli</Th>
                <Th>Loti</Th>
                <Th>Eksperti</Th>
                <Th>Tipi</Th>
                <Th>Afati</Th>
                <Th>Dorëzuar</Th>
                <Th>Me Vonesë</Th>
                <Th>Statusi</Th>
                <Th>Vlerësimi</Th>
                <Th>Vendimi</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {deliverables.map((d) => {
                const score = weightedScore(d);
                const dec = decision(d);
                const late = isLate(d.deadline, d.submissionDate);
                return (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">{d.title}</Td>
                    <Td>{lotById.get(d.lotId)?.code}</Td>
                    <Td>{expertById.get(d.expertId)?.name}</Td>
                    <Td>{DELIVERABLE_TYPE_LABELS[d.type as DeliverableTypeVal] ?? d.type}</Td>
                    <Td>{fmtDate(d.deadline)}</Td>
                    <Td>{fmtDate(d.submissionDate)}</Td>
                    <Td>{late ? <Badge color="red">Po</Badge> : "Jo"}</Td>
                    <Td>
                      <Badge color={STATUS_COLOR[d.status] ?? "gray"}>
                        {DELIVERABLE_STATUS_LABELS[d.status as DeliverableStatusVal] ?? d.status}
                      </Badge>
                    </Td>
                    <Td>{score != null ? score.toFixed(2) : "—"}</Td>
                    <Td className="text-slate-600">{dec ?? "—"}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/deliverables/${d.id}/edit`}
                          className="text-slate-700 hover:underline text-sm"
                        >
                          Ndrysho
                        </Link>
                        <Link
                          href={`/deliverables/${d.id}/historiku`}
                          className="text-slate-700 hover:underline text-sm"
                        >
                          Historiku
                        </Link>
                        <form action={deleteDeliverable.bind(null, d.id)}>
                          <DeleteSubmitButton />
                        </form>
                      </div>
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
