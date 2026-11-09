<script lang="ts">
  import { prefs } from '$lib/prefs.svelte';

  let { code, title, class: className = '' }: { code: string; title: string; class?: string } = $props();
  const starred = $derived(prefs.isFavorite(code));
</script>

<button
  type="button"
  class="star {className}"
  class:starred
  aria-pressed={starred}
  aria-label={starred ? `Unstar ${title}` : `Star ${title}`}
  title={starred ? 'Starred' : 'Star this tool'}
  onclick={() => prefs.toggleFavorite(code)}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
  </svg>
</button>

<style>
  .star { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: 10px; color: var(--muted); transition: background 160ms, color 160ms, transform 160ms; }
  .star:hover { background: var(--soft); color: var(--ink); }
  .star.starred { color: #d97706; }
  .star:active { transform: scale(0.9); }
</style>
