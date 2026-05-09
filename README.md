# App Hub

App Hub is a lightweight collection of practical web tools for everyday work.

The goal of this website is to remove friction from small, repetitive tasks. Users should be able to open a tool, solve the problem quickly, and continue their workflow.

## Current Tools

- QR Code Generator: Build branded QR codes with color, shape, size, and optional logo controls.
- Word Counter: Count words and characters instantly and estimate reading time with a custom words-per-minute setting.

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

## Notes

- App metadata and categories are managed in src/lib/data/apps.ts.
- The home page renders featured and categorized tools from this shared data source.


## Personal Notes

- I made this to help my wife and friends. If you have any suggestions, please feel free to let me know.