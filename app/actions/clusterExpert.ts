"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setClusterExperts(clusterId: string, lotId: string, fd: FormData) {
    const expertIds = fd.getAll("expertIds").map((v) => String(v));

  await prisma.$transaction([
        prisma.clusterExpert.deleteMany({ where: { clusterId } }),
        ...(expertIds.length > 0
                  ? [
                              prisma.clusterExpert.createMany({
                                            data: expertIds.map((expertId) => ({ clusterId, expertId })),
                              }),
                            ]
                  : []),
      ]);

  revalidatePath(`/lote/${lotId}/clusters/${clusterId}/eksperte`);
    redirect(`/lote/${lotId}/clusters/${clusterId}/eksperte`);
}
