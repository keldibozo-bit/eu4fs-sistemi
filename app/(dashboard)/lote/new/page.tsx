import { PageHeader } from "@/components/ui";
import LotForm from "@/components/forms/LotForm";
import { createLot } from "@/app/actions/lot";

export default function NewLotPage() {
  return (
    <div>
      <PageHeader title="Lot i Ri" />
      <LotForm action={createLot} />
    </div>
  );
}
