<script lang="ts">
  export let title = '';
  export let description = '';
</script>

<div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-sky-300/20 hover:bg-white/10">
  <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-violet-400/20 text-sky-200">
    ✦
  </div>
  <h3 class="text-lg font-semibold text-white">{title}</h3>
  <p class="mt-2 text-sm leading-6 text-slate-300">{description}</p>
</div>