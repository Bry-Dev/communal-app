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
    description: 'Share links, Wi-Fi access, and contact details with a QR code. Pick a style, add a logo, and download.',
    status: 'live',
    category: 'Utilities',
    href: '/qr-code',
    eyebrow: 'Fast sharing',
    badge: 'Live now'
  },
  {
    code: 'words',
    title: 'Word Counter',
    description: 'Check the length of your next article, caption, or email. See word counts and reading time as you type.',
    status: 'live',
    category: 'Productivity',
    href: '/word-counter',
    eyebrow: 'Writing helper',
    badge: 'Live now'
  },
  {
    code: 'xml',
    title: 'XML Editor',
    description: 'Edit, validate, and format XML. Spot errors by line, explore the document tree, and download the result.',
    status: 'live',
    category: 'Utilities',
    href: '/xml-editor',
    eyebrow: 'Data helper',
    badge: 'Live now'
  },
  {
    code: 'text',
    title: 'Text Formatter',
    description: 'Change capitalization, tidy spacing, and remove duplicate lines. Preview, copy, or download your text.',
    status: 'live',
    category: 'Productivity',
    href: '/text-formatter',
    eyebrow: 'Workflow helper',
    badge: 'Live now'
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
