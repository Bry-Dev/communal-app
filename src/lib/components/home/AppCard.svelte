<script lang="ts">
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import type { HubApp } from '$lib/data/apps';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  export let app: HubApp;
</script>
<article class="tool-card flex h-full flex-col rounded-2xl border border-line bg-surface p-6 sm:p-7" class:writing={app.code === 'words' || app.code === 'text'}>
  <div class="mb-6 flex items-center justify-between gap-4">
    <span class="tool-icon flex h-14 w-14 items-center justify-center rounded-2xl"><ToolIcon code={app.code} /></span>
    <span class="category-label rounded-full px-3 py-1 text-xs font-medium">{app.category}</span>
  </div>
  <h3 class="text-xl font-bold">{app.title}</h3>
  <p class="mb-7 mt-3 max-w-md leading-7 text-muted">{app.description}</p>
  <div class="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
    <span class="flex items-center gap-1.5 text-xs text-muted"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>No sign-up needed</span>
    <a class="button" href={resolve(app.href as RouteId)} aria-label={'Open ' + app.title}>
      Open tool <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 5 7 7-7 7" /></svg>
    </a>
  </div>
</article>

<style>
  .tool-card { --tool-color: var(--accent); --tool-soft: var(--accent-soft); box-shadow: 0 2px 3px var(--shadow); transition: border-color 180ms, box-shadow 180ms; }
  .tool-card.writing { --tool-color: var(--secondary); --tool-soft: var(--secondary-soft); }
  .tool-card:hover, .tool-card:focus-within { border-color: var(--tool-color); box-shadow: 0 8px 24px var(--shadow); }
  .tool-icon { background: var(--tool-soft); color: var(--tool-color); }
  .category-label { color: var(--tool-color); background: var(--tool-soft); }
</style>
