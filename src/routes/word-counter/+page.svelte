<script lang="ts">
	import { resolve } from '$app/paths';

	const DEFAULT_WORDS_PER_MINUTE = 200;

	let text = $state('');
	let wordsPerMinute = $state(DEFAULT_WORDS_PER_MINUTE);

	function countWords(value: string): number {
		const normalized = value.trim();
		if (!normalized) return 0;
		return normalized.split(/\s+/).length;
	}

	function estimateReadingTime(wordCount: number, wpm: number): string {
		if (wordCount <= 0) return '0 sec';

		const safeWpm = wpm > 0 ? wpm : DEFAULT_WORDS_PER_MINUTE;
		const totalSeconds = Math.ceil((wordCount / safeWpm) * 60);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		if (minutes === 0) return `${seconds} sec`;
		if (seconds === 0) return `${minutes} min`;
		return `${minutes} min ${seconds} sec`;
	}

	const words = $derived(countWords(text));
	const characters = $derived(text.length);
	const charactersNoSpaces = $derived(text.replace(/\s/g, '').length);
	const readingTime = $derived(estimateReadingTime(words, Number(wordsPerMinute)));
</script>

<svelte:head>
  <title>Word Counter | App Hub</title>
  <meta name="description" content="Count words instantly and estimate reading time as you type." />
</svelte:head>

<section class="page-width py-8 sm:py-12">
  <a href={resolve('/') + '#apps'} class="quiet-link inline-flex min-h-11 items-center text-sm">&larr; All tools</a>
  <div class="mb-8 mt-5">
    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Word Counter</h1>
    <p class="mt-3 text-muted">A quick check for your next article, email, or caption.</p>
  </div>
  <div class="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
    <div class="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div class="mb-4 flex items-center justify-between gap-4">
        <label for="counter-input" class="font-semibold">Your text</label>
        <button type="button" onclick={() => text = ''} disabled={!text} class="min-h-11 rounded-lg px-3 text-sm text-accent hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40">Clear text</button>
      </div>
      <textarea id="counter-input" bind:value={text} rows="14" class="field min-h-80 leading-7" placeholder="Paste your text here, or start writing..." aria-describedby="text-privacy"></textarea>
      <p id="text-privacy" class="mt-4 text-sm text-muted">Only in your browser. Your text isn't saved or uploaded.</p>
    </div>
    <aside aria-label="Text statistics" class="overflow-hidden rounded-2xl border border-line bg-surface">
      <div class="bg-accent-soft px-6 py-7">
        <h2 class="text-sm font-medium text-accent">Word count</h2>
        <p class="mt-2 text-5xl font-bold tabular-nums text-accent">{words.toLocaleString()}</p>
      </div>
      <dl class="divide-y divide-line px-6">
        <div class="flex justify-between gap-3 py-5"><dt class="text-muted">Characters</dt><dd class="font-semibold tabular-nums">{characters.toLocaleString()}</dd></div>
        <div class="flex justify-between gap-3 py-5"><dt class="text-muted">Without spaces</dt><dd class="font-semibold tabular-nums">{charactersNoSpaces.toLocaleString()}</dd></div>
        <div class="flex justify-between gap-3 py-5"><dt class="text-muted">Reading time</dt><dd class="font-semibold tabular-nums">{readingTime}</dd></div>
      </dl>
      <div class="border-t border-line bg-soft px-6 py-5">
        <label for="wpm" class="mb-2 block text-sm font-medium">Reading speed</label>
        <div class="flex items-center gap-3"><input id="wpm" type="number" min="50" max="600" step="10" bind:value={wordsPerMinute} class="field w-24" /><span class="text-sm text-muted">words / minute</span></div>
      </div>
    </aside>
  </div>
</section>
