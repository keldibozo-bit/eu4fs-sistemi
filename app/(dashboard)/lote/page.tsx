import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, EmptyState } from "@/components/ui";
import { fmtEUR } from "@/lib/format";
import { deleteLot } from "@/app/actions/lot";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { Lot } from "@/lib/types";

export default async function LotePage() {
  const lots = (await prisma.lot.findMany({ orderBy: { code: "asc" } })) as Lot[];

  return (
    <div>
      <PageHeader
        title="Lotet"
        subtitle="Konfigurimi i loteve të projektit (buxheti në ditë ekspert, PM përgjegjës)"
        action={<LinkButton href="/lote/new">+ Lot i Ri</LinkButton>}
      />
      <Card className="overflow-x-auto">
        {lots.length === 0 ? (
          <EmptyState text="Nuk ka lote të regjistruara ende." />
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <Th>Kodi</Th>
                <Th>Emri</Th>
                <Th>Fokusi</Th>
                <Th>Ditë Buxhet/Ekspert</Th>
                <Th>Buxheti €</Th>
                <Th>Nr. Max Ekspertësh</Th>
                <Th>PM Përgjegjës</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{lot.code}</Td>
                  <Td>{lot.name}</Td>
                  <Td>{lot.focus}</Td>
                  <Td>{lot.budgetDaysExpert}</Td>
                  <Td>{fmtEUR(lot.budgetEUR)}</Td>
                  <Td>{lot.maxExperts ?? "—"}</Td>
                  <Td>{lot.pmResponsible}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/lote/${lot.id}/edit`}
                        className="text-slate-700 hover:underline text-sm"
                      >
                        Ndrysho
                      </Link>
                      <form action={deleteLot.bind(null, lot.id)}>
                        <DeleteSubmitButton />
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
