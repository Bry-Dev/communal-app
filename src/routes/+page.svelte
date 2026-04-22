<script lang="ts">
  import AppCard from '$lib/components/home/AppCard.svelte';
  import Hero from '$lib/components/home/Header.svelte';
  import SectionHeading from '$lib/components/home/SectionHeading.svelte';
  import SuggestionCta from '$lib/components/home/SuggestionCta.svelte';
  import ValueProps from '$lib/components/home/ValueProps.svelte';
  import { apps, categories, type AppCategory } from '$lib/data/apps';

  let selectedCategory: 'All' | AppCategory = 'All';

  $: filteredApps =
    selectedCategory === 'All'
      ? apps
      : apps.filter((app) => app.category === selectedCategory);
</script>

<svelte:head>
  <title>App Hub</title>
  <meta
    name="description"
    content="Free tools for everyday work. Explore lightweight utilities built to solve small repetitive tasks."
  />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-white">
  <Hero />

  <section id="apps" class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
    <div class="space-y-10">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Featured tools"
          title="Browse the current collection"
          description="A cleaner homepage grid gives each app room to explain what it does and whether it is already available."
        />

        <div class="flex flex-wrap gap-3">
          {#each categories as category}
            <button
              type="button"
              on:click={() => (selectedCategory = category)}
              class:selected={selectedCategory === category}
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              {category}
            </button>
          {/each}
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {#each filteredApps as app}
          <AppCard {app} />
        {/each}
      </div>
    </div>
  </section>

  <ValueProps />
  <SuggestionCta />
</div>

<style>
  .selected {
    border-color: rgba(125, 211, 252, 0.4);
    background: rgba(56, 189, 248, 0.14);
    color: white;
    box-shadow: 0 0 0 1px rgba(125, 211, 252, 0.1) inset;
  }
</style>