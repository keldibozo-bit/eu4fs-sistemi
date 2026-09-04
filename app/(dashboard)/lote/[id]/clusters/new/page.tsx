import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import ClusterForm from "@/components/forms/ClusterForm";
import { createCluster } from "@/app/actions/cluster";
import type { Lot } from "@/lib/types";

export default async function NewClusterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lot = (await prisma.lot.findUnique({ where: { id } })) as Lot | null;
  if (!lot) notFound();

  return (
    <div>
      <PageHeader title={`Cluster i Ri — ${lot.code}`} />
      <ClusterForm action={createCluster.bind(null, id)} />
    </div>
  );
}
