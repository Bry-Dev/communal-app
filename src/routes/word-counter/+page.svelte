<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ToolHeader from '$lib/components/ToolHeader.svelte';
	import { receiveText, sendText } from '$lib/handoff';

	const DEFAULT_WORDS_PER_MINUTE = 200;
	const EXAMPLE = `Thanks so much for coming to the garden party on Saturday! It was lovely to see everyone, and the lemon cake disappeared in record time.

We'll do it again in spring. Bring a chair, bring a friend, and bring your appetite.`;

	let text = $state('');
	let wordsPerMinute = $state(DEFAULT_WORDS_PER_MINUTE);

	onMount(() => {
		const sent = receiveText('words');
		if (sent !== undefined) text = sent;
	});

	function countWords(value: string): number {
		const normalized = value.trim();
		if (!normalized) return 0;
		return normalized.split(/\s+/).length;
	}

	function estimateReadingTime(wordCount: number, wpm: number): string {
		if (wordCount <= 0) return '0s';

		const safeWpm = wpm > 0 ? wpm : DEFAULT_WORDS_PER_MINUTE;
		const totalSeconds = Math.ceil((wordCount / safeWpm) * 60);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		if (minutes === 0) return `${seconds}s`;
		if (seconds === 0) return `${minutes}m`;
		return `${minutes}m ${seconds}s`;
	}

	const words = $derived(countWords(text));
	const characters = $derived(text.length);
	const charactersNoSpaces = $derived(text.replace(/\s/g, '').length);
	const readingTime = $derived(estimateReadingTime(words, Number(wordsPerMinute)));

	function tidyInFormatter() {
		sendText('text', text);
		goto(resolve('/text-formatter'));
	}
</script>

<svelte:head>
  <title>Word Counter | App Hub</title>
  <meta name="description" content="Count words instantly and estimate reading time as you type." />
</svelte:head>

<section class="tone-words">
  <div class="page-width pt-8 sm:pt-10">
    <ToolHeader code="words" />

    <div class="panel overflow-hidden">
      <div class="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
        <label for="counter-input" class="mr-auto text-sm font-semibold">Your text</label>
        {#if !text}
          <button type="button" class="ghost" onclick={() => (text = EXAMPLE)}>Try an example</button>
        {:else}
          <button type="button" class="ghost" onclick={tidyInFormatter}>Tidy in Text Formatter →</button>
          <button type="button" class="ghost" onclick={() => (text = '')}>Clear</button>
        {/if}
      </div>
      <textarea id="counter-input" bind:value={text} rows="14" class="block min-h-[26rem] w-full resize-y bg-transparent px-5 py-4 text-lg leading-8 text-ink outline-none placeholder:text-muted" placeholder="Paste your text here, or start writing…"></textarea>
    </div>

    <!-- A big at-a-glance number, the rest lives in the status bar. -->
    <p class="mt-6 flex items-baseline gap-3" aria-live="polite">
      <span class="num text-6xl font-bold text-accent sm:text-7xl">{words.toLocaleString()}</span>
      <span class="text-lg text-muted">{words === 1 ? 'word' : 'words'}</span>
    </p>
  </div>

  <StatusBar
    items={[
      { label: 'words', value: words, strong: true },
      { label: 'characters', value: characters },
      { label: 'without spaces', value: charactersNoSpaces },
      { label: 'to read', value: readingTime }
    ]}
  >
    {#snippet extra()}
      <label class="flex items-center gap-1.5 text-muted">
        at
        <input type="number" min="50" max="600" step="10" bind:value={wordsPerMinute} class="num w-16 rounded border border-line bg-surface px-1.5 py-0.5 text-ink" aria-label="Reading speed in words per minute" />
        wpm
      </label>
    {/snippet}
  </StatusBar>
</section>

<style>
  .ghost { min-height: 36px; padding: 4px 10px; border-radius: 8px; color: var(--accent); font-size: 14px; font-weight: 500; }
  .ghost:hover { background: var(--accent-soft); }
</style>
