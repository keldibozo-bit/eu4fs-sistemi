"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, intVal, floatOrNull, intOrNull } from "@/lib/formHelpers";

function readLot(fd: FormData) {
  return {
    code: str(fd, "code"),
    name: str(fd, "name"),
    focus: str(fd, "focus"),
    budgetDaysExpert: intVal(fd, "budgetDaysExpert"),
    budgetEUR: floatOrNull(fd, "budgetEUR"),
    maxExperts: intOrNull(fd, "maxExperts"),
    pmResponsible: str(fd, "pmResponsible"),
  };
}

export async function createLot(fd: FormData) {
  await prisma.lot.create({ data: readLot(fd) });
  revalidatePath("/lote");
  revalidatePath("/");
  redirect("/lote");
}

export async function updateLot(id: string, fd: FormData) {
  await prisma.lot.update({ where: { id }, data: readLot(fd) });
  revalidatePath("/lote");
  revalidatePath("/");
  redirect("/lote");
}

export async function deleteLot(id: string) {
  await prisma.lot.delete({ where: { id } });
  revalidatePath("/lote");
  revalidatePath("/");
}
