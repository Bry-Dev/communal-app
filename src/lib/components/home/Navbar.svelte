<script lang="ts">
  import { resolve } from '$app/paths';
  import ThemePicker from '$lib/components/ThemePicker.svelte';
  import { palette } from '$lib/prefs.svelte';
</script>
<header class="site-header sticky top-0 z-50 border-b border-line">
  <div class="page-width flex min-h-16 items-center gap-3 py-2">
    <a href={resolve('/')} class="brand mr-auto flex items-center gap-2.5 whitespace-nowrap text-lg font-bold" aria-label="App Hub home">
      <!-- The four squares are the four tool colours. -->
      <span class="logo" aria-hidden="true">
        <span style="background: var(--tone-qr)"></span><span style="background: var(--tone-words)"></span>
        <span style="background: var(--tone-xml)"></span><span style="background: var(--tone-text)"></span>
      </span>
      App Hub
    </a>
    <button type="button" class="search" onclick={() => (palette.open = true)} aria-label="Find a tool" aria-keyshortcuts="Control+K /">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <span class="hidden sm:inline">Find a tool</span>
      <span class="kbd ml-4 hidden sm:inline-flex">Ctrl K</span>
    </button>
    <a class="suggest" href={resolve('/') + '#suggest'} aria-label="Suggest a tool">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z" /></svg>
      <span class="hidden sm:inline">Suggest a tool</span>
    </a>
    <ThemePicker />
  </div>
</header>

<style>
  .site-header { background: color-mix(in srgb, var(--canvas) 88%, transparent); backdrop-filter: blur(10px); }
  .logo { display: grid; width: 30px; height: 30px; grid-template-columns: 1fr 1fr; gap: 3px; transform: rotate(-6deg); }
  .logo span { border-radius: 4px; }
  .search { display: inline-flex; min-height: 40px; align-items: center; gap: 8px; padding: 6px 8px 6px 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); color: var(--muted); font-size: 14px; transition: border-color 160ms, color 160ms; }
  .search:hover { border-color: var(--muted); color: var(--ink); }
  .suggest { display: inline-flex; min-height: 40px; min-width: 40px; align-items: center; justify-content: center; gap: 6px; padding: 6px 12px; border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent); border-radius: 10px; background: var(--brand-soft); color: var(--brand); font-size: 14px; font-weight: 600; transition: background 160ms, color 160ms, border-color 160ms, transform 160ms; }
  .suggest:hover { border-color: var(--brand); background: var(--brand); color: var(--on-accent); }
  .suggest:active { transform: translateY(1px); }
</style>
