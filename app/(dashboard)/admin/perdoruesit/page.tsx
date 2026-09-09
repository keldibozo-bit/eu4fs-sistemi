import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, Th, Td, Badge, EmptyState } from "@/components/ui";
import { USER_ROLE_LABELS, type UserRoleVal } from "@/lib/enums";
import { fmtDate } from "@/lib/format";
import { deleteUser } from "@/app/actions/user";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import Link from "next/link";
import type { User } from "@/lib/types";

const GABIM_MESSAGES: Record<string, string> = {
  vetefshirje: "Nuk mund ta fshini llogarinë tuaj.",
  admin_i_fundit: "Nuk mund të fshihet i vetmi përdorues me rol Admin.",
};

export default async function PerdoruesitPage({
  searchParams,
}: {
  searchParams: Promise<{ gabim?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") redirect("/");

  const { gabim } = await searchParams;
  const users = (await prisma.user.findMany({ orderBy: { createdAt: "asc" } })) as User[];
  const currentUserId = (session!.user as { id?: string }).id;

  return (
    <div>
      <PageHeader
        title="Përdoruesit"
        subtitle="Menaxhimi i llogarive të përdoruesve të sistemit"
        action={<LinkButton href="/admin/perdoruesit/new">+ Përdorues i Ri</LinkButton>}
      />

      {gabim && GABIM_MESSAGES[gabim] && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4 max-w-lg">
          {GABIM_MESSAGES[gabim]}
        </p>
      )}

      <Card className="overflow-x-auto">
        {users.length === 0 ? (
          <EmptyState text="Nuk ka përdorues të regjistruar." />
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <Th>Emri</Th>
                <Th>Email</Th>
                <Th>Roli</Th>
                <Th>Krijuar</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="text-xs text-slate-400 ml-1">(ju)</span>
                    )}
                  </Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <Badge color={u.role === "ADMIN" ? "blue" : "gray"}>
                      {USER_ROLE_LABELS[u.role as UserRoleVal] ?? u.role}
                    </Badge>
                  </Td>
                  <Td>{fmtDate(u.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/perdoruesit/${u.id}/edit`}
                        className="text-slate-700 hover:underline text-sm"
                      >
                        Ndrysho
                      </Link>
                      <form action={deleteUser.bind(null, u.id)}>
                        <DeleteSubmitButton />
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
