// Password generation using the browser's cryptographic random source.
export const charSets = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/'
} as const;

export type CharSetKey = keyof typeof charSets;

export type PasswordOptions = Record<CharSetKey, boolean> & {
  length: number;
  /** Leaves out characters that are easy to misread, like I, l, 1, O and 0. */
  avoidAmbiguous: boolean;
};

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;
const AMBIGUOUS = new Set('Il1O0o');

export const defaultPasswordOptions: PasswordOptions = {
  length: 16,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false
};

/** Returns a uniformly random integer in [0, max), using rejection sampling to avoid bias. */
export function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > 2 ** 32) throw new RangeError('max must be a positive integer up to 2^32');
  const limit = Math.floor(2 ** 32 / max) * max;
  const buffer = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % max;
  }
}

/** The characters available for each selected set. */
export function selectedPools(options: PasswordOptions): string[] {
  return (Object.keys(charSets) as CharSetKey[])
    .filter((key) => options[key])
    .map((key) => [...charSets[key]].filter((c) => !options.avoidAmbiguous || !AMBIGUOUS.has(c)).join(''))
    .filter(Boolean);
}

export function clampLength(length: number, poolCount = 1): number {
  const value = Number.isFinite(length) ? Math.round(length) : defaultPasswordOptions.length;
  return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, poolCount, value));
}

/**
 * Builds a password with at least one character from every selected set,
 * then shuffles it so those guaranteed characters are not in predictable positions.
 */
export function generatePassword(options: PasswordOptions, randomInt: (max: number) => number = secureRandomInt): string {
  const pools = selectedPools(options);
  if (!pools.length) return '';
  const length = clampLength(options.length, pools.length);
  const all = pools.join('');

  const chars = pools.map((pool) => pool[randomInt(pool.length)]);
  while (chars.length < length) chars.push(all[randomInt(all.length)]);

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** Approximate strength in bits: length × log2(number of possible characters). */
export function entropyBits(options: PasswordOptions): number {
  const pools = selectedPools(options);
  const size = pools.reduce((total, pool) => total + pool.length, 0);
  if (!size) return 0;
  return Math.floor(clampLength(options.length, pools.length) * Math.log2(size));
}

export type Strength = { level: 0 | 1 | 2 | 3; label: string };

export function strengthOf(bits: number): Strength {
  if (bits < 45) return { level: 0, label: 'Weak' };
  if (bits < 65) return { level: 1, label: 'Fair' };
  if (bits < 90) return { level: 2, label: 'Strong' };
  return { level: 3, label: 'Very strong' };
}

export type CharKind = 'letter' | 'digit' | 'symbol';

export function kindOf(char: string): CharKind {
  if (/[0-9]/.test(char)) return 'digit';
  if (/[A-Za-z]/.test(char)) return 'letter';
  return 'symbol';
}
