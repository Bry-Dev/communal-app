# App Hub

App Hub is a lightweight collection of practical web tools for everyday work.

The goal of this website is to remove friction from small, repetitive tasks. Users should be able to open a tool, solve the problem quickly, and continue their workflow.

## Current Tools

- QR Code Generator: Create codes for links/text, Wi-Fi (WPA/WPA2 Personal, WEP, open and hidden networks), email, phone, SMS, and vCard contacts. Choose from nine collapsible style presets, customize colors and logos, and download a PNG. Details stay in the browser; switching QR types preserves each type's fields for the current visit.
- Word Counter: Count words and characters instantly and estimate reading time with a custom words-per-minute setting.
- Text Formatter: Change capitalization, clean up whitespace, remove duplicate lines, and copy or download the result. Run its focused tests with `npm run test:text` (Node.js 22.18+).
- XML Editor: Edit any XML document with line numbers, live well-formedness checks (with error line and column), formatting/minifying, a collapsible document tree, and file open/download. Everything stays in the browser.

## Product Direction

- Keep tools fast and focused.
- Favor simple, clean interfaces.
- Launch useful utilities first, then expand with new app ideas.

## Tech Stack

- SvelteKit
- TypeScript
- Tailwind CSS
- Vite

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser at the local URL shown in the terminal.

## Production Build

Build the app:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## QR Content Checks

Run payload and QR rendering tests with Node.js 22.18 or later:

```bash
npm run test:qr
```

These cover Wi-Fi escaping, URI encoding, vCard field escaping and line folding, validation, and rendering with the QR library. Camera scanning and SMS message prefilling should also be checked on the intended phones and scanner apps.

## Notes

- App metadata and categories are managed in src/lib/data/apps.ts.
- The home page renders featured and categorized tools from this shared data source.


## Personal Notes

- I made this to help my wife and friends. If you have any suggestions, please feel free to let me know.
