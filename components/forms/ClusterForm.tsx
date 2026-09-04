import { Card, Field, inputCls } from "@/components/ui";
import type { Cluster } from "@/lib/types";

export default function ClusterForm({
  action,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  defaultValues?: Cluster;
}) {
  return (
    <Card className="p-6 max-w-2xl">
      <form action={action} className="space-y-4">
        <Field label="Emri i Cluster-it (p.sh. Cluster 1 — Siguria Ushqimore)" required>
          <input
            name="name"
            required
            defaultValue={defaultValues?.name}
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
