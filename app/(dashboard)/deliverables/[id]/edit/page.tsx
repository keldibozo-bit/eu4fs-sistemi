import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import DeliverableForm from "@/components/forms/DeliverableForm";
import { updateDeliverable } from "@/app/actions/deliverable";
import type { Deliverable, Lot, Expert, DeliverableCatalogItem } from "@/lib/types";

export default async function EditDeliverablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [deliverable, lots, experts, catalogItems] = await Promise.all([
    prisma.deliverable.findUnique({ where: { id } }),
    prisma.lot.findMany({ orderBy: { code: "asc" } }),
    prisma.expert.findMany({ orderBy: { name: "asc" } }),
    prisma.deliverableCatalogItem.findMany({ orderBy: { contractualId: "asc" } }),
  ]);
  if (!deliverable) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho — ${deliverable.title}`} />
      <DeliverableForm
        action={updateDeliverable.bind(null, id)}
        lots={lots as Lot[]}
        experts={experts as Expert[]}
        catalogItems={catalogItems as DeliverableCatalogItem[]}
        defaultValues={deliverable as Deliverable}
      />
    </div>
  );
}
