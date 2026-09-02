import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import DeliverableForm from "@/components/forms/DeliverableForm";
import { createDeliverable } from "@/app/actions/deliverable";
import type { Lot, Expert, DeliverableCatalogItem } from "@/lib/types";

export default async function NewDeliverablePage() {
  const [lots, experts, catalogItems] = await Promise.all([
    prisma.lot.findMany({ orderBy: { code: "asc" } }),
    prisma.expert.findMany({ orderBy: { name: "asc" } }),
    prisma.deliverableCatalogItem.findMany({ orderBy: { contractualId: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="Deliverable i Ri" />
      <DeliverableForm
        action={createDeliverable}
        lots={lots as Lot[]}
        experts={experts as Expert[]}
        catalogItems={catalogItems as DeliverableCatalogItem[]}
      />
    </div>
  );
}
