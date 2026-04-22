<script lang="ts">
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import type { HubApp } from '$lib/data/apps';

  export let app: HubApp;

  const statusStyles = {
    live: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20',
    'coming-soon': 'bg-amber-400/10 text-amber-200 border-amber-300/20'
  };

  const categoryStyles = {
    Utilities: 'from-sky-400/20 to-cyan-300/20 text-sky-100',
    Productivity: 'from-violet-400/20 to-fuchsia-300/20 text-violet-100',
    Business: 'from-emerald-400/20 to-lime-300/20 text-emerald-100',
    Experiments: 'from-amber-400/20 to-orange-300/20 text-amber-100'
  };
</script>

<article class="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:shadow-2xl hover:shadow-sky-950/30">
  <div class={`h-32 bg-gradient-to-br ${categoryStyles[app.category]} p-6`}>
    <div class="flex h-full items-start justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">{app.eyebrow}</p>
        <p class="mt-3 text-lg font-semibold text-white">{app.category}</p>
      </div>
      <span class={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[app.status]}`}>
        {app.badge ?? app.status}
      </span>
    </div>
  </div>

  <div class="flex flex-1 flex-col p-6">
    <div class="space-y-3">
      <h3 class="text-xl font-semibold text-white">{app.title}</h3>
      <p class="text-sm leading-6 text-slate-300">{app.description}</p>
    </div>

    <div class="mt-6 flex items-center justify-between gap-3 pt-4">
      <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
        {app.code}
      </span>

      {#if app.status === 'live'}
        <a
          href={resolve(app.href as RouteId)}
          class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
        >
          Open app
        </a>
      {:else}
        <span class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
          In progress
        </span>
      {/if}
    </div>
  </div>
</article>