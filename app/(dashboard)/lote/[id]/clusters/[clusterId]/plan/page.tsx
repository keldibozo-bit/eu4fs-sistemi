import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, inputCls } from "@/components/ui";
import { updateClusterWorkPlan } from "@/app/actions/cluster";
import type { Cluster } from "@/lib/types";

export default async function ClusterPlanPage({
  params,
}: {
  params: Promise<{ id: string; clusterId: string }>;
}) {
  const { id, clusterId } = await params;
  const cluster = (await prisma.cluster.findUnique({ where: { id: clusterId } })) as Cluster | null;
  if (!cluster || cluster.lotId !== id) notFound();

  return (
    <div>
      <PageHeader title={`Plani i Punës — ${cluster.name}`} />
      <Card className="p-6 max-w-3xl">
        <form action={updateClusterWorkPlan.bind(null, clusterId, id)} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">
              Plani i Punës
            </span>
            <textarea
              name="workPlan"
              rows={14}
              defaultValue={cluster.workPlan ?? undefined}
              placeholder="Përshkruani planin e punës për këtë cluster: aktivitetet, afatet, hapat kryesorë..."
              className={inputCls}
            />
          </label>
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
