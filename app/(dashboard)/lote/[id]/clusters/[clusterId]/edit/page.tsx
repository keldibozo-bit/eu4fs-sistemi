import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import ClusterForm from "@/components/forms/ClusterForm";
import { renameCluster } from "@/app/actions/cluster";
import type { Cluster } from "@/lib/types";

export default async function EditClusterPage({
  params,
}: {
  params: Promise<{ id: string; clusterId: string }>;
}) {
  const { id, clusterId } = await params;
  const cluster = (await prisma.cluster.findUnique({ where: { id: clusterId } })) as Cluster | null;
  if (!cluster || cluster.lotId !== id) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho Cluster — ${cluster.name}`} />
      <ClusterForm action={renameCluster.bind(null, clusterId, id)} defaultValues={cluster} />
    </div>
  );
}
