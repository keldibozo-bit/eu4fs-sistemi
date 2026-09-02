"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, strOrNull, dateVal, dateOrNull } from "@/lib/formHelpers";

function readIssue(fd: FormData) {
  return {
    date: dateVal(fd, "date"),
    type: str(fd, "type"),
    lotId: str(fd, "lotId"),
    expertsInvolved: str(fd, "expertsInvolved"),
    description: str(fd, "description"),
    impact: str(fd, "impact"),
    status: str(fd, "status"),
    responsibleForResolution: strOrNull(fd, "responsibleForResolution"),
    resolutionDate: dateOrNull(fd, "resolutionDate"),
    notesResult: strOrNull(fd, "notesResult"),
  };
}

export async function createIssue(fd: FormData) {
  await prisma.issueLog.create({ data: readIssue(fd) });
  revalidatePath("/problematika");
  redirect("/problematika");
}

export async function updateIssue(id: string, fd: FormData) {
  await prisma.issueLog.update({ where: { id }, data: readIssue(fd) });
  revalidatePath("/problematika");
  redirect("/problematika");
}

export async function deleteIssue(id: string) {
  await prisma.issueLog.delete({ where: { id } });
  revalidatePath("/problematika");
}
