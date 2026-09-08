import { prisma } from "@/lib/prisma";
import { PageHeader, Card, LinkButton, EmptyState } from "@/components/ui";
import { TableSearch, ExportCsvButton, PrintButton } from "@/components/TableTools";
import DocumentList from "@/components/DocumentList";
import type { Document } from "@/lib/types";

export default async function DokumentetPage() {
  const documents = (await prisma.document.findMany({
    include: { act: true, expert: true },
    orderBy: { createdAt: "desc" },
  })) as unknown as Document[];

  const tableId = "dokumentet-tabela";

  return (
    <div>
      <PageHeader
        title="Dokumentet"
        subtitle="Biblioteka qendrore e dokumenteve — akte ligjore, kontrata, CV dhe dokumente të tjera"
        action={
          <div className="flex items-center gap-2">
            <PrintButton />
            <LinkButton href="/dokumente/new">+ Dokument i Ri</LinkButton>
          </div>
        }
      />

      {documents.length === 0 ? (
        <Card className="overflow-x-auto">
          <EmptyState text="Nuk ka dokumente të ngarkuara ende." />
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap print:hidden">
            <TableSearch targetId={tableId} placeholder="Kërko titull, kategori, skedar..." />
            <ExportCsvButton targetId={tableId} filename="dokumentet" />
          </div>
          <Card className="overflow-x-auto">
            <DocumentList documents={documents} tableId={tableId} showLinked returnTo="/dokumente" />
          </Card>
        </>
      )}
    </div>
  );
}
