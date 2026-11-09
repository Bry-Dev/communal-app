<script lang="ts">
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import AppCard from '$lib/components/home/AppCard.svelte';
  import Hero from '$lib/components/home/Header.svelte';
  import SuggestionCta from '$lib/components/home/SuggestionCta.svelte';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  import { findApp, liveApps, plannedApps, toneOf, type HubApp } from '$lib/data/apps';
  import { prefs } from '$lib/prefs.svelte';

  const categories = ['All', ...new Set(liveApps.map((app) => app.category))];
  let selectedCategory = $state('All');
  const filteredApps = $derived(liveApps.filter((app) => selectedCategory === 'All' || app.category === selectedCategory));

  const starred = $derived(prefs.favorites.map(findApp).filter((app): app is HubApp => app?.status === 'live'));
  const recent = $derived(prefs.recents.map(findApp).filter((app): app is HubApp => app?.status === 'live'));
</script>

<svelte:head>
  <title>App Hub — Free tools for everyday tasks</title>
  <meta name="description" content="Make a QR code, count your words, or tidy text with free, simple tools that work right in your browser. No account needed." />
</svelte:head>

<Hero />

{#if prefs.loaded && (starred.length || recent.length)}
  <section class="page-width pb-8" aria-label="Your tools">
    <div class="grid gap-3 sm:grid-cols-2">
      {#if starred.length}
        <div class="shelf">
          <h2 class="shelf-title">★ Starred</h2>
          <div class="flex flex-wrap gap-2">
            {#each starred as app (app.code)}
              <a class="chip {toneOf(app.code)}" href={resolve(app.href as RouteId)}><ToolIcon code={app.code} size={16} />{app.title}</a>
            {/each}
          </div>
        </div>
      {/if}
      {#if recent.length}
        <div class="shelf">
          <h2 class="shelf-title">
            Pick up where you left off
            <button type="button" class="ml-auto text-xs font-normal text-muted hover:text-ink hover:underline" onclick={() => prefs.clearRecents()}>Clear</button>
          </h2>
          <div class="flex flex-wrap gap-2">
            {#each recent as app (app.code)}
              <a class="chip {toneOf(app.code)}" href={resolve(app.href as RouteId)}><ToolIcon code={app.code} size={16} />{app.title}</a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}

<section id="apps" class="page-width pb-14" aria-labelledby="tools-title">
  <div class="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <h2 id="tools-title" class="flex items-baseline gap-2 text-2xl font-bold">Toolkit <span class="num text-sm font-normal text-muted">{String(liveApps.length).padStart(2, '0')}</span></h2>
    <div class="flex flex-wrap gap-1" role="group" aria-label="Filter tools by category">
      {#each categories as category}
        <button type="button" onclick={() => (selectedCategory = category)} aria-pressed={selectedCategory === category} class="filter">{category}</button>
      {/each}
    </div>
  </div>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each filteredApps as app (app.code)}<AppCard {app} />{/each}
  </div>
  <p class="sr-only" role="status">{filteredApps.length} tools shown</p>

  <div class="mt-12">
    <h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m14 7 3-3 3 3-3 3M17 4v6M3 21l9-9M8 12l4 4" /></svg>
      On the workbench
    </h2>
    <ul class="flex flex-wrap gap-2">
      {#each plannedApps as app (app.code)}
        <li class="planned" title={app.tagline}><ToolIcon code={app.code} size={16} />{app.title}</li>
      {/each}
    </ul>
  </div>
</section>

<SuggestionCta />

<style>
  .shelf { padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: color-mix(in srgb, var(--surface) 60%, transparent); }
  .shelf-title { display: flex; align-items: center; margin-bottom: 10px; font-size: 13px; font-weight: 600; color: var(--muted); }
  .chip { display: inline-flex; min-height: 36px; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 14px; font-weight: 600; transition: background 160ms, color 160ms; }
  .chip:hover { background: var(--accent); color: var(--on-accent); }
  .filter { min-height: 36px; padding: 4px 14px; border: 1px solid transparent; border-radius: 999px; color: var(--muted); font-size: 14px; font-weight: 500; transition: background 160ms, color 160ms, border-color 160ms; }
  .filter:hover { color: var(--ink); background: var(--soft); }
  .filter[aria-pressed='true'] { border-color: var(--ink); background: var(--ink); color: var(--canvas); }
  .planned { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px dashed var(--line); border-radius: 999px; color: var(--muted); font-size: 13px; }
</style>
