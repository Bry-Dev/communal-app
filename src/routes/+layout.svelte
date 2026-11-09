<script lang="ts">
  import '@fontsource-variable/bricolage-grotesque';
  import '@fontsource-variable/jetbrains-mono';
  import '../app.css';
  import { onMount, type Snippet } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import Navbar from '$lib/components/home/Navbar.svelte';
  import Footer from '$lib/components/home/Footer.svelte';
  import { liveApps } from '$lib/data/apps';
  import { prefs } from '$lib/prefs.svelte';

  let { children }: { children: Snippet } = $props();

  onMount(() => prefs.load());

  // Remember which tools were opened, for "Pick up where you left off".
  afterNavigate(({ to }) => {
    const path = to?.url.pathname.replace(/\/$/, '');
    const app = liveApps.find((item) => resolve(item.href as RouteId).replace(/\/$/, '') === path);
    if (app) {
      if (!prefs.loaded) prefs.load();
      prefs.visit(app.code);
    }
  });
</script>

<div class="flex min-h-screen flex-col">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <Navbar />
  <main id="main-content" tabindex="-1" class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
<CommandPalette />
