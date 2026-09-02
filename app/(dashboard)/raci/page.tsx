import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Th, Td, Field, inputCls, EmptyState } from "@/components/ui";
import { createRaci, updateRaci, deleteRaci } from "@/app/actions/raci";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import type { RaciEntry } from "@/lib/types";

export default async function RaciPage() {
  const rows = (await prisma.raciEntry.findMany()) as RaciEntry[];

  return (
    <div>
      <PageHeader
        title="RACI & Rolet"
        subtitle="Kush është Responsible / Accountable / Consulted / Informed për çdo aktivitet kryesor"
      />

      <Card className="overflow-x-auto mb-8">
        {rows.length === 0 ? (
          <EmptyState text="Nuk ka rreshta RACI ende." />
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <Th>Aktiviteti</Th>
                <Th>R (Përgjegjës)</Th>
                <Th>A (Llogaridhënës)</Th>
                <Th>C (I Konsultuar)</Th>
                <Th>I (I Informuar)</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">{r.activity}</Td>
                    <Td>{r.responsible}</Td>
                    <Td>{r.accountable}</Td>
                    <Td>{r.consulted}</Td>
                    <Td>{r.informed}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">
                          ndrysho poshtë ↓
                        </span>
                        <form action={deleteRaci.bind(null, r.id)}>
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

      {rows.length > 0 && (
        <div className="space-y-3 mb-8">
          {rows.map((r) => (
            <details key={r.id} className="bg-white rounded-lg border border-slate-200">
              <summary className="cursor-pointer text-sm font-medium text-slate-700 px-4 py-2.5">
                Ndrysho: {r.activity}
              </summary>
              <div className="p-4 border-t border-slate-100">
                <form action={updateRaci.bind(null, r.id)} className="space-y-3">
                  <Field label="Aktiviteti" required>
                    <input name="activity" required defaultValue={r.activity} className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="R (Përgjegjës)" required>
                      <input name="responsible" required defaultValue={r.responsible} className={inputCls} />
                    </Field>
                    <Field label="A (Llogaridhënës)" required>
                      <input name="accountable" required defaultValue={r.accountable} className={inputCls} />
                    </Field>
                    <Field label="C (I Konsultuar)" required>
                      <input name="consulted" required defaultValue={r.consulted} className={inputCls} />
                    </Field>
                    <Field label="I (I Informuar)" required>
                      <input name="informed" required defaultValue={r.informed} className={inputCls} />
                    </Field>
                  </div>
                  <button
                    type="submit"
                    className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2 hover:bg-slate-800"
                  >
                    Ruaj
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}

      <h2 className="text-base font-semibold text-slate-900 mb-3">Aktivitet i Ri RACI</h2>
      <Card className="p-6 max-w-3xl">
        <form action={createRaci} className="space-y-3">
          <Field label="Aktiviteti" required>
            <input name="activity" required className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="R (Përgjegjës)" required>
              <input name="responsible" required className={inputCls} />
            </Field>
            <Field label="A (Llogaridhënës)" required>
              <input name="accountable" required className={inputCls} />
            </Field>
            <Field label="C (I Konsultuar)" required>
              <input name="consulted" required className={inputCls} />
            </Field>
            <Field label="I (I Informuar)" required>
              <input name="informed" required className={inputCls} />
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
