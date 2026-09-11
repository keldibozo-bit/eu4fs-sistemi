// Nxjerr grupin "Pool" (kategoria e ekspertit sipas Ofertës Teknike) nga
// teksti i fushës `pmNotes`, e cila tashmë përmban një shënim si
// "Pool 1 – Ekspertë ligjorë kombëtarë" për çdo ekspert të importuar nga
// skriptet prisma/add-experts-lot*.ts. Grupimi llogaritet vetëm në kohën
// e shfaqjes, nga të dhënat ekzistuese — pa fushë të re në schema.prisma
// dhe pa migrim/backfill mbi databazën e prodhimit.

export type ExpertPoolGroup = {
  number: number;
  label: string;
};

const POOL_PATTERN = /Pool\s*(\d+)\s*[–-]\s*([^;]+)/i;

export function parseExpertPool(pmNotes: string | null | undefined): ExpertPoolGroup | null {
  if (!pmNotes) return null;
  const match = pmNotes.match(POOL_PATTERN);
  if (!match) return null;
  return { number: parseInt(match[1], 10), label: match[2].trim() };
}

export function groupExpertsByPool<T extends { pmNotes: string | null }>(
  experts: T[]
): { group: ExpertPoolGroup | null; experts: T[] }[] {
  const map = new Map<string, { group: ExpertPoolGroup | null; experts: T[] }>();

  for (const expert of experts) {
    const pool = parseExpertPool(expert.pmNotes);
    const key = pool ? String(pool.number) : "__pa_pool__";
    if (!map.has(key)) {
      map.set(key, { group: pool, experts: [] });
    }
    map.get(key)!.experts.push(expert);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (!a.group && !b.group) return 0;
    if (!a.group) return 1;
    if (!b.group) return -1;
    return a.group.number - b.group.number;
  });
}
