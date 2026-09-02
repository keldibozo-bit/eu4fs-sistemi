import { Card, Field, inputCls } from "@/components/ui";
import { fmtDateInput } from "@/lib/format";
import {
  ISSUE_TYPES,
  ISSUE_TYPE_LABELS,
  IMPACT_LEVELS,
  IMPACT_LEVEL_LABELS,
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
} from "@/lib/enums";
import type { IssueLog, Lot } from "@/lib/types";

export default function IssueForm({
  action,
  lots,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  lots: Lot[];
  defaultValues?: IssueLog;
}) {
  return (
    <Card className="p-6 max-w-2xl">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data" required>
            <input
              type="date"
              name="date"
              required
              defaultValue={fmtDateInput(defaultValues?.date) || undefined}
              className={inputCls}
            />
          </Field>
          <Field label="Tipi" required>
            <select name="type" required defaultValue={defaultValues?.type ?? ISSUE_TYPES[0]} className={inputCls}>
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ISSUE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Loti" required>
          <select name="lotId" required defaultValue={defaultValues?.lotId ?? lots[0]?.id} className={inputCls}>
            {lots.map((l) => (
              <option key={l.id} value={l.id}>
                {l.code} — {l.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ekspertë të Përfshirë (emra, të ndarë me presje)" required>
          <input
            name="expertsInvolved"
            required
            defaultValue={defaultValues?.expertsInvolved}
            className={inputCls}
          />
        </Field>
        <Field label="Përshkrimi" required>
          <textarea name="description" required rows={3} defaultValue={defaultValues?.description} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ndikimi" required>
            <select name="impact" required defaultValue={defaultValues?.impact ?? IMPACT_LEVELS[1]} className={inputCls}>
              {IMPACT_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {IMPACT_LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Statusi" required>
            <select name="status" required defaultValue={defaultValues?.status ?? "HAPUR"} className={inputCls}>
              {ISSUE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ISSUE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Përgjegjës për Zgjidhje (opsionale)">
            <input
              name="responsibleForResolution"
              defaultValue={defaultValues?.responsibleForResolution ?? undefined}
              className={inputCls}
            />
          </Field>
          <Field label="Data e Zgjidhjes (opsionale)">
            <input
              type="date"
              name="resolutionDate"
              defaultValue={fmtDateInput(defaultValues?.resolutionDate)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Shënime / Rezultati (opsionale)">
          <textarea
            name="notesResult"
            rows={2}
            defaultValue={defaultValues?.notesResult ?? undefined}
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
