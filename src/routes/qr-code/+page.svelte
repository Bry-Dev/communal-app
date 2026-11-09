<script lang="ts">
  import SvgQR from '@svelte-put/qr/svg/QR.svelte';
  import QrContentForm from '$lib/components/QrContentForm.svelte';
  import { buildQrContent, createQrContent, qrTypes } from '$lib/qr/content';
  import { createQrPngDataUrl } from '@svelte-put/qr';
  import { onMount } from 'svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import ToolHeader from '$lib/components/ToolHeader.svelte';
  import { receiveText } from '$lib/handoff';

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const MAX_DIMENSION = 1000;

  const shapeOptions = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' }
  ] as const;

  const presets = [
    {
      label: 'App Hub',
      moduleFill: '#1c1a17',
      anchorOuterFill: '#c2410c',
      anchorInnerFill: '#9a3412',
      backgroundFill: '#fffdf8',
      shape: 'square' as const
    },
    {
      label: 'Classic Light',
      moduleFill: '#000000',
      anchorOuterFill: '#000000',
      anchorInnerFill: '#000000',
      backgroundFill: '#ffffff',
      shape: 'square' as const
    },
    {
      label: 'Classic Dark',
      moduleFill: '#ffffff',
      anchorOuterFill: '#ffffff',
      anchorInnerFill: '#ffffff',
      backgroundFill: '#020617',
      shape: 'square' as const
    },
    {
      label: 'Ocean Glow',
      moduleFill: '#7dd3fc',
      anchorOuterFill: '#38bdf8',
      anchorInnerFill: '#e0f2fe',
      backgroundFill: '#082f49',
      shape: 'circle' as const
    },
    {
      label: 'Mint Light',
      moduleFill: '#064e3b',
      anchorOuterFill: '#047857',
      anchorInnerFill: '#064e3b',
      backgroundFill: '#ecfdf5',
      shape: 'square' as const
    },
    {
      label: 'Blueprint',
      moduleFill: '#1e3a8a',
      anchorOuterFill: '#1d4ed8',
      anchorInnerFill: '#1e40af',
      backgroundFill: '#eff6ff',
      shape: 'square' as const
    },
    {
      label: 'Forest',
      moduleFill: '#14532d',
      anchorOuterFill: '#166534',
      anchorInnerFill: '#14532d',
      backgroundFill: '#f0fdf4',
      shape: 'circle' as const
    },
    {
      label: 'Plum',
      moduleFill: '#581c87',
      anchorOuterFill: '#7e22ce',
      anchorInnerFill: '#581c87',
      backgroundFill: '#faf5ff',
      shape: 'circle' as const
    },
    {
      label: 'Warm Ink',
      moduleFill: '#78350f',
      anchorOuterFill: '#92400e',
      anchorInnerFill: '#78350f',
      backgroundFill: '#fffbeb',
      shape: 'square' as const
    }
  ];

  const defaultPreset = presets[0];

  let logo = $state('');
  let logoPreview = $state('');
  let moduleFill = $state(defaultPreset.moduleFill);
  let anchorOuterFill = $state(defaultPreset.anchorOuterFill);
  let anchorInnerFill = $state(defaultPreset.anchorInnerFill);
  let backgroundFill = $state(defaultPreset.backgroundFill);
  let width = $state(500);
  let height = $state(500);
  let content = $state(createQrContent());
  const payload = $derived(buildQrContent(content));
  const data = $derived(payload.data);
  const contentType = $derived(qrTypes.find((type) => type.value === content.kind)!);
  let withLogo = $state(false);
  let showPreview = $state(false);
  let isWidthErr = $state(false);
  let isHeightErr = $state(false);
  let files: FileList | null = $state(null);
  let shape: 'circle' | 'square' = $state(defaultPreset.shape);
  let dataURL = $state('');
  let exportError = $state('');
  const dimensionError = $derived(
    !Number.isInteger(width) || !Number.isInteger(height) ||
    Number(width) < 120 || Number(height) < 120 || Number(width) > 1600 || Number(height) > 1600
      ? 'Choose a width and height between 120 and 1600 pixels.'
      : ''
  );

  const selectedPreset = $derived(presets.find((preset) =>
    preset.moduleFill === moduleFill &&
    preset.anchorOuterFill === anchorOuterFill &&
    preset.anchorInnerFill === anchorInnerFill &&
    preset.backgroundFill === backgroundFill &&
    preset.shape === shape
  ));

  $effect(() => {
    isWidthErr = Number(width) > MAX_DIMENSION;
    isHeightErr = Number(height) > MAX_DIMENSION;
  });

  $effect(() => {
    dataURL = '';
    exportError = '';
    if (!data || dimensionError) return;

    const config = {
      data,
      width: Number(width) || 500,
      height: Number(height) || 500,
      moduleFill,
      backgroundFill,
      anchorInnerFill,
      anchorOuterFill,
      margin: 4,
      shape,
      logo: withLogo && logo ? logo : undefined
    };

    let cancelled = false;
    const timer = setTimeout(() => {
      createQrPngDataUrl(config).then((response) => {
        if (!cancelled) dataURL = response;
      }).catch(() => {
        if (!cancelled) exportError = 'Could not prepare the PNG. Try a smaller size or remove the logo.';
      });
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  });

  let downloadLink: HTMLAnchorElement | undefined = $state();

  onMount(() => {
    const sent = receiveText('qr');
    if (sent !== undefined) content = { ...content, kind: 'text', text: sent.trim() };
  });

  function tryExample() {
    content = { ...content, kind: 'wifi', wifi: { ssid: 'Garden-Guest', password: 'lemon-cake-2026', security: 'WPA', hidden: false } };
  }

  function onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && downloadLink) {
      event.preventDefault();
      downloadLink.click();
    }
  }

  function applyPreset(preset: (typeof presets)[number]) {
    moduleFill = preset.moduleFill;
    anchorOuterFill = preset.anchorOuterFill;
    anchorInnerFill = preset.anchorInnerFill;
    backgroundFill = preset.backgroundFill;
    shape = preset.shape;
  }

  function loadIcon() {
    if (files && files instanceof FileList && files[0] && validImageTypes.includes(files[0].type)) {
      const reader = new FileReader();

      reader.addEventListener('load', function () {
        logo = reader.result!.toString();
        logoPreview = reader.result!.toString();
      });

      reader.readAsDataURL(files[0]);
      showPreview = true;
      return;
    }

    files = new DataTransfer().files;
    showPreview = false;
    logoPreview = '';
    logo = '';
    alert('Please select a PNG, JPG, or GIF image.');
  }

  function removeLogo() {
    files = new DataTransfer().files;
    logo = '';
    logoPreview = '';
    showPreview = false;
    withLogo = false;
  }
</script>

<svelte:head>
  <title>QR Code Generator | App Hub</title>
  <meta
    name="description"
    content="Create QR codes for links, Wi-Fi, email, phone, SMS, and contact cards. Customize colors and download a PNG."
  />
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<section class="tone-qr">
  <div class="page-width pt-8 sm:pt-10">
    <ToolHeader code="qr">
      {#snippet actions()}
        <button type="button" class="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-accent hover:bg-accent-soft" onclick={tryExample}>Try a Wi-Fi example</button>
      {/snippet}
    </ToolHeader>

    <div class="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
      <div class="space-y-6">
        <div class="panel p-5 sm:p-7">
          <div class="space-y-8">
            <QrContentForm bind:content error={payload.error} />

            <details class="preset-picker rounded-xl border border-line">
              <summary id="preset-heading" class="flex min-h-14 cursor-pointer list-none flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
                <span class="font-semibold">Quick presets</span>
                <span class="flex items-center gap-2 text-muted">
                  {selectedPreset?.label ?? 'Custom colors'}
                  <svg class="preset-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </summary>
              <div class="grid grid-cols-2 gap-3 px-4 pb-4" role="group" aria-labelledby="preset-heading">
                {#each presets as preset}
                  <button
                    type="button"
                    onclick={() => applyPreset(preset)}
                    aria-pressed={selectedPreset === preset}
                    class="preset-button"
                  >
                    <svg class="preset-swatch" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                      <rect x="0.5" y="0.5" width="35" height="35" rx="6" fill={preset.backgroundFill} stroke="var(--line)" />
                      <path d="M6 6h9v9H6zm15 0h9v9h-9zM6 21h9v9H6z" stroke={preset.anchorOuterFill} stroke-width="2" />
                      <path d="M9 9h3v3H9zm15 0h3v3h-3zM9 24h3v3H9z" fill={preset.anchorInnerFill} />
                      <path d="M21 21h4v4h-4zm5 5h4v4h-4zm-5 0h3v4h-3zm6-5h3v3h-3z" fill={preset.moduleFill} />
                    </svg>
                    <span class="min-w-0">
                      <span class="block text-sm font-medium">{preset.label}</span>
                      <span class="block text-xs text-muted">{preset === defaultPreset ? 'Default' : preset.shape === 'circle' ? 'Round dots' : 'Square dots'}</span>
                    </span>
                  </button>
                {/each}
              </div>
            </details>

            <div class="grid gap-5 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="height" class="flex items-center gap-2 text-sm font-medium text-ink sm:text-sm">
                  Height
                  {#if isHeightErr}
                    <span class="rounded-lg bg-warning-soft px-2.5 py-1 text-sm font-semibold text-warning">
                      Large file
                    </span>
                  {/if}
                </label>
                <input
                  id="height"
                  type="number"
                  min="120"
                  max="1600"
                  bind:value={height}
                  class="block w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div class="space-y-2">
                <label for="width" class="flex items-center gap-2 text-sm font-medium text-ink sm:text-sm">
                  Width
                  {#if isWidthErr}
                    <span class="rounded-lg bg-warning-soft px-2.5 py-1 text-sm font-semibold text-warning">
                      Large file
                    </span>
                  {/if}
                </label>
                <input
                  id="width"
                  type="number"
                  min="120"
                  max="1600"
                  bind:value={width}
                  class="block w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div class="rounded-xl border border-line bg-soft p-4">
                <label for="background-color" class="mb-3 block text-sm font-medium text-ink sm:text-sm">Background</label>
                <div class="flex items-center gap-3">
                  <input id="background-color" type="color" bind:value={backgroundFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-line bg-transparent" />
                  <span class="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-muted">{backgroundFill}</span>
                </div>
              </div>

              <div class="rounded-xl border border-line bg-soft p-4">
                <label for="module-color" class="mb-3 block text-sm font-medium text-ink sm:text-sm">QR pattern</label>
                <div class="flex items-center gap-3">
                  <input id="module-color" type="color" bind:value={moduleFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-line bg-transparent" />
                  <span class="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-muted">{moduleFill}</span>
                </div>
              </div>

              <div class="rounded-xl border border-line bg-soft p-4">
                <label for="anchor-inner-color" class="mb-3 block text-sm font-medium text-ink sm:text-sm">Inner corners</label>
                <div class="flex items-center gap-3">
                  <input id="anchor-inner-color" type="color" bind:value={anchorInnerFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-line bg-transparent" />
                  <span class="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-muted">{anchorInnerFill}</span>
                </div>
              </div>

              <div class="rounded-xl border border-line bg-soft p-4">
                <label for="anchor-outer-color" class="mb-3 block text-sm font-medium text-ink sm:text-sm">Outer corners</label>
                <div class="flex items-center gap-3">
                  <input id="anchor-outer-color" type="color" bind:value={anchorOuterFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-line bg-transparent" />
                  <span class="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-muted">{anchorOuterFill}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-muted sm:text-sm">Shape</h3>
              <div class="inline-flex rounded-lg border border-line bg-soft p-1">
                {#each shapeOptions as option}
                  <label class="cursor-pointer">
                    <input type="radio" class="sr-only" name="shape" value={option.value} bind:group={shape} />
                    <span
                      class:selected-pill={shape === option.value}
                      class="inline-flex rounded-lg px-4 py-2 text-sm font-medium text-muted transition sm:text-sm"
                    >
                      {option.label}
                    </span>
                  </label>
                {/each}
              </div>
            </div>

            <div class="rounded-xl border border-line bg-soft p-5">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-muted sm:text-sm">Add a logo</h3>
                  <p class="mt-2 text-sm leading-6 text-muted sm:text-sm">
                    Add a PNG or JPG logo in the center for branded sharing.
                  </p>
                </div>

                <label class="inline-flex cursor-pointer items-center gap-3">
                  <span class="text-sm font-medium text-ink sm:text-sm">Enable</span>
                  <input type="checkbox" bind:checked={withLogo} class="h-5 w-5 rounded border-line bg-surface text-accent focus:ring-accent" />
                </label>
              </div>

              {#if withLogo}
                <div class="mt-5 space-y-4">
                  <input
                    aria-label="Choose a logo image"
                    id="add-icon"
                    accept="image/jpeg, image/png, image/gif"
                    type="file"
                    bind:files
                    onchange={loadIcon}
                    class="block w-full rounded-2xl border border-dashed border-line bg-surface px-4 py-3 text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-accent hover:file:opacity-90 sm:text-sm sm:file:text-sm"
                  />

                  {#if showPreview}
                    <div class="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center gap-4">
                        <img src={logoPreview} alt="Logo preview" class="h-16 w-16 rounded-2xl object-cover ring-1 ring-line" />
                        <div>
                          <p class="text-sm font-medium text-ink sm:text-sm">Logo preview ready</p>
                          <p class="text-sm text-muted sm:text-sm">Centered inside the QR code.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onclick={removeLogo}
                        class="inline-flex items-center justify-center rounded-lg border border-line bg-soft px-4 py-2 text-sm font-medium text-ink transition hover:bg-soft sm:text-sm"
                      >
                        Remove logo
                      </button>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-20">
        <div class="panel overflow-hidden">
          <div class="border-b border-line px-5 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h2 class="text-lg font-bold">Preview</h2>
              {#if dataURL && data && !dimensionError}
                <a
                  bind:this={downloadLink}
                  href={dataURL}
                  download={`qr-${content.kind}.png`}
                  class="button"
                >
                  Download PNG <span class="kbd hidden border-transparent bg-transparent text-current opacity-75 shadow-none sm:inline-flex">Ctrl ↵</span>
                </a>
              {:else}
                <button type="button" disabled class="button cursor-not-allowed opacity-50">{data && !dimensionError && !exportError ? 'Preparing PNG...' : 'Download PNG'}</button>
              {/if}
            </div>
          </div>

          <div class="space-y-4 p-5 sm:p-6">
            <div class="checker rounded-xl p-3 sm:p-6">
              <div class="flex items-center justify-center p-2">
                {#if data}
                  <SvgQR
                    style="background-color: {backgroundFill};"
                    class="aspect-square h-auto w-full max-w-[340px]"
                    {data}
                    margin={4}
                    {shape}
                    {moduleFill}
                    {anchorOuterFill}
                    {anchorInnerFill}
                    logo={withLogo && logo ? logo : undefined}
                    role="img"
                    aria-label={`${contentType.label} QR code`}
                  />
                {:else}
                  <div class="flex aspect-square w-full max-w-[340px] items-center justify-center px-5 text-center text-sm text-muted">{payload.error}</div>
                {/if}
              </div>
            </div>

            {#if dimensionError || exportError}
              <p class="rounded-lg bg-warning-soft px-4 py-3 text-sm text-warning" role="status">{dimensionError || exportError}</p>
            {/if}

            <p class="text-center text-xs text-muted">Tip: dark dots on a light background scan best.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <StatusBar
    items={[
      { label: '', value: contentType.label, strong: true },
      { label: 'px', value: `${width}×${height}` },
      { label: 'dots', value: shape === 'circle' ? 'round' : 'square' },
      { label: 'logo', value: withLogo && logo ? 'with' : 'no' }
    ]}
  />
</section>

<style>
  .checker { background-color: var(--soft); background-image: radial-gradient(var(--line) 1px, transparent 1px); background-size: 14px 14px; }
  .preset-picker summary:hover { background: var(--soft); }
  .preset-chevron { transition: transform 160ms; }
  .preset-picker[open] .preset-chevron { transform: rotate(180deg); }
  .preset-button {
    display: flex;
    min-height: 64px;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--surface);
    color: var(--ink);
    text-align: left;
    transition: border-color 160ms, background 160ms, box-shadow 160ms;
  }
  .preset-button:hover { border-color: var(--accent); background: var(--soft); }
  .preset-button[aria-pressed='true'] { border-color: var(--accent); background: var(--accent-soft); box-shadow: inset 0 0 0 1px var(--accent); }
  .preset-swatch { flex-shrink: 0; }
  @media (max-width: 379px) {
    .preset-button { flex-direction: column; align-items: flex-start; }
  }
  .selected-pill {
    background: var(--accent);
    color: var(--on-accent);

  }
</style>
