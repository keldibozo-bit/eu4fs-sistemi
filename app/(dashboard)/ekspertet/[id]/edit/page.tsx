import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import ExpertForm from "@/components/forms/ExpertForm";
import { updateExpert } from "@/app/actions/expert";
import type { Expert, Lot } from "@/lib/types";

export default async function EditExpertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [expert, lots] = await Promise.all([
    prisma.expert.findUnique({ where: { id } }),
    prisma.lot.findMany({ orderBy: { code: "asc" } }),
  ]);
  if (!expert) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho Ekspertin — ${expert.name}`} />
      <ExpertForm action={updateExpert.bind(null, id)} lots={lots as Lot[]} defaultValues={expert as Expert} />
    </div>
  );
}
