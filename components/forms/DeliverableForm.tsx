"use client";

import { useState } from "react";
import { Card, Field, inputCls } from "@/components/ui";
import { fmtDateInput } from "@/lib/format";
import { weightedScore, decision, isLate } from "@/lib/compute";
import {
  DELIVERABLE_TYPES,
  DELIVERABLE_TYPE_LABELS,
  DELIVERABLE_STATUSES,
  DELIVERABLE_STATUS_LABELS,
  CONFIRM_VALUES,
  CONFIRM_LABELS,
} from "@/lib/enums";
import type { Deliverable, Lot, Expert, DeliverableCatalogItem } from "@/lib/types";

const SCORE_OPTIONS = [1, 2, 3, 4, 5];

export default function DeliverableForm({
  action,
  lots,
  experts,
  catalogItems,
  defaultValues,
}: {
  action: (fd: FormData) => void;
  lots: Lot[];
  experts: Expert[];
  catalogItems: DeliverableCatalogItem[];
  defaultValues?: Deliverable;
}) {
  const [k1, setK1] = useState<number | null>(defaultValues?.k1 ?? null);
  const [k2, setK2] = useState<number | null>(defaultValues?.k2 ?? null);
  const [k3, setK3] = useState<number | null>(defaultValues?.k3 ?? null);
  const [k4, setK4] = useState<number | null>(defaultValues?.k4 ?? null);
  const [k5, setK5] = useState<number | null>(defaultValues?.k5 ?? null);
  const [k6, setK6] = useState<number | null>(defaultValues?.k6 ?? null);
  const [deadline, setDeadline] = useState<string>(fmtDateInput(defaultValues?.deadline));
  const [submissionDate, setSubmissionDate] = useState<string>(
    fmtDateInput(defaultValues?.submissionDate)
  );

  const scores = { k1, k2, k3, k4, k5, k6 };
  const previewScore = weightedScore(scores);
  const previewDecision = decision(scores);
  const previewLate = isLate(
    deadline ? new Date(deadline) : null,
    submissionDate ? new Date(submissionDate) : null
  );

  function scoreSelect(
    name: string,
    value: number | null,
    setValue: (v: number | null) => void,
    label: string
  ) {
    return (
      <Field label={label}>
        <select
          name={name}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value ? Number(e.target.value) : null)}
          className={inputCls}
        >
          <option value="">—</option>
          {SCORE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  return (
    <Card className="p-6 max-w-4xl">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Loti" required>
            <select name="lotId" required defaultValue={defaultValues?.lotId ?? lots[0]?.id} className={inputCls}>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code} — {l.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Eksperti" required>
            <select
              name="expertId"
              required
              defaultValue={defaultValues?.expertId ?? experts[0]?.id}
              className={inputCls}
            >
              {experts.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Elementi i Katalogut (opsionale)">
            <select
              name="catalogItemId"
              defaultValue={defaultValues?.catalogItemId ?? ""}
              className={inputCls}
            >
              <option value="">— asnjë —</option>
              {catalogItems.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contractualId} — {c.title}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Titulli" required>
          <input name="title" required defaultValue={defaultValues?.title} className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipi" required>
            <select name="type" required defaultValue={defaultValues?.type ?? DELIVERABLE_TYPES[0]} className={inputCls}>
              {DELIVERABLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DELIVERABLE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Statusi" required>
            <select
              name="status"
              required
              defaultValue={defaultValues?.status ?? "DRAFT"}
              className={inputCls}
            >
              {DELIVERABLE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {DELIVERABLE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Afati (Deadline)">
            <input
              type="date"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Data e Dorëzimit">
            <input
              type="date"
              name="submissionDate"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Vlerësimi QC (K1–K6, shkalla 1–5)
          </h3>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {scoreSelect("k1", k1, setK1, "K1 (30%)")}
            {scoreSelect("k2", k2, setK2, "K2 (20%)")}
            {scoreSelect("k3", k3, setK3, "K3 (15%)")}
            {scoreSelect("k4", k4, setK4, "K4 (15%)")}
            {scoreSelect("k5", k5, setK5, "K5 (15%)")}
            {scoreSelect("k6", k6, setK6, "K6 (5%)")}
          </div>

          <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 p-4 text-sm grid grid-cols-3 gap-4">
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wide">
                Vlerësimi i Ponderuar
              </div>
              <div className="font-semibold text-slate-900 text-lg">
                {previewScore != null ? previewScore.toFixed(2) : "—"}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wide">Vendimi</div>
              <div className="font-semibold text-slate-900">{previewDecision ?? "—"}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wide">Me Vonesë?</div>
              <div className="font-semibold text-slate-900">{previewLate ? "Po" : "Jo"}</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Këto tre vlera llogariten automatikisht dhe ruhen si të tilla — nuk ruhen si fusha
            të veçanta, por rikalkulohen çdo herë që hapet deliverable-i.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4">
          <Field label="Recensuesi (PM)">
            <input name="reviewer" defaultValue={defaultValues?.reviewer ?? undefined} className={inputCls} />
          </Field>
          <Field label="Versioni">
            <input
              type="number"
              min={1}
              name="version"
              defaultValue={defaultValues?.version ?? 1}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Komente QC (opsionale)">
          <textarea
            name="qcComments"
            rows={3}
            defaultValue={defaultValues?.qcComments ?? undefined}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data e Aprovimit Final (opsionale)">
            <input
              type="date"
              name="finalApprovalDate"
              defaultValue={fmtDateInput(defaultValues?.finalApprovalDate)}
              className={inputCls}
            />
          </Field>
          <Field label="Recensues Dytësor / 4-Eyes (opsionale)">
            <input
              name="secondaryReviewer"
              defaultValue={defaultValues?.secondaryReviewer ?? undefined}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Rishikimi Dytësor i Konfirmuar?">
          <select
            name="secondaryReviewConfirmed"
            defaultValue={defaultValues?.secondaryReviewConfirmed ?? ""}
            className={inputCls}
          >
            <option value="">—</option>
            {CONFIRM_VALUES.map((v) => (
              <option key={v} value={v}>
                {CONFIRM_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>

        <div className="pt-2">
          <button
            type="submit"
            className="rounded bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800"
          >
            Ruaj
          </button>
        </div>
      </form>
    </Card>
  );
}
