import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import UserForm from "@/components/forms/UserForm";
import { updateUser } from "@/app/actions/user";
import type { User } from "@/lib/types";

const GABIM_MESSAGES: Record<string, string> = {
  "1": "Fjalëkalimi i ri duhet të ketë të paktën 6 shenja.",
  admin_i_fundit: "Nuk mund ta hiqni rolin Admin nga i vetmi përdorues me këtë rol.",
};

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gabim?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") redirect("/");

  const { id } = await params;
  const { gabim } = await searchParams;
  const user = (await prisma.user.findUnique({ where: { id } })) as User | null;
  if (!user) notFound();

  return (
    <div>
      <PageHeader title={`Ndrysho Përdoruesin — ${user.name}`} />
      {gabim && GABIM_MESSAGES[gabim] && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4 max-w-lg">
          {GABIM_MESSAGES[gabim]}
        </p>
      )}
      <UserForm action={updateUser.bind(null, id)} defaultValues={user} isEdit />
    </div>
  );
}
