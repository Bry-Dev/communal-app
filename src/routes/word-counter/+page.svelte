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
	<meta
		name="description"
		content="Count words instantly and estimate reading time as you type."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-slate-950 text-white">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_35%),radial-gradient(circle_at_85%_15%,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(to_bottom,_rgba(15,23,42,0.98),_rgba(2,6,23,1))]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]"></div>

	<div class="relative mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
		<div class="mb-8 space-y-4">
			<a
				href={resolve('/')}
				class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur transition hover:bg-white/10 sm:text-sm"
			>
				← Back to App Hub
			</a>

			<div class="space-y-3">
				<p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300 sm:text-sm">
					Writing utility
				</p>
				<h1 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-5xl">
					Word Counter
				</h1>
				<p class="max-w-2xl text-xs leading-6 text-slate-300 sm:text-sm lg:text-base">
					Paste or type text to instantly calculate words, characters, and reading time.
				</p>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
			<div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
				<label for="counter-input" class="mb-3 block text-xs font-medium text-slate-200 sm:text-sm">
					Text input
				</label>
				<textarea
					id="counter-input"
					bind:value={text}
					rows="14"
					class="block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:text-sm"
					placeholder="Start typing your paragraph, article, caption, or notes..."
				></textarea>
			</div>

			<div class="space-y-4">
				<div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
					<label for="wpm" class="block text-xs uppercase tracking-[0.22em] text-slate-400"
						>Reading speed (WPM)</label
					>
					<input
						id="wpm"
						type="number"
						min="50"
						max="600"
						step="10"
						bind:value={wordsPerMinute}
						class="mt-3 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs text-white focus:border-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:text-sm"
					/>
				</div>

				<div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
					<p class="text-xs uppercase tracking-[0.22em] text-slate-400">Words</p>
					<p class="mt-2 text-2xl font-semibold text-white sm:text-3xl">{words}</p>
				</div>

				<div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
					<p class="text-xs uppercase tracking-[0.22em] text-slate-400">Reading time</p>
					<p class="mt-2 text-lg font-semibold text-white sm:text-xl lg:text-2xl">{readingTime}</p>
					<p class="mt-2 text-xs text-slate-400 sm:text-sm">
						Based on {wordsPerMinute || DEFAULT_WORDS_PER_MINUTE} words per minute.
					</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
						<p class="text-xs uppercase tracking-[0.22em] text-slate-400">Characters</p>
						<p class="mt-2 text-lg font-semibold text-white sm:text-xl lg:text-2xl">{characters}</p>
					</div>

					<div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
						<p class="text-xs uppercase tracking-[0.22em] text-slate-400">Characters</p>
						<p class="mt-2 text-lg font-semibold text-white sm:text-xl lg:text-2xl">{charactersNoSpaces}</p>
            <p class="mt-2 text-xs text-slate-400 sm:text-sm">
						Excluding spaces
					</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
