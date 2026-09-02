import { Card, Field, inputCls } from "@/components/ui";
import { fmtDateInput } from "@/lib/format";
import type { DeliverableCatalogItem, Lot } from "@/lib/types";

export default function CatalogItemForm({
  action,
  lots,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  lots: Lot[];
  defaultValues?: DeliverableCatalogItem;
}) {
  return (
    <Card className="p-6 max-w-2xl">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID Kontraktual (p.sh. C001)" required>
            <input
              name="contractualId"
              required
              defaultValue={defaultValues?.contractualId}
              className={inputCls}
            />
          </Field>
          <Field label="Loti" required>
            <select name="lotId" required defaultValue={defaultValues?.lotId ?? lots[0]?.id} className={inputCls}>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code} — {l.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Titulli" required>
          <input name="title" required defaultValue={defaultValues?.title} className={inputCls} />
        </Field>
        <Field label="Referenca" required>
          <input
            name="reference"
            required
            defaultValue={defaultValues?.reference}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Afati Indikativ (opsionale)">
            <input
              type="date"
              name="indicativeDeadline"
              defaultValue={fmtDateInput(defaultValues?.indicativeDeadline)}
              className={inputCls}
            />
          </Field>
          <Field label="Ekspertë të Planifikuar (opsionale)">
            <input
              name="plannedExperts"
              defaultValue={defaultValues?.plannedExperts ?? undefined}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Shënime (opsionale)">
          <textarea
            name="notes"
            rows={3}
            defaultValue={defaultValues?.notes ?? undefined}
            className={inputCls}
          />
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
  );
}
