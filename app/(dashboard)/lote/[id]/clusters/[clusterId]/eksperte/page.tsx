import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { EXPERT_ROLE_LABELS, type ExpertRole } from "@/lib/enums";
import { setClusterExperts } from "@/app/actions/clusterExpert";
import { groupExpertsByPool } from "@/lib/pools";
import type { Cluster, Expert } from "@/lib/types";

export default async function ClusterExpertsPage({
  params,
}: {
  params: Promise<{ id: string; clusterId: string }>;
}) {
  const { id, clusterId } = await params;
  const cluster = (await prisma.cluster.findUnique({ where: { id: clusterId } })) as Cluster | null;
  if (!cluster || cluster.lotId !== id) notFound();

  const [lotExperts, assignments] = await Promise.all([
    prisma.expert.findMany({ where: { lotId: id }, orderBy: { name: "asc" } }) as Promise<Expert[]>,
    prisma.clusterExpert.findMany({ where: { clusterId } }),
  ]);

  const assignedIds = new Set(assignments.map((a) => a.expertId));
  const groups = groupExpertsByPool(lotExperts);

  return (
    <div>
      <PageHeader
        title={`Lista e Ekspertëve — ${cluster.name}`}
        subtitle="Zgjidhni ekspertët e roster-it të këtij loti që janë të caktuar për këtë cluster"
      />
      <Card className="p-6 max-w-2xl">
        {lotExperts.length === 0 ? (
          <EmptyState text="Nuk ka ekspertë të regjistruar për këtë lot ende." />
        ) : (
          <form action={setClusterExperts.bind(null, clusterId, id)} className="space-y-6">
            <div className="space-y-5 max-h-[32rem] overflow-y-auto pr-1">
              {groups.map(({ group, experts }) => (
                <div key={group ? group.number : "pa-pool"}>
                  <div className="flex items-baseline justify-between mb-2 px-1">
                    <h3 className="text-sm font-semibold text-slate-800">
                      {group ? `Pool ${group.number} — ${group.label}` : "Të tjerë (pa pool të përcaktuar)"}
                    </h3>
                    <span className="text-xs text-slate-400 shrink-0 pl-2">{experts.length} ekspertë</span>
                  </div>
                  <div className="space-y-2 border border-slate-200 rounded p-3">
                    {experts.map((e) => (
                      <label key={e.id} className="flex items-center gap-3 py-1.5 text-sm">
                        <input
                          type="checkbox"
                          name="expertIds"
                          value={e.id}
                          defaultChecked={assignedIds.has(e.id)}
                          className="rounded border-slate-300"
                        />
                        <span className="font-medium text-slate-900">{e.name}</span>
                        <span className="text-slate-500">
                          {EXPERT_ROLE_LABELS[e.role as ExpertRole] ?? e.role} — {e.expertiseArea}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
              >
                Ruaj
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
