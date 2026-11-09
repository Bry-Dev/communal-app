<script lang="ts">
  import { onMount } from 'svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import ToolHeader from '$lib/components/ToolHeader.svelte';
  import { receiveText } from '$lib/handoff';
  import {
    addToDate,
    ageOn,
    daysBetween,
    describeSpan,
    difference,
    formatDate,
    parseISODate,
    parseLooseDate,
    plural,
    toISO,
    today,
    weekdayName,
    weekdaysBetween,
    type Unit
  } from '$lib/date/calc';

  type Mode = 'between' | 'add' | 'age';
  const modes: Array<{ value: Mode; label: string }> = [
    { value: 'between', label: 'Days between' },
    { value: 'add', label: 'Add or subtract' },
    { value: 'age', label: 'Age' }
  ];
  const units: Unit[] = ['days', 'weeks', 'months', 'years'];
  const quickAdds: Array<{ amount: number; unit: Unit; label: string }> = [
    { amount: 7, unit: 'days', label: '+1 week' },
    { amount: 30, unit: 'days', label: '+30 days' },
    { amount: 90, unit: 'days', label: '+90 days' },
    { amount: 6, unit: 'months', label: '+6 months' },
    { amount: 1, unit: 'years', label: '+1 year' }
  ];

  let mode = $state<Mode>('between');
  // Dates start empty and are filled in the browser, so a prerendered page never shows the build day as "today".
  let now = $state('');
  let start = $state('');
  let end = $state('');
  let includeEnd = $state(false);
  let base = $state('');
  let direction = $state<'add' | 'subtract'>('add');
  let amount = $state(30);
  let unit = $state<Unit>('days');
  let birth = $state('');
  let asOf = $state('');

  onMount(() => {
    now = toISO(today());
    start = base = asOf = now;
    end = toISO(addToDate(today(), 30, 'days'));
    const sent = receiveText('date');
    const pasted = sent ? parseLooseDate(sent) : null;
    if (pasted) end = toISO(pasted);
  });

  const todayDate = $derived(parseISODate(now));

  // Days between
  const startDate = $derived(parseISODate(start));
  const endDate = $derived(parseISODate(end));
  const span = $derived(startDate && endDate ? difference(startDate, endDate) : null);
  const totalDays = $derived(span ? span.totalDays + (includeEnd ? 1 : 0) : 0);
  const weekdays = $derived(startDate && endDate ? weekdaysBetween(startDate, endDate, includeEnd) : 0);

  // Add or subtract
  const baseDate = $derived(parseISODate(base));
  const safeAmount = $derived(Number.isFinite(amount) ? Math.trunc(amount) : 0);
  const added = $derived(baseDate ? addToDate(baseDate, direction === 'add' ? safeAmount : -safeAmount, unit) : null);
  const fromToday = $derived(added && todayDate ? daysBetween(todayDate, added) : null);

  // Age
  const birthDate = $derived(parseISODate(birth));
  const asOfDate = $derived(parseISODate(asOf));
  const age = $derived(birthDate && asOfDate ? ageOn(birthDate, asOfDate) : null);

  function relative(days: number): string {
    if (days === 0) return 'today';
    return days > 0 ? `in ${plural(days, 'day')}` : `${plural(-days, 'day')} ago`;
  }

  function swap() {
    [start, end] = [end, start];
  }

  function tryExample() {
    const year = today().y;
    if (mode === 'between') {
      start = now;
      end = `${year}-12-25` < now ? `${year + 1}-12-25` : `${year}-12-25`;
    } else if (mode === 'add') {
      base = now;
      direction = 'add';
      amount = 90;
      unit = 'days';
    } else {
      birth = '1990-06-15';
      asOf = now;
    }
  }

  function quickAdd(item: (typeof quickAdds)[number]) {
    direction = 'add';
    amount = item.amount;
    unit = item.unit;
  }

  const statusItems = $derived.by(() => {
    if (mode === 'between' && span) {
      return [
        { label: 'days', value: totalDays, strong: true },
        { label: 'weeks', value: (totalDays / 7).toLocaleString(undefined, { maximumFractionDigits: 1 }) },
        { label: 'weekdays', value: weekdays }
      ];
    }
    if (mode === 'add' && added) return [{ label: '', value: weekdayName(added), strong: true }, { label: '', value: fromToday === null ? '' : relative(fromToday) }];
    if (mode === 'age' && age) return [{ label: 'years old', value: age.years, strong: true }, { label: 'days lived', value: age.totalDays }];
    return [];
  });
</script>

<svelte:head>
  <title>Date Calculator | App Hub</title>
  <meta name="description" content="Count the days between two dates, add or subtract days, weeks or months, and work out an age. Free and in your browser." />
</svelte:head>

<section class="tone-date">
  <div class="page-width pt-8 sm:pt-10">
    <ToolHeader code="date">
      {#snippet actions()}
        <button type="button" class="ghost inline-flex" onclick={tryExample}>Try an example</button>
      {/snippet}
    </ToolHeader>

    <div class="mb-4 flex" role="tablist" aria-label="Calculation">
      <div class="segmented">
        {#each modes as option}
          <button type="button" role="tab" aria-selected={mode === option.value} onclick={() => (mode = option.value)}>{option.label}</button>
        {/each}
      </div>
    </div>

    <div class="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <!-- Inputs -->
      <div class="panel p-5 sm:p-6" role="tabpanel">
        {#if mode === 'between'}
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label class="field-label flex-1">From<input type="date" class="field" bind:value={start} /></label>
            <button type="button" class="swap" onclick={swap} aria-label="Swap the two dates" title="Swap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" /></svg>
            </button>
            <label class="field-label flex-1">To<input type="date" class="field" bind:value={end} /></label>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" class="chip" onclick={() => (start = now)}>From today</button>
            <button type="button" class="chip" onclick={() => (end = now)}>To today</button>
            <label class="toggle ml-auto">
              <input type="checkbox" class="sr-only" bind:checked={includeEnd} />
              <span>Include end date</span>
            </label>
          </div>
        {:else if mode === 'add'}
          <label class="field-label">Start date<input type="date" class="field" bind:value={base} /></label>
          <div class="mt-4 flex flex-wrap items-end gap-2">
            <div class="segmented small" role="group" aria-label="Add or subtract">
              <button type="button" aria-pressed={direction === 'add'} onclick={() => (direction = 'add')} aria-label="Add">+</button>
              <button type="button" aria-pressed={direction === 'subtract'} onclick={() => (direction = 'subtract')} aria-label="Subtract">−</button>
            </div>
            <label class="sr-only" for="amount">Amount</label>
            <input id="amount" type="number" min="0" max="100000" bind:value={amount} class="field num w-28" />
            <label class="sr-only" for="unit">Unit</label>
            <select id="unit" bind:value={unit} class="field w-auto">
              {#each units as option}<option value={option}>{option}</option>{/each}
            </select>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            {#each quickAdds as item}
              <button type="button" class="chip num" onclick={() => quickAdd(item)}>{item.label}</button>
            {/each}
          </div>
        {:else}
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="field-label">Date of birth<input type="date" class="field" bind:value={birth} max={asOf || undefined} /></label>
            <label class="field-label">Age on<input type="date" class="field" bind:value={asOf} /></label>
          </div>
          <div class="mt-4 flex gap-2">
            <button type="button" class="chip" onclick={() => (asOf = now)}>Today</button>
          </div>
        {/if}
      </div>

      <!-- Answer -->
      <div class="answer panel flex flex-col justify-center p-5 sm:p-6" aria-live="polite">
        {#if mode === 'between'}
          {#if span}
            <p class="num text-5xl font-bold text-accent sm:text-6xl">{totalDays.toLocaleString()}<span class="ml-2 font-sans text-xl font-medium text-muted">{totalDays === 1 ? 'day' : 'days'}</span></p>
            <p class="mt-2 text-lg">{describeSpan(span)}{span.negative ? ' (going backwards)' : ''}</p>
            <dl class="tiles mt-5">
              <div><dt>Weeks</dt><dd class="num">{Math.floor(totalDays / 7)}w {totalDays % 7}d</dd></div>
              <div><dt>Weekdays</dt><dd class="num">{weekdays.toLocaleString()}</dd></div>
              <div><dt>Weekend days</dt><dd class="num">{(totalDays - weekdays).toLocaleString()}</dd></div>
            </dl>
          {:else}
            <p class="text-muted">Pick two dates.</p>
          {/if}
        {:else if mode === 'add'}
          {#if added}
            <p class="text-sm text-muted">{direction === 'add' ? 'Adding' : 'Subtracting'} {plural(safeAmount, unit.replace(/s$/, ''))} gives</p>
            <p class="mt-1 text-3xl font-bold text-accent sm:text-4xl">{formatDate(added)}</p>
            {#if fromToday !== null}<p class="mt-2 text-lg">That’s {relative(fromToday)}.</p>{/if}
          {:else}
            <p class="text-muted">Pick a start date.</p>
          {/if}
        {:else}
          {#if age}
            <p class="num text-5xl font-bold text-accent sm:text-6xl">{age.years}<span class="ml-2 font-sans text-xl font-medium text-muted">{age.years === 1 ? 'year old' : 'years old'}</span></p>
            <p class="mt-2 text-lg">{describeSpan({ years: 0, months: age.months, days: age.days }) === 'Same day' ? 'Exactly — happy birthday! 🎉' : `and ${describeSpan({ years: 0, months: age.months, days: age.days })}`}</p>
            <dl class="tiles mt-5">
              <div><dt>Next birthday</dt><dd>{age.daysToBirthday === 0 ? 'Today' : `in ${plural(age.daysToBirthday, 'day')}`}<span class="block text-xs font-normal text-muted">{weekdayName(age.nextBirthday)}</span></dd></div>
              <div><dt>Born on a</dt><dd>{birthDate ? weekdayName(birthDate) : ''}</dd></div>
              <div><dt>Days lived</dt><dd class="num">{age.totalDays.toLocaleString()}</dd></div>
            </dl>
          {:else if birthDate && asOfDate}
            <p class="text-warning">The date of birth is after the “age on” date.</p>
          {:else}
            <p class="text-muted">Enter a date of birth.</p>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <StatusBar items={statusItems} />
</section>

<style>
  .segmented { display: inline-flex; gap: 2px; padding: 4px; border: 1px solid var(--line); border-radius: 12px; background: var(--soft); }
  .segmented button { min-height: 40px; padding: 6px 16px; border-radius: 9px; color: var(--muted); font-size: 14px; font-weight: 500; transition: background 160ms, color 160ms, box-shadow 160ms; }
  .segmented button:hover { color: var(--ink); }
  .segmented button[aria-selected='true'], .segmented button[aria-pressed='true'] { background: var(--surface); color: var(--accent); font-weight: 600; box-shadow: 0 1px 4px var(--shadow); }
  .segmented.small button { min-width: 44px; min-height: 40px; padding: 4px 10px; font-size: 18px; }
  .field-label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--muted); }
  .field-label .field { color-scheme: inherit; font-size: 16px; font-weight: 400; }
  .swap { display: inline-flex; width: 48px; height: 48px; flex-shrink: 0; align-items: center; justify-content: center; align-self: center; border: 1px solid var(--line); border-radius: 12px; color: var(--muted); transition: background 160ms, color 160ms, transform 200ms; }
  .swap:hover { background: var(--accent-soft); color: var(--accent); transform: rotate(180deg); }
  @media (min-width: 640px) { .swap { align-self: flex-end; } }
  .chip { min-height: 36px; padding: 4px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--muted); font-size: 13px; transition: background 160ms, color 160ms, border-color 160ms; }
  .chip:hover { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .toggle { cursor: pointer; }
  .toggle > span { display: inline-flex; min-height: 36px; align-items: center; padding: 4px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--muted); font-size: 13px; transition: border-color 160ms, background 160ms, color 160ms; }
  .toggle input:checked + span { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 600; }
  .toggle input:focus-visible + span { outline: 3px solid var(--accent); outline-offset: 2px; }
  .ghost { min-height: 40px; align-items: center; padding: 4px 12px; border-radius: 8px; color: var(--accent); font-size: 14px; font-weight: 500; }
  .ghost:hover { background: var(--accent-soft); }
  .answer { min-height: 240px; background: color-mix(in srgb, var(--accent-soft) 40%, var(--surface)); }
  .tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .tiles div { padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
  .tiles dt { font-size: 12px; color: var(--muted); }
  .tiles dd { margin-top: 2px; font-weight: 600; }
</style>
