"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { str, strOrNull } from "@/lib/formHelpers";
import { DocumentCategory } from "@prisma/client";

export async function createDocument(fd: FormData) {
  const file = fd.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Ju lutem zgjidhni një skedar për t'u ngarkuar.");
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  const actId = strOrNull(fd, "actId");
  const expertId = strOrNull(fd, "expertId");
  const returnTo = strOrNull(fd, "returnTo");

  await prisma.document.create({
    data: {
      title: str(fd, "title") || file.name,
      description: strOrNull(fd, "description"),
      category: str(fd, "category") as DocumentCategory,
      fileUrl: blob.url,
      fileName: file.name,
      fileType: file.type || null,
      fileSize: file.size,
      version: strOrNull(fd, "version"),
      uploadedBy: strOrNull(fd, "uploadedBy"),
      actId,
      expertId,
    },
  });

  revalidatePath("/dokumente");
  revalidatePath("/");
  if (returnTo) revalidatePath(returnTo);
  redirect(returnTo || "/dokumente");
}

export async function deleteDocument(id: string, returnTo?: string) {
  const doc = await prisma.document.findUnique({ where: { id } });
  if (doc) {
    try {
      await del(doc.fileUrl);
    } catch {
      // injoro nëse skedari nuk ekziston më te storage-i (p.sh. fshirë tashmë)
    }
    await prisma.document.delete({ where: { id } });
  }
  revalidatePath("/dokumente");
  revalidatePath("/");
  if (returnTo) revalidatePath(returnTo);
}
