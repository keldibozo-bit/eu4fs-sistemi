export function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.toString().trim() ?? "";
}

export function strOrNull(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.toString().trim();
  return v ? v : null;
}

export function intVal(fd: FormData, key: string): number {
  const v = fd.get(key);
  return v ? parseInt(v.toString(), 10) : 0;
}

export function intOrNull(fd: FormData, key: string): number | null {
  const v = (fd.get(key) as string | null)?.toString().trim();
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

export function floatVal(fd: FormData, key: string): number {
  const v = fd.get(key);
  return v ? parseFloat(v.toString()) : 0;
}

export function floatOrNull(fd: FormData, key: string): number | null {
  const v = (fd.get(key) as string | null)?.toString().trim();
  if (!v) return null;
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
}

export function dateVal(fd: FormData, key: string): Date {
  const v = str(fd, key);
  return v ? new Date(v) : new Date();
}

export function dateOrNull(fd: FormData, key: string): Date | null {
  const v = str(fd, key);
  return v ? new Date(v) : null;
}
