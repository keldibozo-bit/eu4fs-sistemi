"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  str,
  strOrNull,
  intOrNull,
  intVal,
  dateOrNull,
} from "@/lib/formHelpers";
import { DeliverableType, DeliverableStatus, ConfirmimEnum } from "@prisma/client";

function readDeliverable(fd: FormData) {
  return {
    catalogItemId: strOrNull(fd, "catalogItemId"),
    lotId: str(fd, "lotId"),
    expertId: str(fd, "expertId"),
    title: str(fd, "title"),
    type: str(fd, "type") as DeliverableType,
    deadline: dateOrNull(fd, "deadline"),
    submissionDate: dateOrNull(fd, "submissionDate"),
    status: str(fd, "status") as DeliverableStatus,
    k1: intOrNull(fd, "k1"),
    k2: intOrNull(fd, "k2"),
    k3: intOrNull(fd, "k3"),
    k4: intOrNull(fd, "k4"),
    k5: intOrNull(fd, "k5"),
    k6: intOrNull(fd, "k6"),
    reviewer: strOrNull(fd, "reviewer"),
    qcComments: strOrNull(fd, "qcComments"),
    version: intVal(fd, "version") || 1,
    finalApprovalDate: dateOrNull(fd, "finalApprovalDate"),
    secondaryReviewer: strOrNull(fd, "secondaryReviewer"),
    secondaryReviewConfirmed: strOrNull(fd, "secondaryReviewConfirmed") as ConfirmimEnum | null,
  };
}

export async function createDeliverable(fd: FormData) {
  await prisma.deliverable.create({ data: readDeliverable(fd) });
  revalidatePath("/deliverables");
  revalidatePath("/");
  revalidatePath("/katalogu");
  redirect("/deliverables");
}

export async function updateDeliverable(id: string, fd: FormData) {
  await prisma.deliverable.update({ where: { id }, data: readDeliverable(fd) });
  revalidatePath("/deliverables");
  revalidatePath("/");
  revalidatePath("/katalogu");
  redirect("/deliverables");
}

export async function deleteDeliverable(id: string) {
  await prisma.deliverable.delete({ where: { id } });
  revalidatePath("/deliverables");
  revalidatePath("/");
  revalidatePath("/katalogu");
}

export async function createVersionHistory(deliverableId: string, fd: FormData) {
  await prisma.versionHistory.create({
    data: {
      deliverableId,
      version: intVal(fd, "version"),
      date: fd.get("date") ? new Date(str(fd, "date")) : new Date(),
      changesRequestedOrMade: str(fd, "changesRequestedOrMade"),
      by: str(fd, "by"),
      statusOfThisVersion: str(fd, "statusOfThisVersion"),
    },
  });
  revalidatePath(`/deliverables/${deliverableId}/historiku`);
}
