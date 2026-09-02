import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const NAV = [
  { href: "/", label: "Përmbledhja" },
  { href: "/lote", label: "Lotet" },
  { href: "/ekspertet", label: "Ekspertët" },
  { href: "/raci", label: "RACI & Rolet" },
  { href: "/ore-pune", label: "Fletë Kohe" },
  { href: "/deliverables", label: "Deliverables & QC" },
  { href: "/katalogu", label: "Katalogu i Deliverables" },
  { href: "/rubrika-qc", label: "Rubrika QC" },
  { href: "/problematika", label: "Log Problematikash" },
];

export default function Sidebar({
  userName,
  userEmail,
}: {
  userName?: string | null;
  userEmail?: string | null;
}) {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="font-semibold text-sm leading-tight">
          EU4Food Safety
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Sistemi i Menaxhimit
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-slate-800 text-xs">
        <div className="text-slate-200 truncate">{userName}</div>
        <div className="text-slate-500 truncate">{userEmail}</div>
        <SignOutButton />
      </div>
    </aside>
  );
}
