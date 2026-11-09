# App Hub

Free, practical browser tools for everyday tasks. Open a tool, get something done, and get on with your day.

I made this to help my wife and friends. Suggestions for useful new tools are always welcome.

## Available tools

| Tool | Features |
| --- | --- |
| **QR Code Generator** | Create codes for links/text, Wi-Fi, email, phone calls, SMS, and vCard contacts. Choose from nine collapsible presets, customize colors and shapes, add a logo, and download a PNG. |
| **Word Counter** | Count words and characters, including characters without spaces. Estimate reading time with an adjustable reading speed. |
| **Text Formatter** | Switch between uppercase, lowercase, title case, and sentence case. Trim line edges, collapse repeated spaces, remove empty or duplicate lines, and join lines into a paragraph. Compare the original with a live result, then copy or download a `.txt` file. |
| **Password Generator** | Create random passwords (4–128 characters) from uppercase, lowercase, numbers, and symbols, with at least one of each selected type. Optionally avoid look-alike characters. Shows estimated strength; copy with Ctrl+Enter. Uses the browser's cryptographic random generator and never stores passwords. |
| **Date Calculator** | Count the days between two dates (with weeks, weekdays and weekend days, optionally including the end date); add or subtract days, weeks, months or years; and work out an age with the next birthday. Typed dates are read day-first (9/11/2026 is 9 November). |
| **Percentage Calculator** | Answer four everyday questions as you type: X% of Y, X is what % of Y, percentage change, and an amount with a percentage taken off or added on. Accepts numbers like `$1,200` and `15%`. |
| **XML Editor** | Edit XML with line numbers, check well-formedness and error locations, format or minify, explore a collapsible document tree, and open or download XML files. |

**Coming soon:** Notes Cleaner, Text Compare, Name Picker, Image Resizer, Images to PDF, and JSON Formatter.

## Features and privacy

- Light, dark, and system themes with a saved preference.
- Responsive layouts and keyboard-accessible controls.
- Tools run in your browser without an account or paid API.
- Text, Wi-Fi details, contact information, and XML contents are processed locally rather than uploaded or saved by the app.
- QR type fields are retained while switching types during the current page visit. Wi-Fi supports WPA/WPA2 Personal, WEP, open networks, and hidden networks.
- Text Formatter preserves your original input; formatting options affect the result only.

## Tech stack

Svelte 5, SvelteKit 2, TypeScript, Tailwind CSS 3, and Vite. The site is prerendered with `@sveltejs/adapter-static`; QR generation uses `@svelte-put/qr`.

## Local development

Use **Node.js 22.18 or later** and npm. The focused tests import TypeScript directly using Node's built-in support.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. The development server uses the root path `/`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run check` | Sync SvelteKit and check Svelte/TypeScript diagnostics. |
| `npm run check:watch` | Watch for Svelte/TypeScript issues while editing. |
| `npm run test:qr` | Run QR payload and rendering tests. |
| `npm run test:text` | Run text-formatting tests. |
| `npm run test:password` | Run password generator tests. |
| `node --test tests/date-calc.test.mjs tests/percent-calc.test.mjs` | Run date and percentage tests. |
| `npm test` | Run all tests. |
| `node --test tests/xml-format.test.mjs` | Run XML-formatting tests. |
| `npm run build` | Generate the static production site in `build/`. |
| `npm run preview` | Preview an existing production build locally. |
| `npm run deploy` | Build and publish `build/` through `gh-pages`. |

Run the checks relevant to a change. Small copy or styling edits normally do not need a full build or test run.

### Test coverage

- **QR:** Wi-Fi escaping, email/SMS URI encoding, vCard escaping and line folding, required-field validation, payload length, and QR rendering.
- **Text:** Unicode capitalization, sentence boundaries, whitespace and line handling, duplicate removal, and preserving the original when formatting is disabled.
- **XML:** Formatting helpers; browser-based validation and editing should also be checked in the app.

QR camera behavior and SMS message prefilling can vary by phone and scanner app. Automated encoding tests do not replace checking a generated code on the intended device.

## Production and deployment

Production uses the `/communal-app` base path configured in [svelte.config.js](svelte.config.js). After building and starting the preview server, open `/communal-app/` on the printed local origin.

```bash
npm run build
npm run preview
```

To publish to GitHub Pages, use `npm run deploy` with Git credentials and repository access configured. Update `kit.paths.base` if hosting under a different path.

## Project structure

```text
src/routes/                 Pages for the homepage and each tool
src/lib/components/         Shared UI and homepage components
src/lib/data/apps.ts        Tool metadata, availability, categories, and links
src/lib/qr/content.ts       QR payload creation and validation
src/lib/text/format.ts      Text transformations
src/lib/xml/format.ts       XML formatting helpers
src/app.css                 Shared styles and theme tokens
tests/                      Focused tool tests
```

To add a tool, create its route in `src/routes/` and register it in [src/lib/data/apps.ts](src/lib/data/apps.ts). The homepage derives its available tools and category filters from that data.
