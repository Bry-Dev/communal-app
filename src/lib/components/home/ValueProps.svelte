<script lang="ts">
  import FeatureCard from './FeatureCard.svelte';
  import SectionHeading from './SectionHeading.svelte';

  const items = [
    {
      title: 'Focused utilities',
      description: 'Each app is built to solve one clear problem without extra clutter or setup.'
    },
    {
      title: 'Fast to open',
      description: 'The experience is designed to get users from landing page to useful action quickly.'
    },
    {
      title: 'Built to grow',
      description: 'The homepage layout is ready for more tools, categories, featured items, and community ideas.'
    }
  ];
</script>

<section id="benefits" class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
  <div class="space-y-10">
    <SectionHeading
      eyebrow="Why this redesign works"
      title="A cleaner product story for App Hub"
      description="Instead of a sparse landing page, this version presents the site as a growing library of practical tools."
    />

    <div class="grid gap-6 lg:grid-cols-3">
      {#each items as item}
        <FeatureCard {...item} />
      {/each}
    </div>
  </div>
</section>