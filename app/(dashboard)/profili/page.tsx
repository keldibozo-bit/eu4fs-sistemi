import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PageHeader, Card } from "@/components/ui";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { USER_ROLE_LABELS, type UserRoleVal } from "@/lib/enums";

export default async function ProfiliPage({
  searchParams,
}: {
  searchParams: Promise<{ gabim?: string; sukses?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { gabim, sukses } = await searchParams;
  const role = (session.user as { role?: string }).role ?? "PM";
  const roleLabel = USER_ROLE_LABELS[role as UserRoleVal] ?? role;

  return (
    <div>
      <PageHeader title="Profili im" subtitle="Të dhënat e llogarisë dhe ndryshimi i fjalëkalimit" />

      <Card className="p-6 max-w-md mb-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Të Dhënat e Llogarisë</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-slate-500">Emri</dt>
            <dd className="text-slate-900 font-medium">{session.user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-900 font-medium">{session.user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Roli</dt>
            <dd className="text-slate-900 font-medium">{roleLabel}</dd>
          </div>
        </dl>
      </Card>

      <ChangePasswordForm gabim={gabim} sukses={sukses} />
    </div>
  );
}
