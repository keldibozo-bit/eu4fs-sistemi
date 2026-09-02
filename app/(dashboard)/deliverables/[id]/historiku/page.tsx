import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Th, Td, Field, inputCls, EmptyState, LinkButton } from "@/components/ui";
import { fmtDate } from "@/lib/format";
import { createVersionHistory } from "@/app/actions/deliverable";
import type { VersionHistory } from "@/lib/types";

export default async function DeliverableHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deliverable = await prisma.deliverable.findUnique({ where: { id } });
  if (!deliverable) notFound();

  const versions = (await prisma.versionHistory.findMany({
    where: { deliverableId: id },
    orderBy: { version: "asc" },
  })) as VersionHistory[];

  return (
    <div>
      <PageHeader
        title={`Historiku i Versioneve — ${deliverable.title}`}
        action={<LinkButton href="/deliverables" variant="secondary">← Kthehu te Lista</LinkButton>}
      />

      <Card className="overflow-x-auto mb-8">
        {versions.length === 0 ? (
          <EmptyState text="Nuk ka ende histori versionesh për këtë deliverable." />
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <Th>Versioni</Th>
                <Th>Data</Th>
                <Th>Ndryshimet e Kërkuara/Bëra</Th>
                <Th>Nga</Th>
                <Th>Statusi i Këtij Versioni</Th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">v{v.version}</Td>
                  <Td>{fmtDate(v.date)}</Td>
                  <Td>{v.changesRequestedOrMade}</Td>
                  <Td>{v.by}</Td>
                  <Td>{v.statusOfThisVersion}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <h2 className="text-base font-semibold text-slate-900 mb-3">Shto Version të Ri</h2>
      <Card className="p-6 max-w-2xl">
        <form action={createVersionHistory.bind(null, id)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Numri i Versionit" required>
              <input
                type="number"
                min={1}
                name="version"
                required
                defaultValue={deliverable.version}
                className={inputCls}
              />
            </Field>
            <Field label="Data" required>
              <input type="date" name="date" required className={inputCls} />
            </Field>
          </div>
          <Field label="Ndryshimet e Kërkuara/Bëra" required>
            <textarea name="changesRequestedOrMade" required rows={3} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nga (PM/Eksperti)" required>
              <input name="by" required className={inputCls} />
            </Field>
            <Field label="Statusi i Këtij Versioni" required>
              <input
                name="statusOfThisVersion"
                required
                placeholder="p.sh. Dërguar për Rishikim"
                className={inputCls}
              />
            </Field>
          </div>
          <button
            type="submit"
            className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
          >
            Shto
          </button>
        </form>
      </Card>
    </div>
  );
}
