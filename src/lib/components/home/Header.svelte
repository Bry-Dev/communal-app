<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import ToolIcon from '$lib/components/ToolIcon.svelte';
  import { findApp, toneOf } from '$lib/data/apps';
  import { sendText } from '$lib/handoff';
  import { suggestTools } from '$lib/smart-paste';

  let text = $state('');
  const suggestions = $derived(suggestTools(text));

  function openWith(code: string) {
    const app = findApp(code);
    if (!app) return;
    sendText(code, text);
    goto(resolve(app.href as RouteId));
  }

  function onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && suggestions[0]) {
      event.preventDefault();
      openWith(suggestions[0].code);
    }
  }
</script>

<section class="page-width pb-10 pt-10 sm:pb-14 sm:pt-16">
  <h1 class="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
    Small tools.<br /><span class="squiggle">Less busywork.</span>
  </h1>

  <div class="paste panel mt-8 sm:mt-10">
    <label for="paste-box" class="flex items-center justify-between gap-3 px-5 pt-4 text-sm font-medium">
      <span>Paste anything — we’ll pick the tool</span>
      <span class="hidden text-xs text-muted sm:inline">a link · a paragraph · a list · some XML</span>
    </label>
    <textarea
      id="paste-box"
      bind:value={text}
      onkeydown={onKeydown}
      rows="3"
      class="block w-full resize-none bg-transparent px-5 py-3 text-lg text-ink outline-none placeholder:text-muted"
      placeholder="https://… or Dear team, …"
      spellcheck="false"
    ></textarea>
    <div class="flex min-h-16 flex-wrap items-center gap-2 border-t border-dashed border-line px-4 py-3" aria-live="polite">
      {#if suggestions.length}
        {#each suggestions as suggestion, index (suggestion.code)}
          {@const app = findApp(suggestion.code)!}
          <button type="button" class="suggestion {toneOf(app.code)}" class:best={index === 0} onclick={() => openWith(app.code)}>
            <ToolIcon code={app.code} size={18} />
            <span class="font-semibold">{app.title}</span>
            <span class="text-xs opacity-80">{suggestion.reason}</span>
            {#if index === 0}<span class="kbd ml-1 hidden sm:inline-flex">Ctrl ↵</span>{/if}
          </button>
        {/each}
      {:else}
        <span class="flex flex-wrap gap-x-5 gap-y-1 px-1 text-sm text-muted">
          <span>✓ No sign-up</span><span>✓ Stays in your browser</span><span>✓ Free</span>
        </span>
      {/if}
    </div>
  </div>
</section>

<style>
  .squiggle { background: linear-gradient(transparent 62%, var(--brand-soft) 62%, var(--brand-soft) 92%, transparent 92%); color: var(--brand); }
  .paste { box-shadow: 0 1px 0 var(--line), 0 18px 40px -24px var(--shadow); transition: border-color 160ms, box-shadow 160ms; }
  .paste:focus-within { border-color: var(--brand); box-shadow: 0 0 0 4px var(--brand-soft), 0 18px 40px -24px var(--shadow); }
  .suggestion { display: inline-flex; min-height: 40px; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--accent); font-size: 14px; transition: background 160ms, border-color 160ms, transform 160ms; animation: pop 220ms ease-out both; }
  .suggestion:hover { border-color: var(--accent); background: var(--accent-soft); }
  .suggestion.best { border-color: var(--accent); background: var(--accent); color: var(--on-accent); }
  .suggestion.best:hover { background: color-mix(in srgb, var(--accent) 85%, var(--ink)); }
  .suggestion:nth-child(2) { animation-delay: 40ms; }
  .suggestion:nth-child(3) { animation-delay: 80ms; }
  @keyframes pop { from { opacity: 0; transform: translateY(4px); } }
</style>
