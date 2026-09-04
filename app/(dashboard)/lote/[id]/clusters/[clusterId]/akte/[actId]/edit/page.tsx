import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import ActForm from "@/components/forms/ActForm";
import { updateAct } from "@/app/actions/act";
import type { Cluster, Act } from "@/lib/types";

export default async function EditActPage({
  params,
}: {
  params: Promise<{ id: string; clusterId: string; actId: string }>;
}) {
  const { id, clusterId, actId } = await params;
  const cluster = (await prisma.cluster.findUnique({ where: { id: clusterId } })) as Cluster | null;
  if (!cluster || cluster.lotId !== id) notFound();

  const act = (await prisma.act.findUnique({ where: { id: actId } })) as Act | null;
  if (!act || act.clusterId !== clusterId) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho Aktin — ${act.euReference}`} />
      <ActForm action={updateAct.bind(null, actId, clusterId, id)} defaultValues={act} />
    </div>
  );
}
