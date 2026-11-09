<script lang="ts">
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import StarButton from '$lib/components/StarButton.svelte';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  import { toneOf, type HubApp } from '$lib/data/apps';

  let { app }: { app: HubApp } = $props();
</script>

<!-- The whole card is the link; the star sits above it so it stays its own button. -->
<article class="tool-card {toneOf(app.code)}">
  <div class="flex items-start justify-between">
    <span class="tool-icon"><ToolIcon code={app.code} size={26} /></span>
    <StarButton code={app.code} title={app.title} class="relative z-10 -mr-2 -mt-2" />
  </div>
  <h3 class="mt-5 text-lg font-bold">
    <a class="card-link" href={resolve(app.href as RouteId)}>{app.title}</a>
  </h3>
  <p class="mt-1 text-sm leading-6 text-muted">{app.tagline}</p>
  <span class="arrow" aria-hidden="true">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
  </span>
</article>

<style>
  .tool-card { position: relative; display: flex; flex-direction: column; height: 100%; padding: 20px; border: 1px solid var(--line); border-top: 4px solid var(--accent); border-radius: 16px; background: var(--surface); transition: transform 180ms, box-shadow 180ms; }
  .tool-card:hover, .tool-card:focus-within { transform: translateY(-3px); box-shadow: 0 14px 28px -16px var(--shadow), 0 2px 0 var(--accent-soft); }
  .tool-icon { display: flex; width: 48px; height: 48px; align-items: center; justify-content: center; border-radius: 13px; background: var(--accent-soft); color: var(--accent); }
  .card-link::after { content: ''; position: absolute; inset: 0; border-radius: 16px; }
  .card-link:focus-visible { outline: none; }
  .card-link:focus-visible::after { outline: 3px solid var(--accent); outline-offset: 3px; }
  .arrow { position: absolute; right: 18px; bottom: 18px; color: var(--accent); opacity: 0; transform: translateX(-6px); transition: opacity 180ms, transform 180ms; }
  .tool-card:hover .arrow, .tool-card:focus-within .arrow { opacity: 1; transform: none; }
</style>
