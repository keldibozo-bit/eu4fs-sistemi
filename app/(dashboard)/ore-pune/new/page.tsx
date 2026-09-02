import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Field, inputCls } from "@/components/ui";
import { createTimesheet } from "@/app/actions/timesheet";
import type { Expert, Deliverable } from "@/lib/types";

export default async function NewTimesheetPage() {
  const [experts, deliverables] = await Promise.all([
    prisma.expert.findMany({ orderBy: { name: "asc" } }) as Promise<Expert[]>,
    prisma.deliverable.findMany({ orderBy: { title: "asc" } }) as Promise<Deliverable[]>,
  ]);

  return (
    <div>
      <PageHeader title="Regjistro Ditë Pune" />
      <Card className="p-6 max-w-2xl">
        <form action={createTimesheet} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Data" required>
              <input type="date" name="date" required className={inputCls} />
            </Field>
            <Field label="Ditë të Punuara" required>
              <input type="number" step="0.5" min={0} name="daysWorked" required className={inputCls} />
            </Field>
          </div>
          <Field label="Eksperti" required>
            <select name="expertId" required defaultValue={experts[0]?.id} className={inputCls}>
              {experts.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Përshkrimi i Aktivitetit" required>
            <textarea name="activityDescription" required rows={3} className={inputCls} />
          </Field>
          <Field label="Deliverable i Lidhur (opsionale)">
            <select name="linkedDeliverableId" defaultValue="" className={inputCls}>
              <option value="">— asnjë —</option>
              {deliverables.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Regjistruar Nga (opsionale)">
            <input name="submittedBy" className={inputCls} />
          </Field>
          <Field label="Shënime (opsionale)">
            <textarea name="notes" rows={2} className={inputCls} />
          </Field>
          <div className="pt-2">
            <button
              type="submit"
              className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
            >
              Ruaj
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
