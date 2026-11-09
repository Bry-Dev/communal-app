import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suggestTools } from '../src/lib/smart-paste.ts';

const first = (input) => suggestTools(input)[0]?.code;

test('empty input has no suggestions', () => {
  assert.deepEqual(suggestTools('   '), []);
});

test('XML goes to the XML editor', () => {
  assert.equal(first('<note><to>Ann</to></note>'), 'xml');
  assert.equal(first('<?xml version="1.0"?>\n<a b="1"/>'), 'xml');
});

test('HTML pages are not treated as XML', () => {
  assert.notEqual(first('<!DOCTYPE html><html></html>'), 'xml');
});

test('links go to the QR generator', () => {
  assert.equal(first('https://example.com/menu'), 'qr');
  assert.equal(first('www.example.com'), 'qr');
});

test('a sentence goes to the word counter', () => {
  assert.equal(first('The quick brown fox.'), 'words');
});

test('several lines go to the text formatter', () => {
  assert.equal(first('milk\neggs\nmilk\nbread'), 'text');
});

test('percentages go to the percentage calculator', () => {
  assert.equal(first('15% of 80'), 'percent');
  assert.equal(first('12.5%'), 'percent');
});

test('dates go to the date calculator', () => {
  assert.equal(first('2026-12-25'), 'date');
  assert.equal(first('25/12/2026'), 'date');
});
