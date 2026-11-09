<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import ToolHeader from '$lib/components/ToolHeader.svelte';
  import { receiveText, sendText } from '$lib/handoff';
  import { defaultFormatOptions, formatText, letterCases, type FormatOptions } from '$lib/text/format';

  let input = $state('');
  let options = $state<FormatOptions>({ ...defaultFormatOptions });
  const output = $derived(formatText(input, options));
  let copyFeedback = $state<{ value: string; message: string } | null>(null);

  const cleanupOptions = [
    { key: 'trimLines', label: 'Trim lines' },
    { key: 'collapseSpaces', label: 'Single spaces' },
    { key: 'removeEmptyLines', label: 'No empty lines' },
    { key: 'removeDuplicates', label: 'No duplicates' },
    { key: 'joinLines', label: 'Join into paragraph' }
  ] as const;

  const EXAMPLE = `  milk
eggs
eggs
  BREAD   and    butter

coffee beans
milk`;

  const lineCount = (value: string) => (value ? value.split(/\r\n|\r|\n/).length : 0);

  onMount(() => {
    const sent = receiveText('text');
    if (sent !== undefined) input = sent;
  });

  function countWords() {
    sendText('words', output);
    goto(resolve('/word-counter'));
  }

  function onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && output) {
      event.preventDefault();
      copyResult();
    }
  }

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

<svelte:window onkeydown={onKeydown} />

<section class="tone-text">
  <div class="page-width pt-8 sm:pt-10">
  <ToolHeader code="text" />

  <div class="panel mb-4 flex flex-wrap items-start gap-x-8 gap-y-4 p-4 sm:p-5">
    <fieldset>
      <legend class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Case</legend>
      <div class="flex flex-wrap gap-1.5">
        {#each letterCases as letterCase}
          <label class="case-option">
            <input class="sr-only" type="radio" name="letter-case" value={letterCase.value} bind:group={options.letterCase} />
            <span>{letterCase.label}</span>
          </label>
        {/each}
      </div>
    </fieldset>
    <fieldset class="min-w-0 flex-1">
      <legend class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Clean up</legend>
      <div class="flex flex-wrap gap-1.5">
        {#each cleanupOptions as option}
          <label class="case-option">
            <input type="checkbox" class="sr-only" bind:checked={options[option.key]} />
            <span>{option.label}</span>
          </label>
        {/each}
      </div>
    </fieldset>
    <button type="button" class="ghost self-end" onclick={() => options = { ...defaultFormatOptions }}>Reset</button>
  </div>

  <div class="grid gap-4 lg:grid-cols-2">
    <div class="panel min-w-0 overflow-hidden">
      <div class="flex min-h-12 items-center gap-2 border-b border-line px-4 py-1.5">
        <label for="formatter-input" class="mr-auto text-sm font-semibold">Original</label>
        {#if !input}
          <button type="button" class="ghost" onclick={() => (input = EXAMPLE)}>Try an example</button>
        {:else}
          <button type="button" class="ghost" onclick={() => { input = ''; copyFeedback = null; }}>Clear</button>
        {/if}
      </div>
      <textarea id="formatter-input" class="block min-h-80 w-full bg-transparent px-4 py-3 leading-7 text-ink outline-none placeholder:text-muted" bind:value={input} rows="12" placeholder="Paste or type your text here…"></textarea>
    </div>

    <div class="panel result min-w-0 overflow-hidden">
      <div class="flex min-h-12 flex-wrap items-center gap-2 border-b border-line px-4 py-1.5">
        <label for="formatter-output" class="mr-auto text-sm font-semibold">Result <span class="font-normal text-muted">· live</span></label>
        <button type="button" class="ghost" disabled={!output} onclick={countWords}>Count words →</button>
        <button type="button" class="ghost" disabled={!output} onclick={downloadResult}>.txt</button>
        <button type="button" class="button min-h-9 px-3 py-1" disabled={!output} onclick={copyResult}>
          {copyFeedback?.value === output ? 'Copied' : 'Copy'}
          <span class="kbd hidden border-transparent bg-transparent text-current opacity-75 shadow-none sm:inline-flex">Ctrl ↵</span>
        </button>
      </div>
      <textarea id="formatter-output" class="block min-h-80 w-full bg-transparent px-4 py-3 leading-7 text-ink outline-none placeholder:text-muted" value={output} rows="12" readonly placeholder="Your tidied text appears here…"></textarea>
    </div>
  </div>
  <p class="sr-only" role="status">{copyFeedback?.value === output ? copyFeedback.message : ''}</p>
  </div>

  <StatusBar
    items={[
      { label: 'lines in', value: lineCount(input) },
      { label: 'lines out', value: lineCount(output), strong: true },
      { label: 'characters', value: output.length }
    ]}
  />
</section>

<style>
  .case-option { cursor: pointer; }
  .case-option span { display: inline-flex; min-height: 36px; align-items: center; padding: 4px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--muted); font-size: 13px; transition: border-color 160ms, background 160ms, color 160ms; }
  .case-option:hover span { background: var(--soft); color: var(--ink); }
  .case-option input:checked + span { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
  .case-option input:focus-visible + span { outline: 3px solid var(--accent); outline-offset: 2px; }
  .ghost { min-height: 36px; padding: 4px 10px; border-radius: 8px; color: var(--accent); font-size: 14px; font-weight: 500; }
  .ghost:hover:not(:disabled) { background: var(--accent-soft); }
  .ghost:disabled, .button:disabled { cursor: not-allowed; opacity: 0.45; }
  .result { background: color-mix(in srgb, var(--accent-soft) 35%, var(--surface)); }
</style>
