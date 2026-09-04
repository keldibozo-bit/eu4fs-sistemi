import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import ActForm from "@/components/forms/ActForm";
import { createAct } from "@/app/actions/act";
import type { Cluster } from "@/lib/types";

export default async function NewActPage({
  params,
}: {
  params: Promise<{ id: string; clusterId: string }>;
}) {
  const { id, clusterId } = await params;
  const cluster = (await prisma.cluster.findUnique({ where: { id: clusterId } })) as Cluster | null;
  if (!cluster || cluster.lotId !== id) notFound();

  return (
    <div>
      <PageHeader title={`Akt i Ri — ${cluster.name}`} />
      <ActForm action={createAct.bind(null, clusterId, id)} />
    </div>
  );
}
