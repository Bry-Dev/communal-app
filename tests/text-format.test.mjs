import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultFormatOptions, formatText } from '../src/lib/text/format.ts';

const format = (text, options = {}) => formatText(text, { ...defaultFormatOptions, ...options });

test('original mode preserves whitespace, Unicode, and original line endings', () => {
  const original = '  Hello\t世界!\r\n\rSecond line  \n';
  assert.equal(format(original), original);
});

test('uppercase and lowercase handle accented characters', () => {
  assert.equal(format('Café ÉLAN', { letterCase: 'upper' }), 'CAFÉ ÉLAN');
  assert.equal(format('Café ÉLAN', { letterCase: 'lower' }), 'café élan');
});

test('title case keeps apostrophes inside words and handles Unicode and hyphens', () => {
  assert.equal(format("don't STOP — l’été déjà-vu", { letterCase: 'title' }), "Don't Stop — L’été Déjà-Vu");
});

test('sentence case handles quoted text, punctuation, numbers, and paragraphs', () => {
  assert.equal(format('"HELLO WORLD!" HOW ARE YOU?\n123 NEXT LINE.', { letterCase: 'sentence' }), '"Hello world!" How are you?\n123 Next line.');
});

test('space cleanup preserves line boundaries', () => {
  assert.equal(format('  one\t\t two  \r\n  three\u00a0  four ', { collapseSpaces: true }), ' one two \r\n three four ');
  assert.equal(format('  one\t\t two  \r\n  three  ', { collapseSpaces: true, trimLines: true }), 'one two\nthree');
});

test('duplicate removal follows case and whitespace transforms and keeps first occurrence', () => {
  assert.equal(format(' Apple \napple\nPear\n PEAR ', { letterCase: 'lower', trimLines: true, removeDuplicates: true }), 'apple\npear');
  assert.equal(format('Apple\napple\nApple', { removeDuplicates: true }), 'Apple\napple');
});

test('duplicate removal keeps paragraph spacing unless blank line removal is selected', () => {
  assert.equal(format('one\n\ntwo\n\none', { removeDuplicates: true }), 'one\n\ntwo\n');
  assert.equal(format('one\n  \ntwo\n\none', { removeDuplicates: true, removeEmptyLines: true }), 'one\ntwo');
});

test('joining lines combines cleanup into a single paragraph', () => {
  assert.equal(format('  hello   world\r\n\r\nnext\rlast  ', { trimLines: true, collapseSpaces: true, removeEmptyLines: true, joinLines: true }), 'hello world next last');
});

test('empty and whitespace-only input remain safe for every transformation', () => {
  for (const letterCase of ['unchanged', 'upper', 'lower', 'title', 'sentence']) {
    assert.equal(format('', { letterCase, trimLines: true, collapseSpaces: true, removeDuplicates: true, removeEmptyLines: true, joinLines: true }), '');
  }
  assert.equal(format(' \t\n  ', { trimLines: true, removeEmptyLines: true }), '');
});
