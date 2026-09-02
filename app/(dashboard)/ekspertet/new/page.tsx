import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import ExpertForm from "@/components/forms/ExpertForm";
import { createExpert } from "@/app/actions/expert";
import type { Lot } from "@/lib/types";

export default async function NewExpertPage() {
  const lots = (await prisma.lot.findMany({ orderBy: { code: "asc" } })) as Lot[];
  return (
    <div>
      <PageHeader title="Ekspert i Ri" />
      <ExpertForm action={createExpert} lots={lots} />
    </div>
  );
}
