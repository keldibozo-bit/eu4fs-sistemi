import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/ui";
import ExpertForm from "@/components/forms/ExpertForm";
import DocumentForm from "@/components/forms/DocumentForm";
import DocumentList from "@/components/DocumentList";
import { updateExpert } from "@/app/actions/expert";
import { createDocument } from "@/app/actions/document";
import type { Expert, Lot, Document } from "@/lib/types";

export default async function EditExpertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [expert, lots, documents] = await Promise.all([
    prisma.expert.findUnique({ where: { id } }),
    prisma.lot.findMany({ orderBy: { code: "asc" } }),
    prisma.document.findMany({ where: { expertId: id }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!expert) notFound();

  const returnTo = `/ekspertet/${id}/edit`;

  return (
    <div>
      <PageHeader title={`Ndrysho Ekspertin — ${expert.name}`} />
      <ExpertForm action={updateExpert.bind(null, id)} lots={lots as Lot[]} defaultValues={expert as Expert} />

      <div className="mt-8 max-w-3xl">
        <h2 className="text-base font-semibold text-slate-900 mb-3">Dokumentet e Lidhura</h2>
        <Card className="overflow-x-auto mb-4">
          <DocumentList documents={documents as unknown as Document[]} returnTo={returnTo} />
        </Card>
        <DocumentForm action={createDocument} fixedExpertId={id} returnTo={returnTo} />
      </div>
    </div>
  );
}
