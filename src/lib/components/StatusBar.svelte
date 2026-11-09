<script lang="ts">
  import type { Snippet } from 'svelte';

  type Item = { label: string; value: string | number; strong?: boolean };
  let { items = [], extra }: { items?: Item[]; extra?: Snippet } = $props();
</script>

<!-- Editor-style bar pinned to the bottom of tool pages. -->
<div class="status-bar">
  <div class="page-width flex min-h-11 flex-wrap items-center gap-x-5 gap-y-1 py-2 text-sm">
    {#each items as item}
      <span class="flex items-baseline gap-1.5 whitespace-nowrap">
        <span class="num" class:strong={item.strong}>{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
        <span class="text-muted">{item.label}</span>
      </span>
    {/each}
    {@render extra?.()}
    <span class="ml-auto flex items-center gap-1.5 whitespace-nowrap text-xs text-muted" title="Nothing you type is saved or uploaded">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
      Stays in your browser
    </span>
  </div>
</div>

<style>
  .status-bar { position: sticky; bottom: 0; z-index: 40; margin-top: 24px; border-top: 1px solid var(--line); background: color-mix(in srgb, var(--surface) 92%, transparent); backdrop-filter: blur(8px); }
  .status-bar::before { content: ''; position: absolute; inset: -1px 0 auto; height: 2px; background: var(--accent); }
  .strong { color: var(--accent); font-weight: 700; }
</style>
