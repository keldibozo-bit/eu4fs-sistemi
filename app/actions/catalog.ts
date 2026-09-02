"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { str, strOrNull, dateOrNull } from "@/lib/formHelpers";

function readCatalogItem(fd: FormData) {
  return {
    contractualId: str(fd, "contractualId"),
    lotId: str(fd, "lotId"),
    title: str(fd, "title"),
    reference: str(fd, "reference"),
    indicativeDeadline: dateOrNull(fd, "indicativeDeadline"),
    plannedExperts: strOrNull(fd, "plannedExperts"),
    notes: strOrNull(fd, "notes"),
  };
}

export async function createCatalogItem(fd: FormData) {
  await prisma.deliverableCatalogItem.create({ data: readCatalogItem(fd) });
  revalidatePath("/katalogu");
  revalidatePath("/");
  redirect("/katalogu");
}

export async function updateCatalogItem(id: string, fd: FormData) {
  await prisma.deliverableCatalogItem.update({
    where: { id },
    data: readCatalogItem(fd),
  });
  revalidatePath("/katalogu");
  revalidatePath("/");
  redirect("/katalogu");
}

export async function deleteCatalogItem(id: string) {
  await prisma.deliverableCatalogItem.delete({ where: { id } });
  revalidatePath("/katalogu");
  revalidatePath("/");
}
