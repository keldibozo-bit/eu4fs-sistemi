"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { str } from "@/lib/formHelpers";

function readRaci(fd: FormData) {
  return {
    activity: str(fd, "activity"),
    responsible: str(fd, "responsible"),
    accountable: str(fd, "accountable"),
    consulted: str(fd, "consulted"),
    informed: str(fd, "informed"),
  };
}

export async function createRaci(fd: FormData) {
  await prisma.raciEntry.create({ data: readRaci(fd) });
  revalidatePath("/raci");
}

export async function updateRaci(id: string, fd: FormData) {
  await prisma.raciEntry.update({ where: { id }, data: readRaci(fd) });
  revalidatePath("/raci");
}

export async function deleteRaci(id: string) {
  await prisma.raciEntry.delete({ where: { id } });
  revalidatePath("/raci");
}
