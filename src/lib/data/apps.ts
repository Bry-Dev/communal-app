import type { RouteId } from '$app/types';

export type AppStatus = 'live' | 'coming-soon';
export type AppCategory = 'Everyday' | 'Writing' | 'Data' | 'Images & PDF';

export type HubApp = {
  code: string;
  title: string;
  /** About six words. Shown on cards and in search. */
  tagline: string;
  status: AppStatus;
  category: AppCategory;
  href: RouteId | '#';
  /** Extra words people might search for. */
  keywords?: string;
};

export const apps: HubApp[] = [
  { code: 'qr', title: 'QR Code', tagline: 'Links, Wi-Fi and contacts as QR', status: 'live', category: 'Everyday', href: '/qr-code', keywords: 'qr barcode wifi vcard contact link share png' },
  { code: 'words', title: 'Word Counter', tagline: 'Words, characters, reading time', status: 'live', category: 'Writing', href: '/word-counter', keywords: 'count length characters essay caption reading time' },
  { code: 'text', title: 'Text Formatter', tagline: 'Fix case, spacing and duplicates', status: 'live', category: 'Writing', href: '/text-formatter', keywords: 'uppercase lowercase title case clean spaces lines duplicate' },
  { code: 'password', title: 'Password Generator', tagline: 'Strong passwords in one click', status: 'live', category: 'Everyday', href: '/password-generator', keywords: 'password passcode random secure strong generate login' },
  { code: 'date', title: 'Date Calculator', tagline: 'Days between dates, ages, deadlines', status: 'live', category: 'Everyday', href: '/date-calculator', keywords: 'date days between age birthday add subtract weeks months deadline countdown weekdays business' },
  { code: 'percent', title: 'Percentage Calculator', tagline: 'Discounts, tips and changes', status: 'live', category: 'Everyday', href: '/percentage-calculator', keywords: 'percent percentage discount tip tax increase decrease change sale off' },
  { code: 'xml', title: 'XML Editor', tagline: 'Validate, format and explore XML', status: 'live', category: 'Data', href: '/xml-editor', keywords: 'xml validate pretty print minify tree' },

  { code: 'notes', title: 'Notes Cleaner', tagline: 'Rough bullets into tidy notes', status: 'coming-soon', category: 'Writing', href: '#' },
  { code: 'compare', title: 'Text Compare', tagline: 'Spot what changed between two texts', status: 'coming-soon', category: 'Writing', href: '#' },
  { code: 'picker', title: 'Name Picker', tagline: 'Pick someone at random, fairly', status: 'coming-soon', category: 'Everyday', href: '#' },
  { code: 'image', title: 'Image Resizer', tagline: 'Shrink photos before sending', status: 'coming-soon', category: 'Images & PDF', href: '#' },
  { code: 'pdf', title: 'Images to PDF', tagline: 'Combine photos into one PDF', status: 'coming-soon', category: 'Images & PDF', href: '#' },
  { code: 'json', title: 'JSON Formatter', tagline: 'Validate and pretty-print JSON', status: 'coming-soon', category: 'Data', href: '#' }
];

export const liveApps = apps.filter((app) => app.status === 'live');
export const plannedApps = apps.filter((app) => app.status === 'coming-soon');

/** CSS class that scopes the accent colour to a tool. */
export function toneOf(code: string): string {
  return ['qr', 'words', 'xml', 'text', 'password', 'date', 'percent'].includes(code) ? `tone-${code}` : 'tone-plain';
}

export function findApp(code: string): HubApp | undefined {
  return apps.find((app) => app.code === code);
}

export function searchApps(query: string, pool: HubApp[] = liveApps): HubApp[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return pool;
  return pool.filter((app) => {
    const haystack = `${app.title} ${app.tagline} ${app.category} ${app.keywords ?? ''}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
