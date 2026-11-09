<script lang="ts">
  import { onMount } from 'svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import ToolHeader from '$lib/components/ToolHeader.svelte';
  import { receiveText } from '$lib/handoff';
  import { applyPercent, formatNumber, parseNumber, parsePercentOf, percentChange, percentOf, whatPercent } from '$lib/percent/calc';

  // Inputs are text so people can type "1,200" or "$80"; parseNumber reads them.
  let ofP = $state(''), ofX = $state('');
  let partA = $state(''), partB = $state('');
  let fromA = $state(''), toB = $state('');
  let adjX = $state(''), adjP = $state('');
  let adjDirection = $state<'subtract' | 'add'>('subtract');
  let copied = $state('');

  onMount(() => {
    const sent = receiveText('percent');
    if (!sent) return;
    const question = parsePercentOf(sent);
    if (question) {
      ofP = String(question.p);
      ofX = String(question.x);
    } else {
      const number = parseNumber(sent);
      if (number !== null) ofP = String(number);
    }
  });

  const n = (value: string) => parseNumber(value);
  const both = (a: string, b: string) => n(a) !== null && n(b) !== null;

  const ofResult = $derived(both(ofP, ofX) ? percentOf(n(ofP)!, n(ofX)!) : null);
  const partResult = $derived(both(partA, partB) ? whatPercent(n(partA)!, n(partB)!) : null);
  const changeResult = $derived(both(fromA, toB) ? percentChange(n(fromA)!, n(toB)!) : null);
  const adjResult = $derived(both(adjX, adjP) ? applyPercent(n(adjX)!, n(adjP)!, adjDirection) : null);
  const adjDifference = $derived(adjResult !== null ? Math.abs(adjResult - n(adjX)!) : null);

  const answered = $derived([ofResult, partResult, changeResult, adjResult].filter((value) => value !== null).length);

  function tryExample() {
    [ofP, ofX] = ['15', '80'];
    [partA, partB] = ['18', '24'];
    [fromA, toB] = ['50', '65'];
    [adjX, adjP, adjDirection] = ['120', '20', 'subtract'];
  }

  function clearAll() {
    ofP = ofX = partA = partB = fromA = toB = adjX = adjP = '';
  }

  async function copy(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      copied = id;
      setTimeout(() => { if (copied === id) copied = ''; }, 1500);
    } catch { /* Copy is a convenience; the result stays visible. */ }
  }

  function isBadInput(value: string) {
    return value.trim() !== '' && parseNumber(value) === null;
  }
</script>

<svelte:head>
  <title>Percentage Calculator | App Hub</title>
  <meta name="description" content="Work out percentages, discounts, tips and percentage changes. Answers update as you type." />
</svelte:head>

{#snippet num(id: string, label: string, read: () => string, update: (v: string) => void, suffix = '')}
  <span class="inline-field" class:bad={isBadInput(read())}>
    <input
      {id}
      aria-label={label}
      inputmode="decimal"
      autocomplete="off"
      value={read()}
      oninput={(event) => update(event.currentTarget.value)}
      placeholder="0"
      size="6"
    />{#if suffix}<span class="suffix" aria-hidden="true">{suffix}</span>{/if}
  </span>
{/snippet}

{#snippet answer(id: string, value: number | null, unit = '', note = '')}
  <div class="answer">
    {#if value === null}
      <span class="text-muted">= …{note ? ` (${note})` : ''}</span>
    {:else}
      <span class="num result">= {formatNumber(value)}{unit}</span>
      {#if note}<span class="ml-2 text-sm text-muted">{note}</span>{/if}
      <button type="button" class="copy" onclick={() => copy(id, formatNumber(value).replace(/[^\d.\-]/g, ''))} aria-label="Copy answer">
        {copied === id ? 'Copied' : 'Copy'}
      </button>
    {/if}
  </div>
{/snippet}

<section class="tone-percent">
  <div class="page-width pt-8 sm:pt-10">
    <ToolHeader code="percent">
      {#snippet actions()}
        <button type="button" class="ghost inline-flex" onclick={tryExample}>Try an example</button>
        <button type="button" class="ghost inline-flex" onclick={clearAll}>Clear</button>
      {/snippet}
    </ToolHeader>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="card panel">
        <h2 class="card-title">Percent of</h2>
        <p class="sentence">What is {@render num('of-p', 'Percent', () => ofP, (v) => (ofP = v), '%')} of {@render num('of-x', 'Number', () => ofX, (v) => (ofX = v))}?</p>
        {@render answer('of', ofResult)}
      </div>

      <div class="card panel">
        <h2 class="card-title">What percent</h2>
        <p class="sentence">{@render num('part-a', 'Part', () => partA, (v) => (partA = v))} is what % of {@render num('part-b', 'Whole', () => partB, (v) => (partB = v))}?</p>
        {@render answer('part', partResult, '%', both(partA, partB) && partResult === null ? 'can’t divide by 0' : '')}
      </div>

      <div class="card panel">
        <h2 class="card-title">Change</h2>
        <p class="sentence">From {@render num('from-a', 'Starting value', () => fromA, (v) => (fromA = v))} to {@render num('to-b', 'New value', () => toB, (v) => (toB = v))} is a change of</p>
        <div class="answer">
          {#if changeResult === null}
            <span class="text-muted">= …{both(fromA, toB) ? ' (can’t start from 0)' : ''}</span>
          {:else}
            <span class="num result" class:up={changeResult > 0} class:down={changeResult < 0}>{changeResult > 0 ? '▲ +' : changeResult < 0 ? '▼ ' : ''}{formatNumber(changeResult)}%</span>
            <span class="ml-2 text-sm text-muted">{changeResult > 0 ? 'increase' : changeResult < 0 ? 'decrease' : 'no change'}</span>
            <button type="button" class="copy" onclick={() => copy('change', formatNumber(changeResult!).replace(/[^\d.\-]/g, ''))} aria-label="Copy answer">{copied === 'change' ? 'Copied' : 'Copy'}</button>
          {/if}
        </div>
      </div>

      <div class="card panel">
        <h2 class="card-title flex items-center justify-between gap-2">
          {adjDirection === 'subtract' ? 'Discount' : 'Add on (tax, tip)'}
          <span class="mini-toggle" role="group" aria-label="Take off or add on">
            <button type="button" aria-pressed={adjDirection === 'subtract'} onclick={() => (adjDirection = 'subtract')}>− off</button>
            <button type="button" aria-pressed={adjDirection === 'add'} onclick={() => (adjDirection = 'add')}>+ on</button>
          </span>
        </h2>
        <p class="sentence">{@render num('adj-x', 'Amount', () => adjX, (v) => (adjX = v))} {adjDirection === 'subtract' ? 'with' : 'plus'} {@render num('adj-p', 'Percent', () => adjP, (v) => (adjP = v), '%')} {adjDirection === 'subtract' ? 'off' : 'added'} is</p>
        {@render answer('adj', adjResult, '', adjDifference !== null ? `${adjDirection === 'subtract' ? 'you save' : 'adds'} ${formatNumber(adjDifference)}` : '')}
      </div>
    </div>
  </div>

  <StatusBar items={[{ label: 'of 4 answered', value: answered, strong: true }]} />
</section>

<style>
  .card { display: flex; flex-direction: column; gap: 14px; padding: 20px 22px; border-left: 4px solid var(--accent); }
  .card-title { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); }
  .sentence { font-size: 20px; line-height: 2.4; }
  .inline-field { display: inline-flex; align-items: baseline; margin: 0 2px; padding: 0 8px; border-bottom: 2px solid var(--line); background: var(--soft); border-radius: 8px 8px 2px 2px; transition: border-color 160ms, background 160ms; }
  .inline-field:focus-within { border-color: var(--accent); background: var(--accent-soft); }
  .inline-field.bad { border-color: #dc2626; }
  .inline-field input { width: 5.5ch; min-width: 3ch; padding: 2px 0; border: 0; background: transparent; color: var(--ink); font-family: 'JetBrains Mono Variable', ui-monospace, monospace; font-size: 20px; font-weight: 600; text-align: right; outline: none; field-sizing: content; }
  .inline-field input::placeholder { color: var(--muted); opacity: 0.5; }
  .suffix { margin-left: 2px; color: var(--muted); font-family: 'JetBrains Mono Variable', ui-monospace, monospace; }
  .answer { display: flex; min-height: 48px; flex-wrap: wrap; align-items: center; gap: 4px 0; margin-top: auto; padding-top: 12px; border-top: 1px dashed var(--line); font-size: 18px; }
  .result { font-size: 28px; font-weight: 700; color: var(--ink); }
  .result.up { color: #15803d; }
  .result.down { color: #dc2626; }
  :global(:root[data-theme='dark']) .result.up { color: #4ade80; }
  :global(:root[data-theme='dark']) .result.down { color: #f87171; }
  .copy { margin-left: auto; min-height: 36px; padding: 4px 12px; border: 1px solid var(--line); border-radius: 8px; color: var(--muted); font-size: 13px; font-weight: 500; transition: background 160ms, color 160ms, border-color 160ms; }
  .copy:hover { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .mini-toggle { display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--line); border-radius: 8px; background: var(--soft); text-transform: none; letter-spacing: 0; }
  .mini-toggle button { min-height: 32px; padding: 2px 10px; border-radius: 6px; color: var(--muted); font-size: 13px; font-weight: 500; }
  .mini-toggle button[aria-pressed='true'] { background: var(--surface); color: var(--accent); box-shadow: 0 1px 3px var(--shadow); }
  .ghost { min-height: 40px; align-items: center; padding: 4px 12px; border-radius: 8px; color: var(--accent); font-size: 14px; font-weight: 500; }
  .ghost:hover { background: var(--accent-soft); }
</style>
