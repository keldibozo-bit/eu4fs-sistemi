import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import CatalogItemForm from "@/components/forms/CatalogItemForm";
import { updateCatalogItem } from "@/app/actions/catalog";
import type { DeliverableCatalogItem, Lot } from "@/lib/types";

export default async function EditCatalogItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, lots] = await Promise.all([
    prisma.deliverableCatalogItem.findUnique({ where: { id } }),
    prisma.lot.findMany({ orderBy: { code: "asc" } }),
  ]);
  if (!item) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho — ${item.contractualId}`} />
      <CatalogItemForm
        action={updateCatalogItem.bind(null, id)}
        lots={lots as Lot[]}
        defaultValues={item as DeliverableCatalogItem}
      />
    </div>
  );
}
