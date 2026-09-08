import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Th, Td, Badge, EmptyState } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import { TRANSPOSITION_STATUS_LABELS, type TranspositionStatusVal } from "@/lib/enums";
import { TableSearch, ExportCsvButton, PrintButton } from "@/components/TableTools";
import Link from "next/link";
import type { Lot, Cluster, Act } from "@/lib/types";

const STATUS_COLOR: Record<string, "green" | "yellow" | "gray" | "blue"> = {
  NUK_KA_FILLUAR: "gray",
  NE_PROCES: "yellow",
  PERAFRUAR: "blue",
  MIRATUAR: "green",
};

function isOverdue(a: Act): boolean {
  if (!a.deadline || a.status === "MIRATUAR") return false;
  return new Date(a.deadline).getTime() < Date.now();
}

function isDueSoon(a: Act): boolean {
  if (!a.deadline || a.status === "MIRATUAR") return false;
  const days = (new Date(a.deadline).getTime() - Date.now()) / 86400000;
  return days >= 0 && days <= 30;
}

export default async function AktetPage() {
  const [lots, clusters, acts] = await Promise.all([
    prisma.lot.findMany({ orderBy: { code: "asc" } }) as Promise<Lot[]>,
    prisma.cluster.findMany({ orderBy: { order: "asc" } }) as Promise<Cluster[]>,
    prisma.act.findMany({ orderBy: { deadline: "asc" } }) as Promise<Act[]>,
  ]);

  const clustersByLot = new Map(
    lots.map((l) => [l.id, clusters.filter((c) => c.lotId === l.id)] as const)
  );
  const actsByCluster = new Map(
    clusters.map((c) => [c.id, acts.filter((a) => a.clusterId === c.id)] as const)
  );

  const totalActs = acts.length;
  const overdueCount = acts.filter(isOverdue).length;
  const dueSoonCount = acts.filter(isDueSoon).length;
  const approvedCount = acts.filter((a) => a.status === "MIRATUAR").length;

  return (
    <div>
      <PageHeader
        title="Lista e Akteve — të gjitha lotet"
        subtitle="Tabela e korrelacionit: akte/direktiva të BE-së dhe akti përkatës shqiptar, sipas lotit dhe cluster-it"
        action={<PrintButton />}
      />

      <div className="flex flex-wrap gap-4 mb-8 print:hidden">
        <Card className="px-4 py-3">
          <div className="text-xs text-slate-500">Total Akte</div>
          <div className="text-xl font-semibold text-slate-900">{totalActs}</div>
        </Card>
        <Card className="px-4 py-3">
          <div className="text-xs text-slate-500">Miratuar</div>
          <div className="text-xl font-semibold text-green-700">{approvedCount}</div>
        </Card>
        <Card className="px-4 py-3">
          <div className="text-xs text-slate-500">Afër Afatit (30 ditë)</div>
          <div className="text-xl font-semibold text-yellow-700">{dueSoonCount}</div>
        </Card>
        <Card className="px-4 py-3">
          <div className="text-xs text-slate-500">Me Vonesë</div>
          <div className="text-xl font-semibold text-red-700">{overdueCount}</div>
        </Card>
      </div>

      {lots.length === 0 ? (
        <Card className="overflow-x-auto">
          <EmptyState text="Nuk ka lote të regjistruara ende." />
        </Card>
      ) : (
        lots.map((lot) => {
          const lotClusters = clustersByLot.get(lot.id) ?? [];
          const lotActs = lotClusters.flatMap((c) => actsByCluster.get(c.id) ?? []);
          const tableId = `akte-${lot.id}`;
          return (
            <section key={lot.id} className="mb-10">
              <h2 className="text-lg font-semibold text-slate-900">
                {lot.code} — {lot.name}
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                {lotActs.length === 0 ? "Nuk ka akte në këtë lot" : `${lotActs.length} akte`}
              </p>

              {lotActs.length > 0 && (
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap print:hidden">
                  <TableSearch targetId={tableId} placeholder="Kërko referencë BE ose akt shqiptar..." />
                  <ExportCsvButton targetId={tableId} filename={`akte-${lot.code}`} />
                </div>
              )}

              <Card className="overflow-x-auto">
                {lotActs.length === 0 ? (
                  <EmptyState text="Nuk ka akte të regjistruara për këtë lot ende." />
                ) : (
                  <table id={tableId} className="w-full min-w-[1000px]">
                    <thead>
                      <tr>
                        <Th>Cluster</Th>
                        <Th>Referenca BE</Th>
                        <Th>Akti Shqiptar</Th>
                        <Th>Statusi</Th>
                        <Th>Afati</Th>
                        <Th>Shënime</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {lotClusters.flatMap((cluster) =>
                        (actsByCluster.get(cluster.id) ?? []).map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <Td>
                              <Link
                                href={`/lote/${lot.id}/clusters/${cluster.id}/akte`}
                                className="hover:underline text-slate-600"
                              >
                                {cluster.name}
                              </Link>
                            </Td>
                            <Td className="font-medium text-slate-900">{a.euReference}</Td>
                            <Td>{a.albanianAct}</Td>
                            <Td>
                              <Badge color={STATUS_COLOR[a.status]}>
                                {TRANSPOSITION_STATUS_LABELS[a.status as TranspositionStatusVal] ?? a.status}
                              </Badge>
                            </Td>
                            <Td
                              className={
                                isOverdue(a)
                                  ? "text-red-600 font-medium"
                                  : isDueSoon(a)
                                  ? "text-yellow-700 font-medium"
                                  : ""
                              }
                            >
                              {fmtDate(a.deadline)}
                              {isOverdue(a) ? " ⚠" : ""}
                            </Td>
                            <Td className="text-slate-500">{a.notes ?? "—"}</Td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </Card>
            </section>
          );
        })
      )}
    </div>
  );
}
