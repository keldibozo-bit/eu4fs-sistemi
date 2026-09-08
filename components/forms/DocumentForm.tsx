import { Card, Field, inputCls } from "@/components/ui";
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from "@/lib/enums";
import type { Act, Cluster, Expert, Lot } from "@/lib/types";

type ActWithLabels = Act & { cluster?: Cluster & { lot?: Lot } };

export default function DocumentForm({
  action,
  acts,
  experts,
  fixedActId,
  fixedExpertId,
  returnTo,
}: {
  action: (fd: FormData) => void;
  acts?: ActWithLabels[];
  experts?: Expert[];
  fixedActId?: string;
  fixedExpertId?: string;
  returnTo?: string;
}) {
  return (
    <Card className="p-6 max-w-2xl">
      <form action={action} className="space-y-4">
        {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
        {fixedActId && <input type="hidden" name="actId" value={fixedActId} />}
        {fixedExpertId && <input type="hidden" name="expertId" value={fixedExpertId} />}

        <Field label="Skedari" required>
          <input type="file" name="file" required className={inputCls} />
        </Field>

        <Field label="Titulli (opsionale — përdoret emri i skedarit nëse lihet bosh)">
          <input name="title" className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategoria" required>
            <select name="category" required defaultValue={DOCUMENT_CATEGORIES[0]} className={inputCls}>
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {DOCUMENT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Versioni (opsionale)">
            <input name="version" placeholder="p.sh. v2, draft-1" className={inputCls} />
          </Field>
        </div>

        {!fixedActId && acts && (
          <Field label="Lidh me Akt (opsionale)">
            <select name="actId" defaultValue="" className={inputCls}>
              <option value="">— Pa lidhje —</option>
              {acts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.cluster?.lot?.code ? `${a.cluster.lot.code} — ` : ""}
                  {a.cluster?.name ? `${a.cluster.name} — ` : ""}
                  {a.euReference}
                </option>
              ))}
            </select>
          </Field>
        )}

        {!fixedExpertId && experts && (
          <Field label="Lidh me Ekspert (opsionale)">
            <select name="expertId" defaultValue="" className={inputCls}>
              <option value="">— Pa lidhje —</option>
              {experts.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Përshkrimi (opsionale)">
          <textarea name="description" rows={2} className={inputCls} />
        </Field>

        <Field label="Ngarkuar nga (opsionale)">
          <input name="uploadedBy" className={inputCls} />
        </Field>

        <div className="pt-2">
          <button
            type="submit"
            className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
          >
            Ngarko
          </button>
        </div>
      </form>
    </Card>
  );
}
