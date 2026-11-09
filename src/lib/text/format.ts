export const letterCases = [
  { value: 'unchanged', label: 'Original' },
  { value: 'upper', label: 'UPPERCASE' },
  { value: 'lower', label: 'lowercase' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' }
] as const;

export type LetterCase = (typeof letterCases)[number]['value'];

export type FormatOptions = {
  letterCase: LetterCase;
  trimLines: boolean;
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  removeDuplicates: boolean;
  joinLines: boolean;
};

export const defaultFormatOptions: FormatOptions = {
  letterCase: 'unchanged',
  trimLines: false,
  collapseSpaces: false,
  removeEmptyLines: false,
  removeDuplicates: false,
  joinLines: false
};

export function formatText(input: string, options: FormatOptions): string {
  let result = input;
  switch (options.letterCase) {
    case 'upper': result = result.toUpperCase(); break;
    case 'lower': result = result.toLowerCase(); break;
    case 'title':
      result = result.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}\p{N}]+)*/gu,
        (word) => word.replace(/\p{L}/u, (letter) => letter.toUpperCase()));
      break;
    case 'sentence':
      result = result.toLowerCase().replace(/(^|[.!?]["'”’)]*\s+|\n+)([^\p{L}]*)(\p{L})/gu,
        (_, boundary: string, prefix: string, letter: string) => boundary + prefix + letter.toUpperCase());
      break;
  }

  if (options.collapseSpaces) result = result.replace(/[^\S\r\n]+/gu, ' ');
  if (options.trimLines || options.removeEmptyLines || options.removeDuplicates || options.joinLines) {
    let lines = result.split(/\r\n|\r|\n/);
    if (options.trimLines) lines = lines.map((line) => line.trim());
    if (options.removeEmptyLines) lines = lines.filter((line) => line.trim().length > 0);
    if (options.removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter((line) => {
        // Keep paragraph spacing unless removing empty lines is explicitly selected.
        if (!line.trim()) return true;
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      });
    }
    result = lines.join(options.joinLines ? ' ' : '\n');
  }
  return result;
}
