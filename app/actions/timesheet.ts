"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, strOrNull, floatVal, dateVal } from "@/lib/formHelpers";

function readTimesheet(fd: FormData) {
  return {
    date: dateVal(fd, "date"),
    expertId: str(fd, "expertId"),
    daysWorked: floatVal(fd, "daysWorked"),
    activityDescription: str(fd, "activityDescription"),
    linkedDeliverableId: strOrNull(fd, "linkedDeliverableId"),
    submittedBy: strOrNull(fd, "submittedBy"),
    notes: strOrNull(fd, "notes"),
  };
}

export async function createTimesheet(fd: FormData) {
  await prisma.timesheet.create({ data: readTimesheet(fd) });
  revalidatePath("/ore-pune");
  revalidatePath("/");
  revalidatePath("/ekspertet");
  redirect("/ore-pune");
}

export async function deleteTimesheet(id: string) {
  await prisma.timesheet.delete({ where: { id } });
  revalidatePath("/ore-pune");
  revalidatePath("/");
  revalidatePath("/ekspertet");
}
