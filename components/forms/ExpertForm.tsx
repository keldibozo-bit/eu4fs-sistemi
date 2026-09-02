import { Card, Field, inputCls } from "@/components/ui";
import { EXPERT_ROLES, EXPERT_ROLE_LABELS, EXPERT_STATUSES, EXPERT_STATUS_LABELS } from "@/lib/enums";
import { fmtDateInput } from "@/lib/format";
import type { Expert, Lot } from "@/lib/types";

export default function ExpertForm({
  action,
  lots,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  lots: Lot[];
  defaultValues?: Expert;
}) {
  return (
    <Card className="p-6 max-w-3xl">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Emri" required>
            <input name="name" required defaultValue={defaultValues?.name} className={inputCls} />
          </Field>
          <Field label="Roli" required>
            <select name="role" required defaultValue={defaultValues?.role ?? EXPERT_ROLES[0]} className={inputCls}>
              {EXPERT_ROLES.map((r) => (
                <option key={r} value={r}>
                  {EXPERT_ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Loti" required>
            <select name="lotId" required defaultValue={defaultValues?.lotId ?? lots[0]?.id} className={inputCls}>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code} — {l.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fusha e Ekspertizës" required>
            <input
              name="expertiseArea"
              required
              defaultValue={defaultValues?.expertiseArea}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ditë Kontraktuara" required>
            <input
              type="number"
              step="0.5"
              min={0}
              name="contractedDays"
              required
              defaultValue={defaultValues?.contractedDays}
              className={inputCls}
            />
          </Field>
          <Field label="Tarifa (€/ditë, opsionale)">
            <input
              type="number"
              step="0.01"
              min={0}
              name="dailyRateEUR"
              defaultValue={defaultValues?.dailyRateEUR ?? undefined}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data e Fillimit" required>
            <input
              type="date"
              name="startDate"
              required
              defaultValue={fmtDateInput(defaultValues?.startDate)}
              className={inputCls}
            />
          </Field>
          <Field label="Data e Mbarimit (opsionale)">
            <input
              type="date"
              name="endDate"
              defaultValue={fmtDateInput(defaultValues?.endDate)}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" required>
            <input type="email" name="email" required defaultValue={defaultValues?.email} className={inputCls} />
          </Field>
          <Field label="Telefoni (opsionale)">
            <input name="phone" defaultValue={defaultValues?.phone ?? undefined} className={inputCls} />
          </Field>
        </div>
        <Field label="Statusi" required>
          <select name="status" required defaultValue={defaultValues?.status ?? "AKTIV"} className={inputCls}>
            {EXPERT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {EXPERT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Shënime PM (opsionale)">
          <textarea
            name="pmNotes"
            rows={3}
            defaultValue={defaultValues?.pmNotes ?? undefined}
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
