import { Card, Field, inputCls } from "@/components/ui";
import type { Lot } from "@/lib/types";

export default function LotForm({
  action,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  defaultValues?: Lot;
}) {
  return (
    <Card className="p-6 max-w-2xl">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kodi (p.sh. LOT1)" required>
            <input
              name="code"
              required
              defaultValue={defaultValues?.code}
              className={inputCls}
            />
          </Field>
          <Field label="Emri" required>
            <input
              name="name"
              required
              defaultValue={defaultValues?.name}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Fokusi" required>
          <input
            name="focus"
            required
            defaultValue={defaultValues?.focus}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Ditë Buxhet / Ekspert" required>
            <input
              type="number"
              min={0}
              name="budgetDaysExpert"
              required
              defaultValue={defaultValues?.budgetDaysExpert}
              className={inputCls}
            />
          </Field>
          <Field label="Buxheti (€, opsionale)">
            <input
              type="number"
              step="0.01"
              min={0}
              name="budgetEUR"
              defaultValue={defaultValues?.budgetEUR ?? undefined}
              className={inputCls}
            />
          </Field>
          <Field label="Nr. Max Ekspertësh (opsionale)">
            <input
              type="number"
              min={0}
              name="maxExperts"
              defaultValue={defaultValues?.maxExperts ?? undefined}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="PM Përgjegjës" required>
          <input
            name="pmResponsible"
            required
            defaultValue={defaultValues?.pmResponsible}
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
