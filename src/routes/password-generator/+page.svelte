<script lang="ts">
  import { untrack } from 'svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import ToolHeader from '$lib/components/ToolHeader.svelte';
  import {
    MAX_LENGTH,
    MIN_LENGTH,
    defaultPasswordOptions,
    entropyBits,
    generatePassword,
    kindOf,
    selectedPools,
    strengthOf,
    type CharSetKey,
    type PasswordOptions
  } from '$lib/password/generate';

  const sets: Array<{ key: CharSetKey; label: string; sample: string }> = [
    { key: 'upper', label: 'Uppercase', sample: 'ABC' },
    { key: 'lower', label: 'Lowercase', sample: 'abc' },
    { key: 'digits', label: 'Numbers', sample: '123' },
    { key: 'symbols', label: 'Symbols', sample: '#$&' }
  ];
  const quickLengths = [12, 16, 24, 32];

  let options = $state<PasswordOptions>({ ...defaultPasswordOptions });
  // Generated only in the browser: effects never run while the page is prerendered.
  let password = $state('');
  let copied = $state(false);
  let spin = $state(0);

  const bits = $derived(entropyBits(options));
  const strength = $derived(strengthOf(bits));
  const noneSelected = $derived(!sets.some((charSet) => options[charSet.key]));
  const poolSize = $derived(selectedPools(options).join('').length);

  function regenerate() {
    password = generatePassword(options);
    copied = false;
    spin += 1;
  }

  // Make a new password whenever an option changes.
  $effect(() => {
    void [options.length, options.lower, options.upper, options.digits, options.symbols, options.avoidAmbiguous];
    // untrack: regenerate() reads `spin`, which must not become a dependency of this effect.
    untrack(regenerate);
  });

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      copied = true;
    } catch {
      copied = false;
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      copy();
    }
  }

  function setLength(value: number) {
    options.length = Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, Math.round(value) || defaultPasswordOptions.length));
  }
</script>

<svelte:head>
  <title>Password Generator | App Hub</title>
  <meta name="description" content="Create strong, random passwords in your browser. Choose the length and characters, then copy." />
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<section class="tone-password">
  <div class="page-width pt-8 sm:pt-10">
    <ToolHeader code="password" />

    <div class="panel overflow-hidden">
      <!-- The password itself, with numbers and symbols tinted so they're easy to read back. -->
      <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-7">
        {#if noneSelected}
          <p class="empty flex min-h-12 min-w-0 flex-1 items-center gap-3 text-base font-medium" role="alert">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h0" /></svg>
            Select at least one character type under Include to make a password.
          </p>
        {:else}
          <output class="password num min-h-12 min-w-0 flex-1 break-all text-2xl leading-snug sm:text-3xl" aria-live="polite" aria-label="Generated password">
            {#each password as char, i (i + '-' + spin)}<span class={kindOf(char)}>{char}</span>{/each}
          </output>
        {/if}
        <div class="flex shrink-0 gap-2">
          <button type="button" class="button button-secondary" onclick={regenerate} disabled={noneSelected} aria-label="Generate a new password" title="New password">
            <svg class="refresh" style="transform: rotate({spin * 180}deg)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>
            <span class="sm:hidden">New</span>
          </button>
          <button type="button" class="button flex-1" onclick={copy} disabled={!password}>
            {copied ? 'Copied ✓' : 'Copy'}
            <span class="kbd hidden border-transparent bg-transparent text-current opacity-75 shadow-none sm:inline-flex">Ctrl ↵</span>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3 border-t border-line px-5 py-3 sm:px-7">
        <div class="meter" role="meter" aria-label="Password strength" aria-valuemin="0" aria-valuemax="3" aria-valuenow={noneSelected ? 0 : strength.level} aria-valuetext={noneSelected ? 'No password' : strength.label}>
          {#each [0, 1, 2, 3] as step}<span class:on={!noneSelected && step <= strength.level} data-level={strength.level}></span>{/each}
        </div>
        {#if noneSelected}
          <span class="text-sm text-muted">—</span>
        {:else}
          <span class="text-sm font-semibold strength-{strength.level}">{strength.label}</span>
        {/if}
      </div>
    </div>

    <div class="panel mt-4 grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto]">
      <div>
        <div class="mb-2 flex items-baseline justify-between gap-3">
          <label for="length" class="text-xs font-semibold uppercase tracking-wider text-muted">Length</label>
          <input
            type="number"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={options.length}
            onchange={(event) => setLength(Number(event.currentTarget.value))}
            class="num w-20 rounded-lg border border-line bg-surface px-2 py-1 text-right text-ink"
            aria-label="Length in characters"
          />
        </div>
        <input id="length" type="range" min={MIN_LENGTH} max="64" bind:value={options.length} class="w-full" />
        <div class="mt-3 flex flex-wrap gap-1.5">
          {#each quickLengths as length}
            <button type="button" class="chip" aria-pressed={options.length === length} onclick={() => (options.length = length)}>{length}</button>
          {/each}
        </div>
      </div>

      <fieldset>
        <legend class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Include</legend>
        <div class="flex flex-wrap gap-1.5">
          <!-- Not named `set`: Svelte's dev build compiles bind:checked into a function called `set`, which would shadow it. -->
          {#each sets as charSet (charSet.key)}
            <label class="toggle">
              <input type="checkbox" class="sr-only" bind:checked={options[charSet.key]} aria-describedby={noneSelected ? 'none-selected' : undefined} />
              <span><span class="num opacity-70">{charSet.sample}</span>{charSet.label}</span>
            </label>
          {/each}
        </div>
        {#if noneSelected}
          <p id="none-selected" class="mt-2 text-sm font-medium text-warning">Select at least one.</p>
        {/if}
        <label class="toggle mt-3 inline-block">
          <input type="checkbox" class="sr-only" bind:checked={options.avoidAmbiguous} />
          <span>Avoid look-alikes <span class="num opacity-70">I l 1 O 0</span></span>
        </label>
      </fieldset>
    </div>
  </div>

  <StatusBar
    items={[
      { label: 'characters', value: password.length, strong: true },
      { label: 'possible each', value: poolSize },
      { label: 'bits', value: `~${bits}` }
    ]}
  />
</section>

<style>
  .password { letter-spacing: 0.02em; color: var(--ink); }
  .password .digit { color: var(--accent); }
  .password .symbol { color: var(--tone-xml); }
  .password span { animation: drop 260ms ease-out both; }
  @keyframes drop { from { opacity: 0; transform: translateY(-4px); } }
  .refresh { transition: transform 300ms ease; }

  .meter { display: grid; width: min(240px, 50%); grid-template-columns: repeat(4, 1fr); gap: 4px; }
  .meter span { height: 6px; border-radius: 3px; background: var(--soft); transition: background 200ms; }
  .meter span.on[data-level='0'] { background: #dc2626; }
  .meter span.on[data-level='1'] { background: #d97706; }
  .meter span.on[data-level='2'], .meter span.on[data-level='3'] { background: #16a34a; }
  .strength-0 { color: #dc2626; }
  .strength-1 { color: #b45309; }
  .strength-2, .strength-3 { color: #15803d; }
  :global(:root[data-theme='dark']) .strength-0 { color: #f87171; }
  :global(:root[data-theme='dark']) .strength-1 { color: #fbbf24; }
  :global(:root[data-theme='dark']) .strength-2, :global(:root[data-theme='dark']) .strength-3 { color: #4ade80; }

  .chip { min-width: 44px; min-height: 36px; padding: 4px 10px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--muted); font-family: 'JetBrains Mono Variable', ui-monospace, monospace; font-size: 13px; transition: background 160ms, border-color 160ms, color 160ms; }
  .chip:hover { background: var(--soft); color: var(--ink); }
  .chip[aria-pressed='true'] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }

  .toggle { cursor: pointer; }
  .toggle > span { display: inline-flex; min-height: 36px; align-items: center; gap: 8px; padding: 4px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--muted); font-size: 13px; transition: border-color 160ms, background 160ms, color 160ms; }
  .toggle:hover > span { background: var(--soft); color: var(--ink); }
  .toggle input:checked + span { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
  .toggle input:focus-visible + span { outline: 3px solid var(--accent); outline-offset: 2px; }
  .empty { color: var(--warning); }
</style>
