<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  import { liveApps, plannedApps, searchApps, toneOf } from '$lib/data/apps';
  import { palette, prefs } from '$lib/prefs.svelte';

  let dialog: HTMLDialogElement | undefined = $state();
  let input: HTMLInputElement | undefined = $state();
  let query = $state('');
  let active = $state(0);

  // Starred tools first when there is no query.
  const results = $derived.by(() => {
    const found = searchApps(query, liveApps);
    if (query.trim()) return found;
    return [...found].sort((a, b) => Number(prefs.isFavorite(b.code)) - Number(prefs.isFavorite(a.code)));
  });
  const upcoming = $derived(query.trim() ? searchApps(query, plannedApps) : []);

  $effect(() => {
    if (!dialog) return;
    if (palette.open && !dialog.open) {
      query = '';
      active = 0;
      dialog.showModal();
      input?.focus();
    } else if (!palette.open && dialog.open) {
      dialog.close();
    }
  });

  $effect(() => {
    if (active >= results.length) active = Math.max(0, results.length - 1);
  });

  function isTyping(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
  }

  function onGlobalKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.open = !palette.open;
    } else if (event.key === '/' && !palette.open && !isTyping(event.target)) {
      event.preventDefault();
      palette.open = true;
    }
  }

  function open(index: number) {
    const app = results[index];
    if (!app) return;
    palette.open = false;
    goto(resolve(app.href as RouteId));
  }

  function onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') { event.preventDefault(); active = (active + 1) % Math.max(results.length, 1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); active = (active - 1 + results.length) % Math.max(results.length, 1); }
    else if (event.key === 'Enter') { event.preventDefault(); open(active); }
  }
</script>

<svelte:window onkeydown={onGlobalKeydown} />

<dialog
  bind:this={dialog}
  class="palette"
  aria-label="Find a tool"
  onclose={() => (palette.open = false)}
  onclick={(event) => { if (event.target === dialog) palette.open = false; }}
>
  <div class="panel overflow-hidden shadow-2xl">
    <div class="flex items-center gap-3 border-b border-line px-4">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 text-muted" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input
        bind:this={input}
        bind:value={query}
        onkeydown={onInputKeydown}
        class="min-h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
        placeholder="Find a tool…"
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-results"
        aria-activedescendant={results[active] ? `palette-${results[active].code}` : undefined}
        autocomplete="off"
        spellcheck="false"
      />
      <span class="kbd">Esc</span>
    </div>

    <ul id="palette-results" role="listbox" aria-label="Tools" class="max-h-80 overflow-auto p-2">
      {#each results as app, index (app.code)}
        <li
          id="palette-{app.code}"
          role="option"
          aria-selected={index === active}
          class="option {toneOf(app.code)}"
          onmousemove={() => (active = index)}
          onclick={() => open(index)}
          onkeydown={() => {}}
        >
          <span class="icon"><ToolIcon code={app.code} size={20} /></span>
          <span class="min-w-0 flex-1">
            <span class="block font-medium">{app.title}{#if prefs.isFavorite(app.code)}<span class="ml-1.5 text-amber-600" aria-label="starred">★</span>{/if}</span>
            <span class="block truncate text-sm text-muted">{app.tagline}</span>
          </span>
          {#if index === active}<span class="kbd">↵</span>{/if}
        </li>
      {/each}
      {#each upcoming as app (app.code)}
        <li class="option cursor-default opacity-60">
          <span class="icon tone-plain"><ToolIcon code={app.code} size={20} /></span>
          <span class="flex-1"><span class="block font-medium">{app.title}</span><span class="block text-sm text-muted">Coming soon</span></span>
        </li>
      {/each}
      {#if !results.length && !upcoming.length}
        <li class="px-3 py-6 text-center text-sm text-muted">
          No tool for “{query}” yet. <a class="font-medium text-accent underline" href={resolve('/') + '#suggest'} onclick={() => (palette.open = false)}>Suggest it</a>
        </li>
      {/if}
    </ul>

    <div class="flex gap-4 border-t border-line bg-soft px-4 py-2 text-xs text-muted">
      <span><span class="kbd">↑</span> <span class="kbd">↓</span> move</span>
      <span><span class="kbd">↵</span> open</span>
      <span class="ml-auto"><span class="kbd">/</span> or <span class="kbd">Ctrl K</span> anywhere</span>
    </div>
  </div>
</dialog>

<style>
  .palette { width: min(560px, calc(100vw - 32px)); margin: 12vh auto auto; padding: 0; border: 0; background: transparent; color: var(--ink); }
  .palette::backdrop { background: rgba(20, 16, 10, 0.45); backdrop-filter: blur(3px); }
  .option { display: flex; cursor: pointer; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; }
  .option[aria-selected='true'] { background: var(--accent-soft); }
  .icon { display: flex; width: 36px; height: 36px; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 9px; background: var(--accent-soft); color: var(--accent); }
  .option[aria-selected='true'] .icon { background: var(--surface); }
</style>
