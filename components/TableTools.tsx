"use client";

// Mjete të lehta për tabelat: kërkim/filtër client-side dhe eksportim CSV
// (hapet direkt në Excel). Funksionojnë mbi ID e elementit <table> — nuk
// kërkojnë ndryshim të strukturës së tabelave ekzistuese, thjesht i jepet
// tabelës një `id` dhe këto komponentë e gjejnë në DOM.

export function TableSearch({
  targetId,
  placeholder = "Kërko...",
}: {
  targetId: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => {
        const q = e.target.value.trim().toLowerCase();
        const table = document.getElementById(targetId);
        if (!table) return;
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row) => {
          const text = (row.textContent || "").toLowerCase();
          (row as HTMLElement).style.display = q === "" || text.includes(q) ? "" : "none";
        });
      }}
      className="w-full max-w-xs rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
    />
  );
}

function csvEscape(value: string): string {
  const v = value.replace(/\s+/g, " ").trim();
  if (/[",;\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export function ExportCsvButton({
  targetId,
  filename,
  label = "⬇ Eksporto CSV",
}: {
  targetId: string;
  filename: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const table = document.getElementById(targetId);
        if (!table) return;
        const rows = Array.from(table.querySelectorAll("tr"));
        const lines = rows
          .filter((row) => (row as HTMLElement).style.display !== "none")
          .map((row) => {
            const cells = Array.from(row.querySelectorAll("th,td"));
            return cells.map((c) => csvEscape(c.textContent || "")).join(";");
          });
        const csvContent = "﻿" + lines.join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }}
      className="inline-flex items-center rounded px-3 py-2 text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
    >
      {label}
    </button>
  );
}

export function PrintButton({ label = "🖨 Printo / PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center rounded px-3 py-2 text-sm font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
    >
      {label}
    </button>
  );
}
