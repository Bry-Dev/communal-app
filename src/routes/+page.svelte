<script lang="ts">
  import AppCard from '$lib/components/home/AppCard.svelte';
  import Hero from '$lib/components/home/Header.svelte';
  import SuggestionCta from '$lib/components/home/SuggestionCta.svelte';
  import ValueProps from '$lib/components/home/ValueProps.svelte';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  import { apps } from '$lib/data/apps';
  const liveApps = apps.filter((app) => app.status === 'live');
  const plannedApps = apps.filter((app) => app.status === 'coming-soon');
  const categories = ['All tools', ...new Set(liveApps.map((app) => app.category))];
  let selectedCategory = 'All tools';
  $: filteredApps = liveApps.filter((app) => selectedCategory === 'All tools' || app.category === selectedCategory);
</script>
<svelte:head>
  <title>App Hub — Free tools for everyday tasks</title>
  <meta name="description" content="Make a QR code or count your words with free, simple tools that work right in your browser. No account needed." />
</svelte:head>
<Hero />
<section id="apps" class="page-width pb-14" aria-labelledby="tools-title">
  <div class="mb-6 flex flex-col justify-between gap-5 border-t border-line pt-7 sm:flex-row sm:items-center">
    <h2 id="tools-title" class="flex items-center gap-3 text-xl font-bold">Your everyday toolkit <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-soft px-2 font-sans text-xs font-medium text-muted">{liveApps.length}<span class="sr-only"> tools</span></span></h2>
    <div class="tool-filters flex flex-wrap gap-1" role="group" aria-label="Filter tools by category">
      {#each categories as category}
        <button type="button" on:click={() => selectedCategory = category} aria-pressed={selectedCategory === category} class="filter-button min-h-11 rounded-full px-4 py-2 text-sm font-medium">{category}</button>
      {/each}
    </div>
  </div>
  <div class="grid gap-5 md:grid-cols-2">
    {#each filteredApps as app}<AppCard {app} />{/each}
  </div>
  <p class="sr-only" role="status">{filteredApps.length} tools shown</p>
  <div class="mt-9">
    <h2 class="mb-4 text-sm font-medium text-muted">On the workbench</h2>
    <div class="grid gap-4 md:grid-cols-2">
      {#each plannedApps as app}
        <div class="flex items-center gap-4 rounded-xl border border-dashed border-line px-5 py-4">
          <span class="text-muted"><ToolIcon code={app.code} /></span>
          <div class="flex-1"><h3 class="text-sm font-medium">{app.title}</h3><p class="mt-1 text-sm text-muted">{app.eyebrow}</p></div>
          <span class="text-xs text-muted">Coming soon</span>
        </div>
      {/each}
    </div>
  </div>
</section>
<ValueProps />
<SuggestionCta />
<style>
  .tool-filters { align-self: flex-start; border: 1px solid var(--line); border-radius: 28px; padding: 4px; background: var(--soft); }
  .filter-button { color: var(--muted); transition: background 160ms, color 160ms, box-shadow 160ms; }
  .filter-button:hover { background: var(--soft); color: var(--ink); }
  .filter-button[aria-pressed='true'] { background: var(--surface); color: var(--accent); box-shadow: 0 1px 4px var(--shadow); }
  @media (max-width: 359px) { .filter-button { padding-inline: 12px; font-size: 12px; } }
</style>
