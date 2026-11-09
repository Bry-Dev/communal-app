<script lang="ts">
  let { code, size = 28 }: { code: string; size?: number } = $props();
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if code === 'qr'}
    <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><path d="M15 15h3v3h3v3h-6v-3M21 13v2M12 3v3M3 12h3m6 0h3m-3 6v3" />
  {:else if code === 'words'}
    <path d="m3 16 5-11 5 11M5 12h6m4-3h6m-3 0v10M3 20h9" />
  {:else if code === 'xml' || code === 'json'}
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  {:else if code === 'text'}
    <path d="M4 5h16M4 10h12M4 15h8M4 20h16" />
  {:else if code === 'compare'}
    <path d="M4 4h6v16H4zM14 4h6v16h-6zM7 8h0M17 12h0" />
  {:else if code === 'password'}
    <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
  {:else if code === 'picker'}
    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 8h0M16 8h0M12 12h0M8 16h0M16 16h0" stroke-width="3" />
  {:else if code === 'percent'}
    <path d="M19 5 5 19" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" />
  {:else if code === 'date'}
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
  {:else if code === 'image'}
    <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" />
  {:else if code === 'pdf'}
    <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h4" />
  {:else}
    <path d="M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h5" />
  {/if}
</svg>
