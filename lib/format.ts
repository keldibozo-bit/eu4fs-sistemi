export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("sq-AL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function fmtDateInput(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function fmtEUR(n: number | null | undefined): string {
  if (n == null) return "—";
  return (
    n.toLocaleString("sq-AL", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) +
    " €"
  );
}

export function fmtNum(n: number | null | undefined, digits = 1): string {
  if (n == null) return "—";
  return n.toLocaleString("sq-AL", { maximumFractionDigits: digits });
}

export function fmtPercent(n: number | null | undefined): string {
  if (n == null) return "—";
  return Math.round(n * 100) + "%";
}
