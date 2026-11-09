<script lang="ts">export let code: string;</script>
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if code === 'qr'}
    <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><path d="M15 15h3v3h3v3h-6v-3M21 13v2M12 3v3M3 12h3m6 0h3m-3 6v3" />
  {:else if code === 'words'}
    <path d="m3 16 5-11 5 11M5 12h6m4-3h6m-3 0v10M3 20h9" />
  {:else if code === 'xml'}
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  {:else if code === 'text'}
    <path d="M4 5h16M4 10h12M4 15h8M4 20h16" />
  {:else}
    <path d="M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h5" />
  {/if}
</svg>
