import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import UserForm from "@/components/forms/UserForm";
import { createUser } from "@/app/actions/user";

const GABIM_MESSAGES: Record<string, string> = {
  "1": "Ju lutem plotësoni të gjitha fushat (fjalëkalimi duhet të ketë të paktën 6 shenja).",
  ekziston: "Ekziston tashmë një përdorues me këtë email.",
};

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ gabim?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") redirect("/");

  const { gabim } = await searchParams;

  return (
    <div>
      <PageHeader title="Përdorues i Ri" />
      {gabim && GABIM_MESSAGES[gabim] && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4 max-w-lg">
          {GABIM_MESSAGES[gabim]}
        </p>
      )}
      <UserForm action={createUser} />
    </div>
  );
}
