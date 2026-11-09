<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import ThemePicker from '$lib/components/ThemePicker.svelte';

  const isHome = $derived(page.url.pathname === resolve('/'));
</script>
<header class="site-header sticky top-0 z-50 border-b border-line bg-surface">
  <div class="page-width flex min-h-20 flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3">
    <a href={resolve('/')} class="brand flex items-center gap-3 font-bold" aria-label="App Hub home">
      <span class="grid h-9 w-9 grid-cols-2 gap-1 rounded-lg bg-accent p-2" aria-hidden="true">
        <span class="rounded-sm bg-on-accent"></span><span class="rounded-sm bg-on-accent opacity-60"></span>
        <span class="rounded-sm bg-on-accent opacity-60"></span><span class="rounded-sm bg-on-accent"></span>
      </span>
      App Hub
    </a>
    <nav aria-label="Main navigation" class="order-3 flex w-full items-center justify-center gap-2 border-t border-line pt-2 text-sm sm:order-none sm:w-auto sm:border-0 sm:pt-0">
      <a class="nav-link" class:current={isHome && page.url.hash !== '#suggest'} href={resolve('/') + '#apps'}>All tools</a>
      <a class="nav-link" class:current={isHome && page.url.hash === '#suggest'} href={resolve('/') + '#suggest'}>Suggest a tool</a>
    </nav>
    <ThemePicker />
  </div>
</header>

<style>
  .nav-link { display: inline-flex; min-height: 44px; align-items: center; padding: 8px 16px; border-radius: 9px; color: var(--muted); font-weight: 500; transition: background 160ms, color 160ms; }
  .nav-link:hover { background: var(--soft); color: var(--ink); }
  .nav-link.current { color: var(--accent); background: var(--accent-soft); }
</style>
