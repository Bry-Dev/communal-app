export type XmlTokenType = 'declaration' | 'comment' | 'cdata' | 'doctype' | 'open' | 'close' | 'selfClosing' | 'text';

export type XmlToken = { type: XmlTokenType; value: string; start: number };

function readUntil(xml: string, start: number, terminator: string): number {
  const end = xml.indexOf(terminator, start);
  return end === -1 ? xml.length : end + terminator.length;
}

function readTag(xml: string, start: number): number {
  let quote = '';
  for (let i = start + 1; i < xml.length; i++) {
    const char = xml[i];
    if (quote) {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '>') {
      return i + 1;
    }
  }
  return xml.length;
}

function readDoctype(xml: string, start: number): number {
  let depth = 0;
  let quote = '';
  for (let i = start + 2; i < xml.length; i++) {
    const char = xml[i];
    if (quote) {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
    } else if (char === '>' && depth <= 0) {
      return i + 1;
    }
  }
  return xml.length;
}

/** Splits XML source into a flat list of markup and text tokens. Does not validate. */
export function tokenizeXml(xml: string): XmlToken[] {
  const tokens: XmlToken[] = [];
  let i = 0;

  while (i < xml.length) {
    if (xml[i] !== '<') {
      const next = xml.indexOf('<', i);
      const end = next === -1 ? xml.length : next;
      tokens.push({ type: 'text', value: xml.slice(i, end), start: i });
      i = end;
      continue;
    }

    let end: number;
    let type: XmlTokenType;

    if (xml.startsWith('<!--', i)) {
      end = readUntil(xml, i + 4, '-->');
      type = 'comment';
    } else if (xml.startsWith('<![CDATA[', i)) {
      end = readUntil(xml, i + 9, ']]>');
      type = 'cdata';
    } else if (xml.startsWith('<?', i)) {
      end = readUntil(xml, i + 2, '?>');
      type = 'declaration';
    } else if (xml.startsWith('<!', i)) {
      end = readDoctype(xml, i);
      type = 'doctype';
    } else if (xml.startsWith('</', i)) {
      end = readTag(xml, i);
      type = 'close';
    } else {
      end = readTag(xml, i);
      type = xml.slice(i, end).endsWith('/>') ? 'selfClosing' : 'open';
    }

    tokens.push({ type, value: xml.slice(i, end), start: i });
    i = end;
  }

  return tokens;
}

/** Pretty-prints XML. Whitespace-only text between tags is dropped; text-only elements stay on one line. */
export function formatXml(xml: string, indent = '  '): string {
  const tokens = tokenizeXml(xml).filter((token) => token.type !== 'text' || token.value.trim() !== '');
  const lines: string[] = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const pad = indent.repeat(depth);

    if (token.type === 'open') {
      const text = tokens[i + 1];
      const close = tokens[i + 2];
      if (text?.type === 'text' && close?.type === 'close') {
        lines.push(pad + token.value + text.value + close.value);
        i += 2;
      } else if (tokens[i + 1]?.type === 'close') {
        lines.push(pad + token.value + tokens[i + 1].value);
        i += 1;
      } else {
        lines.push(pad + token.value);
        depth++;
      }
    } else if (token.type === 'close') {
      depth = Math.max(0, depth - 1);
      lines.push(indent.repeat(depth) + token.value);
    } else if (token.type === 'text') {
      lines.push(pad + token.value.trim());
    } else {
      lines.push(pad + token.value);
    }
  }

  return lines.join('\n');
}

/** Removes whitespace-only text between tags. Text content, comments, and CDATA are kept as-is. */
export function minifyXml(xml: string): string {
  return tokenizeXml(xml)
    .filter((token) => token.type !== 'text' || token.value.trim() !== '')
    .map((token) => token.value)
    .join('');
}

export type XmlParseError = { message: string; line?: number; column?: number };

/** Pulls a readable message and line/column out of a browser <parsererror> text (Chromium, WebKit, or Firefox). */
export function describeParseError(raw: string): XmlParseError {
  const text = raw.replace(/\s+/g, ' ').trim();
  const chromium = text.match(/error on line (\d+) at column (\d+):\s*(.*?)(?:Below is a rendering.*)?$/i);
  if (chromium) {
    return { line: Number(chromium[1]), column: Number(chromium[2]), message: chromium[3].trim() };
  }

  const firefox = text.match(/XML Parsing Error:\s*(.*?)\s*Location:.*?Line Number (\d+), Column (\d+)/i);
  if (firefox) {
    return { line: Number(firefox[2]), column: Number(firefox[3]), message: firefox[1].trim() };
  }

  return { message: text || 'The XML could not be parsed.' };
}

export type XmlErrorLocation = { start: number; end: number; line: number; column: number; hint?: string };

function tagName(tag: string): string {
  return tag.replace(/^<\/?/, '').split(/[\s/>]/)[0];
}

function lineColumnToOffset(xml: string, line: number, column: number): number {
  let offset = 0;
  for (let current = 1; current < line; current++) {
    const next = xml.indexOf('\n', offset);
    if (next === -1) return xml.length;
    offset = next + 1;
  }
  const lineEnd = xml.indexOf('\n', offset);
  return Math.min(offset + Math.max(column - 1, 0), lineEnd === -1 ? xml.length : lineEnd);
}

function offsetToLineColumn(xml: string, offset: number): { line: number; column: number } {
  const before = xml.slice(0, offset);
  const line = before.split('\n').length;
  return { line, column: offset - before.lastIndexOf('\n') };
}

function located(xml: string, start: number, end: number, hint?: string): XmlErrorLocation {
  return { start, end, ...offsetToLineColumn(xml, start), hint };
}

/** Finds a mismatched or unclosed tag by tracking open elements. Returns the culprit tag and where the parser would notice it. */
function findStructuralError(xml: string, tokens: XmlToken[]): { culprit: XmlErrorLocation; detectedAt: number } | undefined {
  const stack: XmlToken[] = [];
  for (const token of tokens) {
    if (token.type === 'open') {
      stack.push(token);
    } else if (token.type === 'close') {
      const name = tagName(token.value);
      const top = stack[stack.length - 1];
      if (top && tagName(top.value) === name) {
        stack.pop();
        continue;
      }
      const detectedAt = token.start + token.value.length;
      if (top && stack.some((open) => tagName(open.value) === name)) {
        const culprit = located(xml, top.start, top.start + top.value.length, `<${tagName(top.value)}> is never closed.`);
        return { culprit, detectedAt };
      }
      const hint = top ? `Expected </${tagName(top.value)}>.` : 'There is no matching opening tag.';
      return { culprit: located(xml, token.start, detectedAt, hint), detectedAt };
    }
  }
  const unclosed = stack[stack.length - 1];
  if (unclosed) {
    const culprit = located(xml, unclosed.start, unclosed.start + unclosed.value.length, `<${tagName(unclosed.value)}> is never closed.`);
    return { culprit, detectedAt: xml.length };
  }
}

/** Pins a parse error to the tag (or text) that caused it, instead of where the parser happened to notice it. */
export function locateXmlError(xml: string, error: XmlParseError): XmlErrorLocation | undefined {
  const tokens = tokenizeXml(xml);
  const structural = findStructuralError(xml, tokens);
  if (!error.line) return structural?.culprit;

  const offset = lineColumnToOffset(xml, error.line, error.column ?? 1);
  if (structural && structural.detectedAt <= offset + 1) return structural.culprit;

  const token = tokens.find((t) => offset >= t.start && offset < t.start + t.value.length) ?? tokens.findLast((t) => t.start <= offset);
  if (!token) return located(xml, offset, offset);

  let start = token.start;
  let end = token.start + token.value.length;
  if (token.type === 'text') {
    start += token.value.length - token.value.trimStart().length;
    end -= token.value.length - token.value.trimEnd().length;
    if (end <= start) return located(xml, offset, offset);
  }
  return located(xml, start, end);
}
