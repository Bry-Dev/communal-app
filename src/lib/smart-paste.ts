// Guesses which tools fit a pasted value, best match first.
import { parseLooseDate } from './date/calc.ts';
import { parsePercentOf } from './percent/calc.ts';

export type Suggestion = { code: string; reason: string };

const URL_PATTERN = /^(https?:\/\/|www\.)\S+$/i;
const XML_PATTERN = /^\s*(<\?xml[\s\S]*?\?>\s*)?<([A-Za-z_][\w:.-]*)[\s\S]*>\s*$/;

export function suggestTools(input: string): Suggestion[] {
  const text = input.trim();
  if (!text) return [];

  if (XML_PATTERN.test(text) && !/^<!doctype html|^<html/i.test(text)) {
    return [
      { code: 'xml', reason: 'Looks like XML' },
      { code: 'text', reason: 'Tidy it as plain text' }
    ];
  }

  if (parsePercentOf(text) || /^[-+]?[\d.,]+\s*%$/.test(text)) {
    return [{ code: 'percent', reason: 'Work out the percentage' }];
  }

  if (parseLooseDate(text)) {
    return [{ code: 'date', reason: 'Looks like a date' }];
  }

  if (URL_PATTERN.test(text)) {
    return [
      { code: 'qr', reason: 'Looks like a link' },
      { code: 'words', reason: 'Count its characters' }
    ];
  }

  const lines = text.split(/\r\n|\r|\n/);
  if (lines.length > 2) {
    return [
      { code: 'text', reason: `${lines.length} lines to tidy` },
      { code: 'words', reason: 'Count words' },
      { code: 'qr', reason: 'Share as a QR code' }
    ];
  }

  return [
    { code: 'words', reason: 'Count words' },
    { code: 'text', reason: 'Change case or spacing' },
    { code: 'qr', reason: 'Share as a QR code' }
  ];
}
