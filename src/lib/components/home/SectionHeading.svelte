<script lang="ts">
  export let eyebrow = '';
  export let title = '';
  export let description = '';
</script>

<div class="max-w-2xl space-y-3">
  {#if eyebrow}
    <p class="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300/90">{eyebrow}</p>
  {/if}

  <div class="space-y-2">
    <h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
    {#if description}
      <p class="text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    {/if}
  </div>
</div>
