import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import CatalogItemForm from "@/components/forms/CatalogItemForm";
import { createCatalogItem } from "@/app/actions/catalog";
import type { Lot } from "@/lib/types";

export default async function NewCatalogItemPage() {
  const lots = (await prisma.lot.findMany({ orderBy: { code: "asc" } })) as Lot[];
  return (
    <div>
      <PageHeader title="Element i Ri në Katalog" />
      <CatalogItemForm action={createCatalogItem} lots={lots} />
    </div>
  );
}
