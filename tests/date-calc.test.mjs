import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addToDate,
  ageOn,
  daysBetween,
  describeSpan,
  difference,
  parseISODate,
  parseLooseDate,
  weekday,
  weekdaysBetween
} from '../src/lib/date/calc.ts';

const d = (s) => parseISODate(s);

test('parses input values and rejects impossible dates', () => {
  assert.deepEqual(d('2026-11-09'), { y: 2026, m: 11, d: 9 });
  assert.equal(d('2026-02-30'), null);
  assert.equal(d('2026-13-01'), null);
  assert.deepEqual(d('2024-02-29'), { y: 2024, m: 2, d: 29 });
  assert.equal(d('2023-02-29'), null);
});

test('reads typed dates day-first, falling back to month-first only when needed', () => {
  assert.deepEqual(parseLooseDate('9/11/2026'), { y: 2026, m: 11, d: 9 });
  assert.deepEqual(parseLooseDate('09.11.26'), { y: 2026, m: 11, d: 9 });
  assert.deepEqual(parseLooseDate('11/25/2026'), { y: 2026, m: 11, d: 25 });
  assert.equal(parseLooseDate('31/02/2026'), null);
  assert.equal(parseLooseDate('hello'), null);
});

test('days between dates, across daylight saving and leap years', () => {
  assert.equal(daysBetween(d('2026-01-01'), d('2027-01-01')), 365);
  assert.equal(daysBetween(d('2024-01-01'), d('2025-01-01')), 366);
  assert.equal(daysBetween(d('2026-04-04'), d('2026-04-06')), 2); // AU daylight saving ends 5 April 2026
  assert.equal(daysBetween(d('2026-03-10'), d('2026-03-01')), -9);
});

test('weekday of known dates', () => {
  assert.equal(weekday(d('2026-11-09')), 1); // Monday
  assert.equal(weekday(d('2000-01-01')), 6); // Saturday
});

test('calendar difference in years, months and days', () => {
  assert.deepEqual(difference(d('2020-01-15'), d('2026-03-20')), { years: 6, months: 2, days: 5, totalDays: 2256, negative: false });
  assert.deepEqual(difference(d('2026-01-31'), d('2026-03-01')), { years: 0, months: 1, days: 1, totalDays: 29, negative: false });
  assert.equal(difference(d('2026-05-01'), d('2026-04-01')).negative, true);
  assert.equal(describeSpan(difference(d('2026-05-01'), d('2026-05-01'))), 'Same day');
  assert.equal(describeSpan({ years: 1, months: 0, days: 2 }), '1 year, 2 days');
});

test('adding days, weeks, months and years', () => {
  assert.deepEqual(addToDate(d('2026-11-09'), 30, 'days'), d('2026-12-09'));
  assert.deepEqual(addToDate(d('2026-11-09'), -2, 'weeks'), d('2026-10-26'));
  assert.deepEqual(addToDate(d('2026-01-31'), 1, 'months'), d('2026-02-28'));
  assert.deepEqual(addToDate(d('2024-02-29'), 1, 'years'), d('2025-02-28'));
  assert.deepEqual(addToDate(d('2026-03-15'), -3, 'months'), d('2025-12-15'));
});

test('counts weekdays, optionally including the end date', () => {
  // Mon 9 Nov to Mon 16 Nov 2026
  assert.equal(weekdaysBetween(d('2026-11-09'), d('2026-11-16')), 5);
  assert.equal(weekdaysBetween(d('2026-11-09'), d('2026-11-16'), true), 6);
  assert.equal(weekdaysBetween(d('2026-11-14'), d('2026-11-15'), true), 0); // a weekend
  assert.equal(weekdaysBetween(d('2026-11-16'), d('2026-11-09')), 5); // order doesn't matter
});

test('age and next birthday', () => {
  const age = ageOn(d('1990-11-20'), d('2026-11-09'));
  assert.equal(age.years, 35);
  assert.equal(age.months, 11);
  assert.deepEqual(age.nextBirthday, d('2026-11-20'));
  assert.equal(age.daysToBirthday, 11);
  assert.equal(ageOn(d('2000-01-01'), d('2026-01-01')).daysToBirthday, 0);
  assert.deepEqual(ageOn(d('2004-02-29'), d('2026-01-01')).nextBirthday, d('2026-02-28'));
  assert.equal(ageOn(d('2030-01-01'), d('2026-01-01')), null);
});
