import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, Badge, EmptyState } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import { TRANSPOSITION_STATUS_LABELS, type TranspositionStatusVal } from "@/lib/enums";
import { deleteAct } from "@/app/actions/act";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { Cluster, Act } from "@/lib/types";

const STATUS_COLOR: Record<string, "green" | "yellow" | "gray" | "blue"> = {
  NUK_KA_FILLUAR: "gray",
  NE_PROCES: "yellow",
  PERAFRUAR: "blue",
  MIRATUAR: "green",
};

export default async function ClusterActsPage({
  params,
}: {
  params: Promise<{ id: string; clusterId: string }>;
}) {
  const { id, clusterId } = await params;
  const cluster = (await prisma.cluster.findUnique({ where: { id: clusterId } })) as Cluster | null;
  if (!cluster || cluster.lotId !== id) notFound();

  const acts = (await prisma.act.findMany({
    where: { clusterId },
    orderBy: { euReference: "asc" },
  })) as Act[];

  return (
    <div>
      <PageHeader
        title={`Lista e Akteve — ${cluster.name}`}
        subtitle="Direktiva, rregullore dhe urdhra BE që duhen përafruar, dhe akti përkatës shqiptar"
        action={<LinkButton href={`/lote/${id}/clusters/${clusterId}/akte/new`}>+ Akt i Ri</LinkButton>}
      />
      <Card className="overflow-x-auto">
        {acts.length === 0 ? (
          <EmptyState text="Nuk ka akte të regjistruara ende për këtë cluster." />
        ) : (
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr>
                <Th>Referenca BE</Th>
                <Th>Akti Shqiptar</Th>
                <Th>Statusi</Th>
                <Th>Afati</Th>
                <Th>Shënime</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {acts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{a.euReference}</Td>
                  <Td>{a.albanianAct}</Td>
                  <Td>
                    <Badge color={STATUS_COLOR[a.status]}>
                      {TRANSPOSITION_STATUS_LABELS[a.status as TranspositionStatusVal] ?? a.status}
                    </Badge>
                  </Td>
                  <Td>{fmtDate(a.deadline)}</Td>
                  <Td className="text-slate-500">{a.notes ?? "—"}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/lote/${id}/clusters/${clusterId}/akte/${a.id}/edit`}
                        className="text-slate-700 hover:underline text-sm"
                      >
                        Ndrysho
                      </Link>
                      <form action={deleteAct.bind(null, a.id, clusterId, id)}>
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
