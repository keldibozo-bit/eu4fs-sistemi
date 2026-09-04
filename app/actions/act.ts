"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, strOrNull, dateOrNull } from "@/lib/formHelpers";
import { TranspositionStatus } from "@prisma/client";

export async function createAct(clusterId: string, lotId: string, fd: FormData) {
    await prisma.act.create({
          data: {
                  clusterId,
                  euReference: str(fd, "euReference"),
                  albanianAct: str(fd, "albanianAct"),
                  status: str(fd, "status") as TranspositionStatus,
                  deadline: dateOrNull(fd, "deadline"),
                  notes: strOrNull(fd, "notes"),
          },
    });
    revalidatePath(`/lote/${lotId}/clusters/${clusterId}/akte`);
    redirect(`/lote/${lotId}/clusters/${clusterId}/akte`);
}

export async function updateAct(id: string, clusterId: string, lotId: string, fd: FormData) {
    await prisma.act.update({
          where: { id },
          data: {
                  euReference: str(fd, "euReference"),
                  albanianAct: str(fd, "albanianAct"),
                  status: str(fd, "status") as TranspositionStatus,
                  deadline: dateOrNull(fd, "deadline"),
                  notes: strOrNull(fd, "notes"),
          },
    });
    revalidatePath(`/lote/${lotId}/clusters/${clusterId}/akte`);
    redirect(`/lote/${lotId}/clusters/${clusterId}/akte`);
}

export async function deleteAct(id: string, clusterId: string, lotId: string) {
    await prisma.act.delete({ where: { id } });
    revalidatePath(`/lote/${lotId}/clusters/${clusterId}/akte`);
}
