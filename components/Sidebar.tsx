"use client";

import Link from "next/link";
import { useState } from "react";
import SignOutButton from "@/components/SignOutButton";
import type { Lot, Cluster } from "@/lib/types";

const NAV_TOP = [{ href: "/", label: "Përmbledhja" }];

const NAV_BOTTOM = [
  { href: "/ekspertet", label: "Ekspertët" },
  { href: "/raci", label: "RACI & Rolet" },
  { href: "/ore-pune", label: "Fletë Kohe" },
  { href: "/deliverables", label: "Deliverables & QC" },
  { href: "/katalogu", label: "Katalogu i Deliverables" },
  { href: "/rubrika-qc", label: "Rubrika QC" },
  { href: "/problematika", label: "Log Problematikash" },
];

type LotWithClusters = Lot & { clusters: Cluster[] };

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}

function ClusterNav({
  lotId,
  cluster,
  onNavigate,
}: {
  lotId: string;
  cluster: Cluster;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <span className="truncate text-left">{cluster.name}</span>
        <span className="text-xs text-slate-500 shrink-0 pl-1">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <ul className="ml-2 mt-0.5 mb-1 space-y-0.5 border-l border-slate-700 pl-3">
          <li>
            <Link
              href={`/lote/${lotId}/clusters/${cluster.id}/plan`}
              onClick={onNavigate}
              className="block rounded px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Plani i Punës
            </Link>
          </li>
          <li>
            <Link
              href={`/lote/${lotId}/clusters/${cluster.id}/akte`}
              onClick={onNavigate}
              className="block rounded px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Lista e Akteve
            </Link>
          </li>
          <li>
            <Link
              href={`/lote/${lotId}/clusters/${cluster.id}/eksperte`}
              onClick={onNavigate}
              className="block rounded px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Lista e Ekspertëve
            </Link>
          </li>
        </ul>
      )}
    </li>
  );
}

function LotNav({
  lot,
  onNavigate,
}: {
  lot: LotWithClusters;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <span className="truncate text-left">
          {lot.code} — {lot.name}
        </span>
        <span className="text-xs text-slate-500 shrink-0 pl-1">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <ul className="ml-2 mt-0.5 mb-1 space-y-0.5 border-l border-slate-700 pl-3">
          {lot.clusters.length === 0 ? (
            <li className="px-2 py-1.5 text-xs text-slate-500">Nuk ka cluster ende</li>
          ) : (
            lot.clusters.map((c) => (
              <ClusterNav key={c.id} lotId={lot.id} cluster={c} onNavigate={onNavigate} />
            ))
          )}
          <li>
            <Link
              href={`/lote/${lot.id}/clusters`}
              onClick={onNavigate}
              className="block rounded px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Menaxho Cluster-at →
            </Link>
          </li>
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({
  userName,
  userEmail,
  lots,
}: {
  userName?: string | null;
  userEmail?: string | null;
  lots: LotWithClusters[];
}) {
  const [lotetOpen, setLotetOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-slate-900 text-slate-100 px-4 py-3 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Hap menunë"
          className="text-2xl leading-none px-1"
        >
          ☰
        </button>
        <div className="text-sm font-semibold">EU4Food Safety</div>
        <div className="w-6" />
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMobile} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-slate-900 text-slate-100 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:transform-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm leading-tight">EU4Food Safety</div>
            <div className="text-xs text-slate-400 mt-0.5">Sistemi i Menaxhimit</div>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Mbyll menunë"
            className="md:hidden text-xl leading-none px-1 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5 px-2">
            {NAV_TOP.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} onNavigate={closeMobile} />
              </li>
            ))}

            <li>
              <div className="flex items-center rounded hover:bg-slate-800 transition-colors">
                <Link
                  href="/lote"
                  onClick={closeMobile}
                  className="flex-1 min-w-0 truncate px-3 py-2 text-sm text-slate-200 hover:text-white"
                >
                  Lotet
                </Link>
                <button
                  type="button"
                  onClick={() => setLotetOpen((o) => !o)}
                  aria-label="Shfaq/Fshih lotet"
                  className="shrink-0 px-3 py-2 text-xs text-slate-500 hover:text-white"
                >
                  {lotetOpen ? "▾" : "▸"}
                </button>
              </div>
              {lotetOpen && (
                <ul className="mt-0.5 mb-1 space-y-0.5">
                  {lots.length === 0 ? (
                    <li className="px-3 py-1.5 text-xs text-slate-500">Nuk ka lote ende</li>
                  ) : (
                    lots.map((lot) => <LotNav key={lot.id} lot={lot} onNavigate={closeMobile} />)
                  )}
                </ul>
              )}
            </li>

            {NAV_BOTTOM.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} onNavigate={closeMobile} />
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
    </>
  );
}
