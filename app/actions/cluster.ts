"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, strOrNull } from "@/lib/formHelpers";

export async function createCluster(lotId: string, fd: FormData) {
    await prisma.cluster.create({
          data: {
                  lotId,
                  name: str(fd, "name"),
          },
    });
    revalidatePath(`/lote/${lotId}/clusters`);
    revalidatePath("/");
    redirect(`/lote/${lotId}/clusters`);
}

export async function renameCluster(id: string, lotId: string, fd: FormData) {
    await prisma.cluster.update({
          where: { id },
          data: { name: str(fd, "name") },
    });
    revalidatePath(`/lote/${lotId}/clusters`);
    revalidatePath("/");
    redirect(`/lote/${lotId}/clusters`);
}

export async function updateClusterWorkPlan(id: string, lotId: string, fd: FormData) {
    await prisma.cluster.update({
          where: { id },
          data: { workPlan: strOrNull(fd, "workPlan") },
    });
    revalidatePath(`/lote/${lotId}/clusters/${id}/plan`);
    redirect(`/lote/${lotId}/clusters/${id}/plan`);
}

export async function deleteCluster(id: string, lotId: string) {
    await prisma.cluster.delete({ where: { id } });
    revalidatePath(`/lote/${lotId}/clusters`);
    revalidatePath("/");
}
