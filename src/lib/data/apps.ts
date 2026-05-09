import type { RouteId } from '$app/types';

export type AppStatus = 'live' | 'coming-soon';
export type AppCategory = 'Utilities' | 'Productivity' | 'Business' | 'Experiments';

export type HubApp = {
  code: string;
  title: string;
  description: string;
  status: AppStatus;
  category: AppCategory;
  href: RouteId | '#';
  eyebrow: string;
  badge?: string;
};

export const apps: HubApp[] = [
  {
    code: 'qr',
    title: 'QR Code Generator',
    description: 'Create clean, downloadable QR codes for links, contact cards, menus, and quick sharing.',
    status: 'live',
    category: 'Utilities',
    href: '/qr-code',
    eyebrow: 'Fast sharing',
    badge: 'Live now'
  },
  {
    code: 'words',
    title: 'Word Counter',
    description: 'Count words and characters instantly, and estimate reading time with a custom WPM setting.',
    status: 'live',
    category: 'Productivity',
    href: '/word-counter',
    eyebrow: 'Writing helper',
    badge: 'Live now'
  },
  {
    code: 'text',
    title: 'Text Formatter',
    description: 'Clean pasted text, fix spacing, and transform content into cleaner output for docs or chat.',
    status: 'coming-soon',
    category: 'Productivity',
    href: '#',
    eyebrow: 'Workflow helper',
    badge: 'Coming soon'
  },
  {
    code: 'notes',
    title: 'Quick Notes Cleaner',
    description: 'Turn rough bullet points into cleaner notes you can paste into email, docs, or tickets.',
    status: 'coming-soon',
    category: 'Experiments',
    href: '#',
    eyebrow: 'Simple polish',
    badge: 'Concept'
  }
];

export const categories: Array<'All' | AppCategory> = [
  'All',
  'Utilities',
  'Productivity',
  'Business',
  'Experiments'
];