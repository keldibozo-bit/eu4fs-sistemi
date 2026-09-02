import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import IssueForm from "@/components/forms/IssueForm";
import { updateIssue } from "@/app/actions/issue";
import type { IssueLog, Lot } from "@/lib/types";

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [issue, lots] = await Promise.all([
    prisma.issueLog.findUnique({ where: { id } }),
    prisma.lot.findMany({ orderBy: { code: "asc" } }),
  ]);
  if (!issue) notFound();

  return (
    <div>
      <PageHeader title="Ndrysho Rreshtin" />
      <IssueForm action={updateIssue.bind(null, id)} lots={lots as Lot[]} defaultValues={issue as IssueLog} />
    </div>
  );
}
