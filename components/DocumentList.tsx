import { Badge, Th, Td, EmptyState } from "@/components/ui";
import { DOCUMENT_CATEGORY_LABELS, type DocumentCategoryVal } from "@/lib/enums";
import { fmtDate, fmtFileSize } from "@/lib/format";
import { deleteDocument } from "@/app/actions/document";
import DeleteSubmitButton from "@/components/DeleteSubmitButton";
import type { Document } from "@/lib/types";

const CATEGORY_BADGE: Record<string, "blue" | "green" | "yellow" | "gray"> = {
  AKT_LIGJOR: "blue",
  KONTRATE: "green",
  CV: "yellow",
  TJETER: "gray",
};

export default function DocumentList({
  documents,
  tableId,
  showLinked = false,
  returnTo,
}: {
  documents: Document[];
  tableId?: string;
  showLinked?: boolean;
  returnTo?: string;
}) {
  if (documents.length === 0) {
    return <EmptyState text="Nuk ka dokumente të ngarkuara ende." />;
  }
  return (
    <table id={tableId} className="w-full min-w-[800px]">
      <thead>
        <tr>
          <Th>Titulli</Th>
          <Th>Kategoria</Th>
          {showLinked && <Th>Lidhur me</Th>}
          <Th>Skedari</Th>
          <Th>Versioni</Th>
          <Th>Ngarkuar</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {documents.map((d) => (
          <tr key={d.id} className="hover:bg-slate-50">
            <Td className="font-medium text-slate-900">{d.title}</Td>
            <Td>
              <Badge color={CATEGORY_BADGE[d.category] ?? "gray"}>
                {DOCUMENT_CATEGORY_LABELS[d.category as DocumentCategoryVal] ?? d.category}
              </Badge>
            </Td>
            {showLinked && (
              <Td>
                {d.act ? `Akt: ${d.act.euReference}` : d.expert ? `Ekspert: ${d.expert.name}` : "—"}
              </Td>
            )}
            <Td>
              <a
                href={d.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {d.fileName}
              </a>
              <span className="text-slate-400"> ({fmtFileSize(d.fileSize)})</span>
            </Td>
            <Td>{d.version ?? "—"}</Td>
            <Td>
              {fmtDate(d.createdAt)}
              {d.uploadedBy ? ` — ${d.uploadedBy}` : ""}
            </Td>
            <Td>
              <form action={deleteDocument.bind(null, d.id, returnTo)}>
                <DeleteSubmitButton />
              </form>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
