"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, strOrNull, floatVal, floatOrNull, dateVal, dateOrNull } from "@/lib/formHelpers";

function readExpert(fd: FormData) {
  return {
    name: str(fd, "name"),
    role: str(fd, "role"),
    lotId: str(fd, "lotId"),
    expertiseArea: str(fd, "expertiseArea"),
    contractedDays: floatVal(fd, "contractedDays"),
    dailyRateEUR: floatOrNull(fd, "dailyRateEUR"),
    startDate: dateVal(fd, "startDate"),
    endDate: dateOrNull(fd, "endDate"),
    email: str(fd, "email"),
    phone: strOrNull(fd, "phone"),
    status: str(fd, "status"),
    pmNotes: strOrNull(fd, "pmNotes"),
  };
}

export async function createExpert(fd: FormData) {
  await prisma.expert.create({ data: readExpert(fd) });
  revalidatePath("/ekspertet");
  revalidatePath("/");
  redirect("/ekspertet");
}

export async function updateExpert(id: string, fd: FormData) {
  await prisma.expert.update({ where: { id }, data: readExpert(fd) });
  revalidatePath("/ekspertet");
  revalidatePath("/");
  redirect("/ekspertet");
}

export async function deleteExpert(id: string) {
  await prisma.expert.delete({ where: { id } });
  revalidatePath("/ekspertet");
  revalidatePath("/");
}
