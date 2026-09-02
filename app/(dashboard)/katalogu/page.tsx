import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, Badge, EmptyState } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import { buildCatalogCoverage } from "@/lib/aggregate";
import { CATALOG_COVERAGE_LABELS } from "@/lib/compute";
import { deleteCatalogItem } from "@/app/actions/catalog";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { DeliverableCatalogItem, Deliverable, Lot } from "@/lib/types";

const COVERAGE_COLOR: Record<string, "green" | "yellow" | "gray"> = {
  NUK_KA_FILLUAR: "gray",
  NE_PROCES: "yellow",
  APROVUAR: "green",
};

export default async function KatalogPage() {
  const [items, lots, deliverables] = await Promise.all([
    prisma.deliverableCatalogItem.findMany({ orderBy: { contractualId: "asc" } }) as Promise<
      DeliverableCatalogItem[]
    >,
    prisma.lot.findMany() as Promise<Lot[]>,
    prisma.deliverable.findMany() as Promise<Deliverable[]>,
  ]);

  const lotById = new Map(lots.map((l) => [l.id, l] as const));
  const coverage = buildCatalogCoverage(items, deliverables);
  const coverageById = new Map(coverage.map((c) => [c.item.id, c] as const));

  return (
    <div>
      <PageHeader
        title="Katalogu i Deliverables"
        subtitle="Lista kontraktuale e deliverables sipas ToR-it 7000016213"
        action={<LinkButton href="/katalogu/new">+ Element i Ri</LinkButton>}
      />
      <Card className="overflow-x-auto">
        {items.length === 0 ? (
          <EmptyState text="Nuk ka elementë në katalog ende." />
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr>
                <Th>ID Kontraktual</Th>
                <Th>Titulli</Th>
                <Th>Loti</Th>
                <Th>Referenca</Th>
                <Th>Afati Indikativ</Th>
                <Th>Ekspertë të Planifikuar</Th>
                <Th>Deliverables të Lidhura</Th>
                <Th>Mbulimi</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const cov = coverageById.get(item.id);
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">{item.contractualId}</Td>
                    <Td>{item.title}</Td>
                    <Td>{lotById.get(item.lotId)?.code}</Td>
                    <Td className="text-slate-500">{item.reference}</Td>
                    <Td>{fmtDate(item.indicativeDeadline)}</Td>
                    <Td>{item.plannedExperts ?? "—"}</Td>
                    <Td>{cov?.linkedCount ?? 0}</Td>
                    <Td>
                      <Badge color={COVERAGE_COLOR[cov?.coverage ?? "NUK_KA_FILLUAR"]}>
                        {CATALOG_COVERAGE_LABELS[cov?.coverage ?? "NUK_KA_FILLUAR"]}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/katalogu/${item.id}/edit`}
                          className="text-slate-700 hover:underline text-sm"
                        >
                          Ndrysho
                        </Link>
                        <form action={deleteCatalogItem.bind(null, item.id)}>
                          <DeleteSubmitButton />
                        </form>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
