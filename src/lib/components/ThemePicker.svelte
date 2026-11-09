<script lang="ts">
  import { onMount } from 'svelte';
  type Preference = 'light' | 'dark' | 'system';
  let preference: Preference = 'system';
  let systemTheme: MediaQueryList;

  function applyTheme() {
    const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }
  function changeTheme() {
    applyTheme();
    try { localStorage.setItem('app-hub-theme', preference); } catch { /* Works without storage. */ }
  }
  onMount(() => {
    systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const readPreference = () => {
      try {
        const saved = localStorage.getItem('app-hub-theme');
        preference = saved === 'light' || saved === 'dark' ? saved : 'system';
      } catch { preference = 'system'; }
      applyTheme();
    };
    const syncPreference = (event: StorageEvent) => {
      if (event.key === 'app-hub-theme' || event.key === null) readPreference();
    };
    readPreference();
    systemTheme.addEventListener('change', applyTheme);
    window.addEventListener('storage', syncPreference);
    return () => {
      systemTheme.removeEventListener('change', applyTheme);
      window.removeEventListener('storage', syncPreference);
    };
  });
</script>

<fieldset class="theme-picker">
  <legend class="sr-only">Color theme</legend>
  {#each ['light', 'dark', 'system'] as option}
    <label class="theme-option">
      <input
        class="sr-only"
        type="radio"
        name="color-theme"
        value={option}
        bind:group={preference}
        on:change={changeTheme}
        aria-label={option === 'system' ? 'Use system theme' : `Use ${option} theme`}
      />
      <span class="theme-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          {#if option === 'light'}
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
          {:else if option === 'dark'}
            <path d="M20.5 13.1A8.6 8.6 0 0 1 10.9 3.5a8.7 8.7 0 1 0 9.6 9.6Z" />
          {:else}
            <rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" />
          {/if}
        </svg>
        <span class="theme-tooltip" aria-hidden="true">{option === 'system' ? 'System' : option === 'light' ? 'Light' : 'Dark'}</span>
      </span>
    </label>
  {/each}
</fieldset>

<style>
  .theme-picker { display: flex; flex-shrink: 0; gap: 2px; padding: 4px; border: 1px solid var(--line); border-radius: 999px; background: var(--soft); }
  .theme-option { position: relative; cursor: pointer; }
  .theme-button { display: flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: 50%; color: var(--muted); transition: background 160ms, color 160ms, box-shadow 160ms; }
  .theme-option:hover .theme-button { color: var(--ink); background: var(--canvas); }
  input:checked + .theme-button { background: var(--surface); color: var(--accent); box-shadow: 0 1px 4px var(--shadow); }
  input:focus-visible + .theme-button { outline: 2px solid var(--accent); outline-offset: 3px; }
  .theme-tooltip { position: absolute; top: calc(100% + 12px); left: 50%; transform: translateX(-50%); z-index: 60; pointer-events: none; padding: 4px 9px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); font-size: 12px; white-space: nowrap; opacity: 0; transition: opacity 120ms; }
  .theme-option:hover .theme-tooltip, input:focus-visible + .theme-button .theme-tooltip { opacity: 1; }
</style>
