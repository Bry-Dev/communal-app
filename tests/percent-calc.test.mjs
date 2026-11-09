import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPercent, formatNumber, parseNumber, parsePercentOf, percentChange, percentOf, whatPercent } from '../src/lib/percent/calc.ts';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≈ ${expected}`);

test('percent of a number', () => {
  close(percentOf(15, 80), 12);
  close(percentOf(250, 4), 10);
  close(percentOf(-10, 50), -5);
});

test('what percent one number is of another', () => {
  close(whatPercent(18, 24), 75);
  assert.equal(whatPercent(5, 0), null);
});

test('percentage change, including from negative values', () => {
  close(percentChange(50, 65), 30);
  close(percentChange(80, 60), -25);
  close(percentChange(-100, -50), 50);
  assert.equal(percentChange(0, 10), null);
});

test('adding and taking off a percentage', () => {
  close(applyPercent(120, 20, 'subtract'), 96);
  close(applyPercent(100, 10, 'add'), 110);
});

test('reads numbers the way people type them', () => {
  assert.equal(parseNumber('1,234.5'), 1234.5);
  assert.equal(parseNumber('$80'), 80);
  assert.equal(parseNumber('15%'), 15);
  assert.equal(parseNumber(' -3 '), -3);
  assert.equal(parseNumber('.5'), 0.5);
  assert.equal(parseNumber(''), null);
  assert.equal(parseNumber('abc'), null);
  assert.equal(parseNumber('1.2.3'), null);
});

test('formats to two decimals without hiding tiny values', () => {
  assert.equal(formatNumber(33.33333).replace(/\s/g, ''), '33.33');
  assert.equal(formatNumber(0.0001), '0.0001');
  assert.equal(formatNumber(Number.NaN), '—');
});

test('recognises pasted "x% of y" questions', () => {
  assert.deepEqual(parsePercentOf('15% of 80'), { p: 15, x: 80 });
  assert.deepEqual(parsePercentOf('12.5 % OF $1,200'), { p: 12.5, x: 1200 });
  assert.equal(parsePercentOf('15 of 80'), null);
});
