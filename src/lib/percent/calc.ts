// Everyday percentage questions. Each returns null when the answer is undefined (like dividing by zero).

/** What is p% of x? */
export function percentOf(p: number, x: number): number {
  return (p / 100) * x;
}

/** part is what percent of whole? */
export function whatPercent(part: number, whole: number): number | null {
  return whole === 0 ? null : (part / whole) * 100;
}

/** Percentage change from one value to another. */
export function percentChange(from: number, to: number): number | null {
  return from === 0 ? null : ((to - from) / Math.abs(from)) * 100;
}

/** x with p% added (price plus tax) or taken off (a discount). */
export function applyPercent(x: number, p: number, direction: 'add' | 'subtract'): number {
  return x * (1 + (direction === 'add' ? p : -p) / 100);
}

/** Reads numbers as people type them: "1,234.5", "$80", "15%", " -3 ". */
export function parseNumber(value: string): number | null {
  const cleaned = value.trim().replace(/^[$€£¥]/, '').replace(/%$/, '').replace(/,(?=\d{3}(\D|$))/g, '').trim();
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(cleaned)) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

/** Up to 2 decimals, or more for tiny non-zero values so they don't show as 0. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 100) / 100;
  const digits = rounded === 0 && value !== 0 ? 6 : 2;
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

/** Recognises pasted questions like "15% of 80". */
export function parsePercentOf(value: string): { p: number; x: number } | null {
  const match = /^\s*([-+]?[\d.,]+)\s*%\s*of\s*\$?([-+]?[\d.,]+)\s*$/i.exec(value);
  if (!match) return null;
  const p = parseNumber(match[1]);
  const x = parseNumber(match[2]);
  return p === null || x === null ? null : { p, x };
}
