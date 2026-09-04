import { Card, Field, inputCls } from "@/components/ui";
import { fmtDateInput } from "@/lib/format";
import { TRANSPOSITION_STATUSES, TRANSPOSITION_STATUS_LABELS } from "@/lib/enums";
import type { Act } from "@/lib/types";

export default function ActForm({
  action,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  defaultValues?: Act;
}) {
  return (
    <Card className="p-6 max-w-2xl">
      <form action={action} className="space-y-4">
        <Field label="Referenca BE (p.sh. Rregullorja (KE) Nr. 178/2002)" required>
          <input
            name="euReference"
            required
            defaultValue={defaultValues?.euReference}
            className={inputCls}
          />
        </Field>
        <Field label="Akti Përkatës Shqiptar" required>
          <input
            name="albanianAct"
            required
            defaultValue={defaultValues?.albanianAct}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Statusi i Përafrimit" required>
            <select
              name="status"
              required
              defaultValue={defaultValues?.status ?? TRANSPOSITION_STATUSES[0]}
              className={inputCls}
            >
              {TRANSPOSITION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {TRANSPOSITION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Afati (opsionale)">
            <input
              type="date"
              name="deadline"
              defaultValue={fmtDateInput(defaultValues?.deadline)}
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
