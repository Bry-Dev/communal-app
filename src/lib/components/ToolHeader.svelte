<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Snippet } from 'svelte';
  import StarButton from '$lib/components/StarButton.svelte';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  import { findApp } from '$lib/data/apps';

  let { code, actions }: { code: string; actions?: Snippet } = $props();
  const app = $derived(findApp(code)!);
</script>

<div class="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mb-8">
  <a href={resolve('/') + '#apps'} class="back" aria-label="All tools">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
  </a>
  <span class="tab" aria-hidden="true"><ToolIcon {code} size={24} /></span>
  <div class="min-w-0 flex-1">
    <h1 class="text-2xl font-bold sm:text-3xl">{app.title}</h1>
    <p class="text-sm text-muted">{app.tagline}</p>
  </div>
  <!-- With extra buttons, they take their own row on phones so the title keeps its width. -->
  <div class="flex items-center gap-2" class:with-actions={!!actions}>
    {@render actions?.()}
    <StarButton {code} title={app.title} />
  </div>
</div>

<style>
  .back { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 10px; color: var(--muted); transition: background 160ms, color 160ms; }
  .back:hover { background: var(--surface); color: var(--ink); }
  @media (max-width: 639px) {
    .with-actions { order: 1; width: 100%; }
  }
  .tab { display: flex; width: 52px; height: 52px; align-items: center; justify-content: center; border-radius: 14px; background: var(--accent); color: var(--on-accent); box-shadow: 0 4px 0 color-mix(in srgb, var(--accent) 65%, var(--ink)); transform: rotate(-4deg); }
</style>
