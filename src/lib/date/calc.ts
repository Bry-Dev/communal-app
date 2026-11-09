// Calendar maths on plain dates (no time of day), done in UTC so daylight saving never shifts a day.
export type YMD = { y: number; m: number; d: number }; // m is 1–12
export type Unit = 'days' | 'weeks' | 'months' | 'years';

const DAY_MS = 86_400_000;

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function isValid({ y, m, d }: YMD): boolean {
  return Number.isInteger(y) && Number.isInteger(m) && Number.isInteger(d) && y >= 1 && y <= 9999 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

/** Parses the yyyy-mm-dd value of an <input type="date">. */
export function parseISODate(value: string): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const date = { y: +match[1], m: +match[2], d: +match[3] };
  return isValid(date) ? date : null;
}

/**
 * Parses dates people type or paste: 2026-11-09, 9/11/2026, 9-11-26, 9.11.2026.
 * Short dates are read day-first, unless only month-first makes sense (11/25/2026).
 */
export function parseLooseDate(value: string): YMD | null {
  const iso = parseISODate(value);
  if (iso) return iso;
  const match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(value.trim());
  if (!match) return null;
  let [a, b] = [+match[1], +match[2]];
  const y = match[3].length === 2 ? 2000 + +match[3] : +match[3];
  if (b > 12 && a <= 12) [a, b] = [b, a];
  const date = { y, m: b, d: a };
  return isValid(date) ? date : null;
}

export function toISO({ y, m, d }: YMD): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function toDay(date: YMD): number {
  const utc = new Date(0);
  utc.setUTCFullYear(date.y, date.m - 1, date.d);
  return Math.round(utc.getTime() / DAY_MS);
}

function fromDay(day: number): YMD {
  const utc = new Date(day * DAY_MS);
  return { y: utc.getUTCFullYear(), m: utc.getUTCMonth() + 1, d: utc.getUTCDate() };
}

export function compare(a: YMD, b: YMD): number {
  return toDay(a) - toDay(b);
}

/** Days from a to b (negative when b is earlier). */
export function daysBetween(a: YMD, b: YMD): number {
  return toDay(b) - toDay(a);
}

/** 0 = Sunday … 6 = Saturday. */
export function weekday(date: YMD): number {
  return (((toDay(date) + 4) % 7) + 7) % 7; // 1970-01-01 was a Thursday.
}

/** Adds months, keeping the day where possible: 31 Jan + 1 month = 28/29 Feb. */
export function addMonths(date: YMD, months: number): YMD {
  const index = date.y * 12 + (date.m - 1) + months;
  const y = Math.floor(index / 12);
  const m = (index % 12) + 1;
  return { y, m, d: Math.min(date.d, daysInMonth(y, m)) };
}

export function addToDate(date: YMD, amount: number, unit: Unit): YMD {
  switch (unit) {
    case 'days': return fromDay(toDay(date) + amount);
    case 'weeks': return fromDay(toDay(date) + amount * 7);
    case 'months': return addMonths(date, amount);
    case 'years': return addMonths(date, amount * 12);
  }
}

export type Span = { years: number; months: number; days: number; totalDays: number; negative: boolean };

/** Calendar difference in whole years, months and days, plus the total number of days. */
export function difference(a: YMD, b: YMD): Span {
  const negative = compare(b, a) < 0;
  const [start, end] = negative ? [b, a] : [a, b];
  let total = (end.y - start.y) * 12 + (end.m - start.m);
  if (compare(addMonths(start, total), end) > 0) total -= 1;
  return {
    years: Math.floor(total / 12),
    months: total % 12,
    days: daysBetween(addMonths(start, total), end),
    totalDays: daysBetween(start, end),
    negative
  };
}

/** Monday–Friday days from a up to b; b itself counts only when includeEnd is true. */
export function weekdaysBetween(a: YMD, b: YMD, includeEnd = false): number {
  const [start, end] = compare(a, b) <= 0 ? [a, b] : [b, a];
  const days = daysBetween(start, end) + (includeEnd ? 1 : 0);
  const fullWeeks = Math.floor(days / 7);
  let count = fullWeeks * 5;
  const first = weekday(start);
  for (let i = 0; i < days % 7; i++) {
    const day = (first + i) % 7;
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

export type Age = Span & { nextBirthday: YMD; daysToBirthday: number };

/** Age on a given day. People born on 29 February celebrate on 28 February in other years. */
export function ageOn(birth: YMD, on: YMD): Age | null {
  if (compare(on, birth) < 0) return null;
  const span = difference(birth, on);
  const birthdayIn = (y: number) => ({ y, m: birth.m, d: Math.min(birth.d, daysInMonth(y, birth.m)) });
  let next = birthdayIn(on.y);
  if (compare(next, on) < 0) next = birthdayIn(on.y + 1);
  return { ...span, nextBirthday: next, daysToBirthday: daysBetween(on, next) };
}

export function today(): YMD {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

/** Formats in the visitor's own locale, e.g. "Monday 9 November 2026" in Australia. */
export function formatDate(date: YMD, style: 'long' | 'short' = 'long'): string {
  const utc = new Date(toDay(date) * DAY_MS);
  return utc.toLocaleDateString(undefined, style === 'long'
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
    : { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function weekdayName(date: YMD): string {
  return new Date(toDay(date) * DAY_MS).toLocaleDateString(undefined, { weekday: 'long', timeZone: 'UTC' });
}

export function plural(value: number, word: string): string {
  return `${value.toLocaleString()} ${word}${value === 1 ? '' : 's'}`;
}

/** "1 year, 2 months, 3 days" — leaving out zero parts. */
export function describeSpan({ years, months, days }: Pick<Span, 'years' | 'months' | 'days'>): string {
  const parts = [years && plural(years, 'year'), months && plural(months, 'month'), days && plural(days, 'day')].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Same day';
}
