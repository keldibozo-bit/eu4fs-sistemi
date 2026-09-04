import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, EmptyState } from "@/components/ui";
import { deleteCluster } from "@/app/actions/cluster";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { Lot, Cluster } from "@/lib/types";

export default async function LotClustersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lot = (await prisma.lot.findUnique({ where: { id } })) as Lot | null;
  if (!lot) notFound();

  const clusters = (await prisma.cluster.findMany({
    where: { lotId: id },
    orderBy: { order: "asc" },
  })) as Cluster[];

  return (
    <div>
      <PageHeader
        title={`Cluster-at — ${lot.code}`}
        subtitle="Grupe direktivash/aktesh BE që duhen përafruar me legjislacionin shqiptar"
        action={<LinkButton href={`/lote/${id}/clusters/new`}>+ Cluster i Ri</LinkButton>}
      />
      <Card className="overflow-x-auto">
        {clusters.length === 0 ? (
          <EmptyState text="Nuk ka cluster të krijuar ende për këtë lot." />
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <Th>Emri</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{c.name}</Td>
                  <Td>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link href={`/lote/${id}/clusters/${c.id}/plan`} className="text-slate-700 hover:underline text-sm">
                        Plani i Punës
                      </Link>
                      <Link href={`/lote/${id}/clusters/${c.id}/akte`} className="text-slate-700 hover:underline text-sm">
                        Lista e Akteve
                      </Link>
                      <Link href={`/lote/${id}/clusters/${c.id}/eksperte`} className="text-slate-700 hover:underline text-sm">
                        Lista e Ekspertëve
                      </Link>
                      <Link href={`/lote/${id}/clusters/${c.id}/edit`} className="text-slate-700 hover:underline text-sm">
                        Ndrysho
                      </Link>
                      <form action={deleteCluster.bind(null, c.id, id)}>
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
