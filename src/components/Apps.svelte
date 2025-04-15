<script lang="ts">
  import { AppList } from "$lib/data/AppList";
  import { fade } from 'svelte/transition';
  let innerWidth = $state(0);
  let visibleCount = $state(2);
  let currentIndex = $state(0);
  let direction = $state(1); // 1 = next, -1 = prev

  const prev = () => {
    direction = -1;
    currentIndex  = (currentIndex - 1 + AppList.length) % AppList.length;
    console.log(currentIndex)
  }

  const next = () => {
    direction = 1;
    currentIndex = (currentIndex + 1) % AppList.length;
  }

  $effect(() => {
    visibleCount = innerWidth <= 768 ? 1 : 2;
  })

  function getVisibleSlides(start: number, count: number) {
    return Array.from({ length: count }, (_, i) => AppList[(start + i) % AppList.length]);
  }
</script>
<svelte:window bind:innerWidth />
<section class="flex justify-center items-center gap-3 text-white mb-20 relative">
  <div class="cursor-pointer">
    <svg onclick={prev} class="hover:text-sky-300 w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m15 19-7-7 7-7"/>
    </svg>
  </div>
  {#each getVisibleSlides(currentIndex, visibleCount) as app }
    <div in:fade class="h-[300px] w-[30em] border-2 rounded-lg py-5 px-3 overflow-hidden shadow-lg flex flex-col">
      <a href={app.link} target="_blank" rel="noopener noreferrer" class="mr-auto font-bold font-montserrat-bold text-base lg:text-xl transition duration-300 group hover:text-sky-300">
        {app.title}
        <span class="block w-0 group-hover:w-full transition-all duration-500 h-0.5 bg-sky-300"></span>
      </a>
      <p class="text-pretty py-2">
        {app.description}
      </p>
      <a href={app.trialLink} class:hidden={!app.isAvailable} target="_blank" rel="noopener noreferrer" class="font-semibold hover:text-sky-200">
        Try it<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline-block h-4 w-4 ml-1" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd"></path>
        </svg>
      </a>
    </div>
  {/each}
  <div class="cursor-pointer">
    <svg onclick={next} class="hover:text-sky-300 w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m9 5 7 7-7 7"/>
    </svg>
  </div>
</section>

<style scoped>
  
</style>