import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  charSets,
  clampLength,
  defaultPasswordOptions,
  entropyBits,
  generatePassword,
  secureRandomInt,
  selectedPools,
  strengthOf
} from '../src/lib/password/generate.ts';

const opts = (overrides) => ({ ...defaultPasswordOptions, ...overrides });

test('generates the requested length', () => {
  for (const length of [4, 16, 64, 128]) assert.equal(generatePassword(opts({ length })).length, length);
});

test('includes at least one character from every selected set', () => {
  for (let i = 0; i < 200; i++) {
    const password = generatePassword(opts({ length: 4 }));
    assert.match(password, /[a-z]/);
    assert.match(password, /[A-Z]/);
    assert.match(password, /[0-9]/);
    assert.ok([...password].some((c) => charSets.symbols.includes(c)), password);
  }
});

test('uses only selected sets', () => {
  const password = generatePassword(opts({ length: 64, upper: false, symbols: false }));
  assert.match(password, /^[a-z0-9]+$/);
});

test('can leave out ambiguous characters', () => {
  for (let i = 0; i < 50; i++) {
    assert.doesNotMatch(generatePassword(opts({ length: 128, avoidAmbiguous: true })), /[Il1O0o]/);
  }
});

test('returns an empty string when no set is selected', () => {
  assert.equal(generatePassword(opts({ lower: false, upper: false, digits: false, symbols: false })), '');
});

test('clamps length to the allowed range and to the number of sets', () => {
  assert.equal(clampLength(1), 4);
  assert.equal(clampLength(500), 128);
  assert.equal(clampLength(Number.NaN), 16);
  assert.equal(clampLength(4, 4), 4);
});

test('random integers stay in range and cover every value', () => {
  const seen = new Set();
  for (let i = 0; i < 2000; i++) {
    const value = secureRandomInt(7);
    assert.ok(value >= 0 && value < 7);
    seen.add(value);
  }
  assert.equal(seen.size, 7);
  assert.throws(() => secureRandomInt(0), RangeError);
});

test('passwords differ between runs', () => {
  const results = new Set(Array.from({ length: 50 }, () => generatePassword(defaultPasswordOptions)));
  assert.equal(results.size, 50);
});

test('entropy and strength labels', () => {
  // 16 characters from 26+26+10+24 = 86 options ≈ 102 bits.
  assert.equal(entropyBits(defaultPasswordOptions), 102);
  assert.equal(strengthOf(102).label, 'Very strong');
  assert.equal(strengthOf(entropyBits(opts({ length: 8, upper: false, symbols: false }))).label, 'Weak');
  assert.equal(selectedPools(opts({ avoidAmbiguous: true }))[2], '23456789');
});
