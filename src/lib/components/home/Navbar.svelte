<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';

  const isHome = $derived(page.url.pathname === resolve('/'));

  const anchorNavItems: { label: string; anchor: string; href?: string; external?: boolean }[] = [
    { label: 'Apps', anchor: 'apps' },
    { label: 'Why App Hub', anchor: 'benefits' },
    { label: 'Submit Idea', anchor: 'suggest' }
  ];

  const externalNavItems: { label: string; anchor?: string; href: string; external: boolean }[] = [
    { label: 'GitHub', href: 'https://github.com/Bry-Dev/communal-app', external: true }
  ];

  const navItems = $derived([
    ...anchorNavItems.map((item) => ({
      ...item,
      href: isHome ? `#${item.anchor}` : `${resolve('/')}#${item.anchor}`
    })),
    ...externalNavItems
  ]);

  const homeHref = $derived(isHome ? '#top' : resolve('/'));
  const suggestHref = $derived(isHome ? '#suggest' : `${resolve('/')}#suggest`);
</script>

<header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
    <a href={homeHref} class="flex items-center gap-3 text-white">
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-sm font-black text-slate-950 shadow-lg shadow-sky-500/20">
        AH
      </span>
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.28em] text-sky-300">App Hub</p>
        <p class="text-sm text-slate-400">Small tools. Fast wins.</p>
      </div>
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      {#each navItems as item}
        <a
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
          class="text-sm font-medium text-slate-300 transition hover:text-white"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <a
      href={suggestHref}
      class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      Suggest a tool
    </a>
  </div>
</header>