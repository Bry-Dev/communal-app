import assert from 'node:assert/strict';
import test from 'node:test';
import { describeParseError, formatXml, locateXmlError, minifyXml, tokenizeXml } from '../src/lib/xml/format.ts';

test('formats nested elements with text-only elements inline', () => {
  const input = '<?xml version="1.0"?><root><item id="1"><name>A</name><empty/></item><none></none></root>';
  assert.equal(
    formatXml(input),
    [
      '<?xml version="1.0"?>',
      '<root>',
      '  <item id="1">',
      '    <name>A</name>',
      '    <empty/>',
      '  </item>',
      '  <none></none>',
      '</root>'
    ].join('\n')
  );
});

test('keeps comments, CDATA, doctype, and quoted > in attributes intact', () => {
  const input = '<!DOCTYPE note [<!ENTITY a "b">]><note x="a>b"><!-- hi --><![CDATA[<raw>]]></note>';
  assert.equal(
    formatXml(input, '\t'),
    ['<!DOCTYPE note [<!ENTITY a "b">]>', '<note x="a>b">', '\t<!-- hi -->', '\t<![CDATA[<raw>]]>', '</note>'].join('\n')
  );
});

test('minify removes whitespace between tags but keeps text', () => {
  assert.equal(minifyXml('<a>\n  <b> hi there </b>\n  <c/>\n</a>\n'), '<a><b> hi there </b><c/></a>');
});

test('format and minify round-trip', () => {
  const input = '<a><b>1</b><c><d/></c></a>';
  assert.equal(minifyXml(formatXml(input)), input);
});

test('tokenizer classifies tags', () => {
  assert.deepEqual(
    tokenizeXml('<a><b/></a>').map((t) => t.type),
    ['open', 'selfClosing', 'close']
  );
});

test('parses Chromium and Firefox parser errors', () => {
  assert.deepEqual(
    describeParseError('This page contains the following errors:error on line 3 at column 5: Opening and ending tag mismatch: a line 1 and b\nBelow is a rendering of the page up to the first error.'),
    { line: 3, column: 5, message: 'Opening and ending tag mismatch: a line 1 and b' }
  );
  assert.deepEqual(
    describeParseError('XML Parsing Error: mismatched tag. Expected: </a>.\nLocation: about:blank\nLine Number 2, Column 3:'),
    { line: 2, column: 3, message: 'mismatched tag. Expected: </a>.' }
  );
});

test('locates an unclosed child instead of the parent closing tag', () => {
  const xml = '<library>\n  <book>\n    <title>A</title>\n    <author>B\n  </book>\n</library>';
  const loc = locateXmlError(xml, { line: 5, column: 9, message: 'Unexpected closing tag: book != author' });
  assert.equal(xml.slice(loc.start, loc.end), '<author>');
  assert.equal(loc.line, 4);
  assert.equal(loc.hint, '<author> is never closed.');
});

test('locates a misspelled closing tag', () => {
  const xml = '<library>\n  <book>\n    <author>B</autor>\n  </book>\n</library>';
  const loc = locateXmlError(xml, { line: 3, column: 21, message: 'Unexpected closing tag' });
  assert.equal(xml.slice(loc.start, loc.end), '</autor>');
  assert.equal(loc.line, 3);
});

test('falls back to the tag at the reported position for other errors', () => {
  const xml = '<library>\n  <book>\n    <title id=1>A</title>\n  </book>\n</library>';
  const loc = locateXmlError(xml, { line: 3, column: 15, message: 'Unexpected token: 1' });
  assert.equal(xml.slice(loc.start, loc.end), '<title id=1>');
});
