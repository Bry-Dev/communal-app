<script lang="ts">
  import { resolve } from '$app/paths';
  import { defaultFormatOptions, formatText, letterCases, type FormatOptions } from '$lib/text/format';

  let input = $state('');
  let options = $state<FormatOptions>({ ...defaultFormatOptions });
  const output = $derived(formatText(input, options));
  let copyFeedback = $state<{ value: string; message: string } | null>(null);

  const cleanupOptions = [
    { key: 'trimLines', label: 'Trim line edges' },
    { key: 'collapseSpaces', label: 'Collapse repeated spaces' },
    { key: 'removeEmptyLines', label: 'Remove empty lines' },
    { key: 'removeDuplicates', label: 'Remove duplicate lines' },
    { key: 'joinLines', label: 'Join lines into a paragraph' }
  ] as const;

  async function copyResult() {
    const value = output;
    try {
      await navigator.clipboard.writeText(value);
      copyFeedback = { value, message: 'Copied to clipboard.' };
    } catch {
      copyFeedback = { value, message: 'Could not copy. Select the result and copy it manually.' };
    }
  }

  function downloadResult() {
    const url = URL.createObjectURL(new Blob([output], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-text.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
</script>

<svelte:head>
  <title>Text Formatter | App Hub</title>
  <meta name="description" content="Change capitalization, clean up spaces and line breaks, and remove duplicate lines. Format text privately in your browser." />
</svelte:head>

<section class="page-width py-8 sm:py-12">
  <a href={resolve('/') + '#apps'} class="quiet-link inline-flex min-h-11 items-center text-sm">&larr; All tools</a>
  <div class="mb-8 mt-5">
    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Text Formatter</h1>
    <p class="mt-3 max-w-2xl text-muted">Tidy up pasted text for your next document, message, or list.</p>
  </div>

  <div class="mb-6 space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-7">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-base font-bold">Formatting options</h2>
      <button type="button" class="min-h-11 rounded-lg px-3 text-sm font-medium text-accent hover:bg-soft" onclick={() => options = { ...defaultFormatOptions }}>Reset options</button>
    </div>
    <fieldset>
      <legend class="mb-3 text-sm font-medium">Letter case</legend>
      <div class="flex flex-wrap gap-2">
        {#each letterCases as letterCase}
          <label class="case-option">
            <input class="sr-only" type="radio" name="letter-case" value={letterCase.value} bind:group={options.letterCase} />
            <span>{letterCase.label}</span>
          </label>
        {/each}
      </div>
    </fieldset>
    <fieldset>
      <legend class="mb-2 text-sm font-medium">Spacing and lines</legend>
      <div class="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each cleanupOptions as option}
          <label class="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
            <input type="checkbox" class="h-4 w-4 shrink-0" bind:checked={options[option.key]} />
            {option.label}
          </label>
        {/each}
      </div>
      {#if options.removeDuplicates}
        <p class="mt-2 text-xs text-muted">Keeps the first occurrence of each line after applying the selected case and spacing options.</p>
      {/if}
    </fieldset>
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <div class="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div class="mb-4 flex min-h-11 items-center justify-between gap-3">
        <label for="formatter-input" class="font-semibold">Your text</label>
        <button type="button" class="min-h-11 rounded-lg px-3 text-sm text-accent hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40" disabled={!input} onclick={() => { input = ''; copyFeedback = null; }}>Clear text</button>
      </div>
      <textarea id="formatter-input" class="field min-h-80 leading-7" bind:value={input} rows="12" placeholder="Paste or type your text here..." aria-describedby="formatter-privacy"></textarea>
      <p class="mt-3 text-xs tabular-nums text-muted">{input.length.toLocaleString()} characters</p>
    </div>

    <div class="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div class="mb-4 flex min-h-11 items-center justify-between gap-3">
        <label for="formatter-output" class="font-semibold">Formatted result</label>
        <span class="text-xs text-muted">Live preview</span>
      </div>
      <textarea id="formatter-output" class="field min-h-80 leading-7" value={output} rows="12" readonly placeholder="Your formatted text will appear here..."></textarea>
      <p class="mt-3 text-xs tabular-nums text-muted">{output.length.toLocaleString()} characters</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <button type="button" class="button disabled:cursor-not-allowed disabled:opacity-50" disabled={!output} onclick={copyResult}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg>
          Copy result
        </button>
        <button type="button" class="button button-secondary disabled:cursor-not-allowed disabled:opacity-50" disabled={!output} onclick={downloadResult}>Download .txt</button>
      </div>
      <p class="mt-3 min-h-6 text-sm text-muted" role="status">{copyFeedback?.value === output ? copyFeedback.message : ''}</p>
    </div>
  </div>
  <p id="formatter-privacy" class="mt-5 text-sm text-muted">Your original stays unchanged. Everything is processed in your browser; your text isn't saved or uploaded.</p>
</section>

<style>
  .case-option { cursor: pointer; }
  .case-option span { display: inline-flex; min-height: 44px; align-items: center; padding: 8px 16px; border: 1px solid var(--line); border-radius: 9px; background: var(--surface); color: var(--muted); font-size: 14px; transition: border-color 160ms, background 160ms; }
  .case-option:hover span { background: var(--soft); color: var(--ink); }
  .case-option input:checked + span { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
</style>
