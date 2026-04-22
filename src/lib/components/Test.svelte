<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  const slides = [
    'Slide 1',
    'Slide 2',
    'Slide 3',
    'Slide 4',
    'Slide 5',
  ];

  let currentIndex = $state(0);
  let direction = $state(1);

  const visibleCount = 2;

  function next() {
    direction = 1;
    currentIndex  = (currentIndex + visibleCount) % slides.length;
  }

  function prev() {
    direction = -1;
    currentIndex = (currentIndex - visibleCount + slides.length) % slides.length;
  }

  function getVisibleSlides(start: number, count: number) {
    return Array.from({ length: count }, (_, i) => slides[(start + i) % slides.length]);
  }

  let counter = $state(0);
	function increment() {
		counter++
	}
</script>

<style>
  .carousel-container {
    width: 600px;
    height: 200px;
    overflow: hidden;
    border: 1px solid #ccc;
    position: relative;
  }

  .carousel-inner {
    display: flex;
    gap: 1rem;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    position: relative;
  }

  .slide {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .controls {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 600px;
  }

  button {
    padding: 0.5rem 1rem;
  }
</style>

<div class="carousel-container">
  
  {#key currentIndex}
    <div
      class="carousel-inner"
      transition:fly={{ x: direction * 600, duration: 300 }}
    >
      {#each getVisibleSlides(currentIndex, visibleCount) as slide (slide)}
        <div class="slide">{slide}</div>
      {/each}
    </div>
  {/key}
</div>

<div class="controls">
  <button onclick={prev}>Previous</button>
  <button onclick={next}>Next</button>
</div>
{#each [counter] as count (count)}
<h1 in:fade>Hello world!</h1>
{/each}
<button onclick={increment}>Go</button>

