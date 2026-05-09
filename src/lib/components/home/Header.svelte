<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { RouteId } from '$app/types';
  import { apps } from '$lib/data/apps';

  const isHome = $derived(page.url.pathname === resolve('/'));
  const appsHref = $derived(isHome ? '#apps' : `${resolve('/')}#apps`);
  const suggestHref = $derived(isHome ? '#suggest' : `${resolve('/')}#suggest`);
  const featuredApps = apps.filter((app) => app.status === 'live');

  const statCards = [
    { label: 'Free to use', value: '100%' },
    { label: 'Built for speed', value: '< 1 min' },
    { label: 'Setup required', value: 'Zero' }
  ];
</script>

<section id="top" class="relative overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.18),_transparent_25%),linear-gradient(to_bottom,_rgba(15,23,42,0.95),_rgba(2,6,23,1))]"></div>
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]"></div>

  <div class="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
    <div class="max-w-3xl space-y-8">
      <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200 backdrop-blur">
        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
        New home experience for your tool collection
      </div>

      <div class="space-y-5">
        <h1 class="text-5xl font-semibold tracking-tight text-white sm:text-6xl xl:text-7xl">
          Free tools for
          <span class="bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            everyday work
          </span>
        </h1>

        <p class="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          App Hub is a growing collection of small web apps that remove friction from daily tasks.
          Open a tool, solve the problem, and move on quickly.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <a
          href={appsHref}
          class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Explore apps
        </a>
        <a
          href={suggestHref}
          class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
        >
          Suggest an idea
        </a>
      </div>

      <div class="grid gap-4 pt-4 sm:grid-cols-3">
        {#each statCards as stat}
          <div class="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <p class="text-2xl font-semibold text-white">{stat.value}</p>
            <p class="mt-2 text-sm text-slate-300">{stat.label}</p>
          </div>
        {/each}
      </div>
    </div>

    <div class="relative">
      <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-violet-400/20 blur-2xl"></div>

      <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-sky-950/40 backdrop-blur-xl">
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Featured apps</p>
            <p class="mt-1 text-xs text-slate-300">{featuredApps.length} live tools available</p>
          </div>
          <span class="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            Live now
          </span>
        </div>

        <div class="space-y-4 p-6">
          {#if featuredApps.length === 0}
            <p class="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              No live apps yet.
            </p>
          {:else}
            {#each featuredApps as app}
              <article class="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <div class="flex items-start justify-between gap-4">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">{app.eyebrow}</p>
                    <a href={resolve(app.href as RouteId)} class="block text-lg font-semibold text-white hover:text-sky-200">
                      {app.title}
                    </a>
                    <p class="text-sm leading-6 text-slate-300">{app.description}</p>
                  </div>

                  <a
                    href={resolve(app.href as RouteId)}
                    class="inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
                  >
                    Open
                  </a>
                </div>
              </article>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>