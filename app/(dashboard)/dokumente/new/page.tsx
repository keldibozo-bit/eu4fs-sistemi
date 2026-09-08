import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import DocumentForm from "@/components/forms/DocumentForm";
import { createDocument } from "@/app/actions/document";
import type { Act, Cluster, Lot, Expert } from "@/lib/types";

export default async function NewDocumentPage() {
  const [acts, experts] = await Promise.all([
    prisma.act.findMany({
      include: { cluster: { include: { lot: true } } },
      orderBy: { euReference: "asc" },
    }),
    prisma.expert.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader title="Dokument i Ri" subtitle="Ngarko një dokument të ri në bibliotekë" />
      <DocumentForm
        action={createDocument}
        acts={acts as unknown as (Act & { cluster?: Cluster & { lot?: Lot } })[]}
        experts={experts as unknown as Expert[]}
        returnTo="/dokumente"
      />
    </div>
  );
}
