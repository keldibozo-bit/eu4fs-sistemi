import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import LotForm from "@/components/forms/LotForm";
import { updateLot } from "@/app/actions/lot";
import type { Lot } from "@/lib/types";

export default async function EditLotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lot = await prisma.lot.findUnique({ where: { id } });
  if (!lot) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho Lotin — ${lot.code}`} />
      <LotForm action={updateLot.bind(null, id)} defaultValues={lot as Lot} />
    </div>
  );
}
