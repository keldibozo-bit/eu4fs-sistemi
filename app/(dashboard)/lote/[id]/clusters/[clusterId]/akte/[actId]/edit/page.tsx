import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/ui";
import ActForm from "@/components/forms/ActForm";
import DocumentForm from "@/components/forms/DocumentForm";
import DocumentList from "@/components/DocumentList";
import { updateAct } from "@/app/actions/act";
import { createDocument } from "@/app/actions/document";
import type { Cluster, Act, Document } from "@/lib/types";

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

  const documents = (await prisma.document.findMany({
    where: { actId },
    orderBy: { createdAt: "desc" },
  })) as unknown as Document[];

  const returnTo = `/lote/${id}/clusters/${clusterId}/akte/${actId}/edit`;

  return (
    <div>
      <PageHeader title={`Ndrysho Aktin — ${act.euReference}`} />
      <ActForm action={updateAct.bind(null, actId, clusterId, id)} defaultValues={act} />

      <div className="mt-8 max-w-3xl">
        <h2 className="text-base font-semibold text-slate-900 mb-3">Dokumentet e Lidhura</h2>
        <Card className="overflow-x-auto mb-4">
          <DocumentList documents={documents} returnTo={returnTo} />
        </Card>
        <DocumentForm action={createDocument} fixedActId={actId} returnTo={returnTo} />
      </div>
    </div>
  );
}
