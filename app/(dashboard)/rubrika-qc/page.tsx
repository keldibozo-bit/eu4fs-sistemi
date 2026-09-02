import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Th, Td } from "@/components/ui";
import { QC_TYPE_LABELS, type QcType } from "@/lib/enums";
import type { QcCriterion } from "@/lib/types";

function RubricTable({ rows, title }: { rows: QcCriterion[]; title: string }) {
  const totalWeight = rows.reduce((s, r) => s + r.weightPercent, 0);
  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-slate-900 mb-3">{title}</h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <Th>Kodi</Th>
              <Th>Kriteri</Th>
              <Th>Përshkrimi</Th>
              <Th>Pesha</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <Td className="font-medium text-slate-900 align-top">{c.code}</Td>
                <Td className="align-top font-medium">{c.title}</Td>
                <Td className="align-top text-slate-600">{c.description}</Td>
                <Td className="align-top">{c.weightPercent}%</Td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-semibold">
              <Td colSpan={3}>Totali</Td>
              <Td>{totalWeight}%</Td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default async function RubrikaQcPage() {
  const criteria = (await prisma.qcCriterion.findMany({
    orderBy: [{ type: "asc" }, { code: "asc" }],
  })) as QcCriterion[];
  const ligjor = criteria.filter((c) => c.type === "LIGJOR");
  const teknik = criteria.filter((c) => c.type === "TEKNIK");

  return (
    <div>
      <PageHeader
        title="Rubrika QC"
        subtitle="Kriteret e vlerësimit të cilësisë për deliverables ligjore dhe teknike (referencë, jo e ndryshueshme)"
      />
      <RubricTable rows={ligjor} title={`Rubrika ${QC_TYPE_LABELS["LIGJOR" as QcType]}`} />
      <RubricTable rows={teknik} title={`Rubrika ${QC_TYPE_LABELS["TEKNIK" as QcType]}`} />
    </div>
  );
}
