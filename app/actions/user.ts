"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { str } from "@/lib/formHelpers";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    redirect("/");
  }
  return session!;
}

export async function changeOwnPassword(fd: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const currentPassword = str(fd, "currentPassword");
  const newPassword = str(fd, "newPassword");
  const confirmPassword = str(fd, "confirmPassword");

  const userId = (session.user as { id?: string }).id;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  if (!user) redirect("/login");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    redirect("/profili?gabim=fjalekalim_gabim");
  }
  if (newPassword.length < 6) {
    redirect("/profili?gabim=fjalekalim_shkurter");
  }
  if (newPassword !== confirmPassword) {
    redirect("/profili?gabim=mospershtatje");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  revalidatePath("/profili");
  redirect("/profili?sukses=1");
}

function readUser(fd: FormData) {
  return {
    name: str(fd, "name"),
    email: str(fd, "email").toLowerCase(),
    role: str(fd, "role") || "PM",
  };
}

export async function createUser(fd: FormData) {
  await requireAdmin();

  const data = readUser(fd);
  const password = str(fd, "password");
  if (!data.email || !data.name || password.length < 6) {
    redirect("/admin/perdoruesit/new?gabim=1");
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    redirect("/admin/perdoruesit/new?gabim=ekziston");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { ...data, passwordHash } });
  revalidatePath("/admin/perdoruesit");
  redirect("/admin/perdoruesit");
}

export async function updateUser(id: string, fd: FormData) {
  const session = await requireAdmin();
  const currentUserId = (session.user as { id?: string }).id;

  const data = readUser(fd);
  const newPassword = str(fd, "newPassword");

  if (currentUserId === id && data.role !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      redirect(`/admin/perdoruesit/${id}/edit?gabim=admin_i_fundit`);
    }
  }

  const updateData: { name: string; email: string; role: string; passwordHash?: string } = data;
  if (newPassword) {
    if (newPassword.length < 6) {
      redirect(`/admin/perdoruesit/${id}/edit?gabim=1`);
    }
    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({ where: { id }, data: updateData });
  revalidatePath("/admin/perdoruesit");
  redirect("/admin/perdoruesit");
}

export async function deleteUser(id: string) {
  const session = await requireAdmin();
  const currentUserId = (session.user as { id?: string }).id;

  if (currentUserId === id) {
    redirect("/admin/perdoruesit?gabim=vetefshirje");
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      redirect("/admin/perdoruesit?gabim=admin_i_fundit");
    }
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/perdoruesit");
}
