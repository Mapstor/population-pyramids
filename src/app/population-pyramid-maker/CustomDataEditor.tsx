'use client';

import { useMemo } from 'react';
import {
  STANDARD_AGE_BANDS,
  emptyPyramid,
  seedPyramid,
  type PyramidRow,
} from '@/lib/pyramid-maker-helpers';

interface Props {
  rows: PyramidRow[];
  onChange: (rows: PyramidRow[]) => void;
}

export default function CustomDataEditor({ rows, onChange }: Props) {
  const totals = useMemo(() => {
    const male = rows.reduce((s, r) => s + r.male, 0);
    const female = rows.reduce((s, r) => s + r.female, 0);
    return { male, female, total: male + female };
  }, [rows]);

  function update(idx: number, key: 'male' | 'female', raw: string) {
    const n = parseFloat(raw);
    const next = rows.slice();
    next[idx] = { ...next[idx], [key]: Number.isNaN(n) || n < 0 ? 0 : n };
    onChange(next);
  }

  function reset(kind: 'empty' | 'usa') {
    onChange(kind === 'empty' ? emptyPyramid() : seedPyramid());
  }

  function parsePastedTable(text: string) {
    // Accepts TSV/CSV with columns: age | male | female (header optional)
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return;
    const parsed: PyramidRow[] = [];
    for (const line of lines) {
      const parts = line.split(/[\t,;]/).map(s => s.trim());
      if (parts.length < 3) continue;
      const ageRaw = parts[0];
      const m = parseFloat(parts[1].replace(/[, ]/g, ''));
      const f = parseFloat(parts[2].replace(/[, ]/g, ''));
      if (Number.isNaN(m) || Number.isNaN(f)) continue;
      parsed.push({ ageRange: ageRaw, male: m, female: f });
    }
    if (parsed.length === 0) return;
    // Reshape: keep our 21 standard bands, fill from parsed where age range matches
    const lookup = new Map(parsed.map(r => [r.ageRange.toLowerCase(), r]));
    const next = STANDARD_AGE_BANDS.map(band => {
      const hit = lookup.get(band.toLowerCase());
      return hit
        ? { ageRange: band, male: hit.male, female: hit.female }
        : { ageRange: band, male: 0, female: 0 };
    });
    onChange(next);
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData?.getData('text');
    if (text) {
      e.preventDefault();
      parsePastedTable(text);
    }
  }

  return (
    <div className="space-y-4">
      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => reset('usa')}
          className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 font-medium transition"
        >
          🇺🇸 Load USA shape
        </button>
        <button
          type="button"
          onClick={() => reset('empty')}
          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 font-medium transition"
        >
          Clear to zero
        </button>
        <span className="text-xs text-gray-500 ml-auto">
          Total: <strong className="tabular-nums text-gray-900">{totals.total.toLocaleString()}</strong>
          {' '}· M <strong className="tabular-nums text-blue-700">{totals.male.toLocaleString()}</strong>
          {' '}· F <strong className="tabular-nums text-pink-600">{totals.female.toLocaleString()}</strong>
        </span>
      </div>

      {/* Editable table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Age</th>
              <th className="px-3 py-2 text-right font-semibold">Male</th>
              <th className="px-3 py-2 text-right font-semibold">Female</th>
              <th className="px-3 py-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => (
              <tr key={r.ageRange} className="hover:bg-gray-50">
                <td className="px-3 py-1.5 text-gray-900 font-medium">{r.ageRange}</td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={r.male}
                    onChange={e => update(i, 'male', e.target.value)}
                    className="w-full px-2 py-1 text-right border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
                    aria-label={`Male population aged ${r.ageRange}`}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={r.female}
                    onChange={e => update(i, 'female', e.target.value)}
                    className="w-full px-2 py-1 text-right border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 tabular-nums"
                    aria-label={`Female population aged ${r.ageRange}`}
                  />
                </td>
                <td className="px-3 py-1.5 text-right text-gray-700 tabular-nums">
                  {(r.male + r.female).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paste import */}
      <details className="rounded-lg border border-gray-200 bg-gray-50">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100">
          📋 Or paste data from a spreadsheet
        </summary>
        <div className="px-3 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">
            Paste tab-separated, comma-separated, or semicolon-separated data. Columns: <strong>age range</strong>,{' '}
            <strong>male</strong>, <strong>female</strong>. Header row is OK (it's skipped if values aren't numeric).
            Age ranges should use our 5-year band labels: <code>0-4</code>, <code>5-9</code>, …, <code>95-99</code>, <code>100+</code>.
          </p>
          <textarea
            placeholder={`0-4\t10000\t9500\n5-9\t11000\t10500\n10-14\t...\t...`}
            rows={4}
            onPaste={onPaste}
            className="w-full p-2 border border-gray-300 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[10px] text-gray-500 mt-1">Pasting auto-fills the table above and clears this box.</p>
        </div>
      </details>
    </div>
  );
}
