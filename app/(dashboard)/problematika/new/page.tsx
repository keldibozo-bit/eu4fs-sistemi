import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import IssueForm from "@/components/forms/IssueForm";
import { createIssue } from "@/app/actions/issue";
import type { Lot } from "@/lib/types";

export default async function NewIssuePage() {
  const lots = (await prisma.lot.findMany({ orderBy: { code: "asc" } })) as Lot[];
  return (
    <div>
      <PageHeader title="Rresht i Ri në Log Problematikash" />
      <IssueForm action={createIssue} lots={lots} />
    </div>
  );
}
