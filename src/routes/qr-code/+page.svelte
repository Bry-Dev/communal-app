<script lang="ts">
  import { onMount } from 'svelte';
  import SvgQR from '@svelte-put/qr/svg/QR.svelte';
  import { resolve } from '$app/paths';
  import { createQrPngDataUrl } from '@svelte-put/qr';

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const MAX_DIMENSION = 1000;

  const shapeOptions = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' }
  ] as const;

  const presets = [
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
      moduleFill: '#0f172a',
      anchorOuterFill: '#0f172a',
      anchorInnerFill: '#10b981',
      backgroundFill: '#ecfeff',
      shape: 'square' as const
    }
  ];

  let logo = $state('https://placehold.co/600x400');
  let logoPreview = $state('');
  let moduleFill = $state('#ffffff');
  let anchorOuterFill = $state('#ffffff');
  let anchorInnerFill = $state('#ffffff');
  let backgroundFill = $state('#000000');
  let width = $state(500);
  let height = $state(500);
  let data = $state('https://bry-dev.github.io/communal-app/');
  let withLogo = $state(false);
  let showPreview = $state(false);
  let isWidthErr = $state(false);
  let isHeightErr = $state(false);
  let files: FileList | null = $state(null);
  let shape: 'circle' | 'square' = $state('circle');
  let dataURL = $state('');

  $effect(() => {
    isWidthErr = Number(width) > MAX_DIMENSION;
    isHeightErr = Number(height) > MAX_DIMENSION;
  });

  $effect(() => {
    const config = {
      data,
      width: Number(width) || 500,
      height: Number(height) || 500,
      moduleFill,
      backgroundFill,
      anchorInnerFill,
      anchorOuterFill,
      shape,
      logo: withLogo ? logo : undefined
    };

    createQrPngDataUrl(config).then((response) => {
      dataURL = response;
    });
  });

  onMount(async () => {
    dataURL = await createQrPngDataUrl({
      data,
      width: 500,
      height: 500,
      backgroundFill,
      moduleFill,
      anchorInnerFill,
      anchorOuterFill,
      shape
    });
  });

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
    logo = 'https://placehold.co/600x400';
    logoPreview = '';
    showPreview = false;
    withLogo = false;
  }
</script>

<svelte:head>
  <title>QR Code Generator | App Hub</title>
  <meta
    name="description"
    content="Generate and customize QR codes with color, shape, size, and logo controls."
  />
</svelte:head>

<section class="relative overflow-hidden bg-slate-950 text-white">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(139,92,246,0.18),_transparent_24%),linear-gradient(to_bottom,_rgba(15,23,42,0.98),_rgba(2,6,23,1))]"></div>
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]"></div>

  <div class="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
    <div class="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div class="max-w-3xl space-y-4">
        <a
          href={resolve('/')}
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur transition hover:bg-white/10"
        >
          ← Back to App Hub
        </a>

        <div class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300 sm:text-sm">Live utility</p>
          <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            QR Code Generator
          </h1>
          <p class="max-w-2xl text-xs leading-6 text-slate-300 sm:text-sm lg:text-base">
            Create a branded QR code with custom colors, shape, size, and an optional logo.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 text-xs text-slate-200 sm:text-sm">
        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">PNG download</span>
        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Logo support</span>
        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Live preview</span>
      </div>
    </div>

    <div class="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
      <div class="space-y-6">
        <div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
          <div class="mb-6 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300 sm:text-sm">Customize</p>
              <h2 class="mt-2 text-xl font-semibold text-white sm:text-2xl">Build your QR code</h2>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Canvas</p>
              <p class="mt-1 text-base font-semibold text-white sm:text-lg">{width} × {height}</p>
            </div>
          </div>

          <div class="space-y-8">
            <div class="space-y-3">
              <label for="text-convert" class="block text-xs font-medium text-slate-200 sm:text-sm">Text or URL</label>
              <textarea
                id="text-convert"
                bind:value={data}
                rows="4"
                class="block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:border-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20 sm:text-sm"
                placeholder="Paste a URL, text, or contact info"
              ></textarea>
              <p class="text-xs text-slate-400 sm:text-sm">Best for links, Wi-Fi credentials, profile URLs, menus, and event signage.</p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <h3 class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 sm:text-sm">Quick presets</h3>
                <p class="text-xs text-slate-500">One tap theme</p>
              </div>
              <div class="flex flex-wrap gap-3">
                {#each presets as preset}
                  <button
                    type="button"
                    onclick={() => applyPreset(preset)}
                    class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10 sm:text-sm"
                  >
                    {preset.label}
                  </button>
                {/each}
              </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="height" class="flex items-center gap-2 text-xs font-medium text-slate-200 sm:text-sm">
                  Height
                  {#if isHeightErr}
                    <span class="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
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
                  class="block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
              </div>

              <div class="space-y-2">
                <label for="width" class="flex items-center gap-2 text-xs font-medium text-slate-200 sm:text-sm">
                  Width
                  {#if isWidthErr}
                    <span class="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
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
                  class="block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="background-color" class="mb-3 block text-xs font-medium text-slate-200 sm:text-sm">Background</label>
                <div class="flex items-center gap-3">
                  <input id="background-color" type="color" bind:value={backgroundFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{backgroundFill}</span>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="module-color" class="mb-3 block text-xs font-medium text-slate-200 sm:text-sm">Module</label>
                <div class="flex items-center gap-3">
                  <input id="module-color" type="color" bind:value={moduleFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{moduleFill}</span>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="anchor-inner-color" class="mb-3 block text-xs font-medium text-slate-200 sm:text-sm">Inner anchor</label>
                <div class="flex items-center gap-3">
                  <input id="anchor-inner-color" type="color" bind:value={anchorInnerFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{anchorInnerFill}</span>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="anchor-outer-color" class="mb-3 block text-xs font-medium text-slate-200 sm:text-sm">Outer anchor</label>
                <div class="flex items-center gap-3">
                  <input id="anchor-outer-color" type="color" bind:value={anchorOuterFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{anchorOuterFill}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 sm:text-sm">Shape</h3>
              <div class="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                {#each shapeOptions as option}
                  <label class="cursor-pointer">
                    <input type="radio" class="sr-only" name="shape" value={option.value} bind:group={shape} />
                    <span
                      class:selected-pill={shape === option.value}
                      class="inline-flex rounded-full px-4 py-2 text-xs font-medium text-slate-300 transition sm:text-sm"
                    >
                      {option.label}
                    </span>
                  </label>
                {/each}
              </div>
            </div>

            <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 sm:text-sm">Logo overlay</h3>
                  <p class="mt-2 text-xs leading-6 text-slate-400 sm:text-sm">
                    Add a PNG or JPG logo in the center for branded sharing.
                  </p>
                </div>

                <label class="inline-flex cursor-pointer items-center gap-3">
                  <span class="text-xs font-medium text-slate-200 sm:text-sm">Enable</span>
                  <input type="checkbox" bind:checked={withLogo} class="h-5 w-5 rounded border-white/20 bg-slate-950/70 text-sky-400 focus:ring-sky-400/30" />
                </label>
              </div>

              {#if withLogo}
                <div class="mt-5 space-y-4">
                  <input
                    id="add-icon"
                    accept="image/jpeg, image/png, image/gif"
                    type="file"
                    bind:files
                    onchange={loadIcon}
                    class="block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/60 px-4 py-3 text-xs text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-sky-100 sm:text-sm sm:file:text-sm"
                  />

                  {#if showPreview}
                    <div class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center gap-4">
                        <img src={logoPreview} alt="Logo preview" class="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/10" />
                        <div>
                          <p class="text-xs font-medium text-white sm:text-sm">Logo preview ready</p>
                          <p class="text-xs text-slate-400 sm:text-sm">Centered inside the QR code.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onclick={removeLogo}
                        class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 sm:text-sm"
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

      <div class="xl:sticky xl:top-24">
        <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div class="border-b border-white/10 px-6 py-5 sm:px-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300 sm:text-sm">Preview</p>
                <h2 class="mt-2 text-xl font-semibold text-white sm:text-2xl">Ready to export</h2>
              </div>
              <a
                href={dataURL}
                download="qr.png"
                class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-xs font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-sm"
              >
                Download PNG
              </a>
            </div>
          </div>

          <div class="space-y-6 p-6 sm:p-8">
            <div class="rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_35%),rgba(2,6,23,0.9)] p-6 sm:p-8">
              <div class="flex min-h-[360px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/60 p-4">
                <SvgQR
                  style="background-color: {backgroundFill};"
                  class="h-full max-h-[340px] w-full max-w-[340px] rounded-2xl"
                  {data}
                  {shape}
                  {moduleFill}
                  {anchorOuterFill}
                  {anchorInnerFill}
                  logo={withLogo ? logo : undefined}
                />
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Shape</p>
                <p class="mt-2 text-xs font-medium text-white sm:text-sm">{shape}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Logo</p>
                <p class="mt-2 text-xs font-medium text-white sm:text-sm">{withLogo ? 'Enabled' : 'None'}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Text length</p>
                <p class="mt-2 text-xs font-medium text-white sm:text-sm">{data.length} chars</p>
              </div>
            </div>

            <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h3 class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 sm:text-sm">Helpful notes</h3>
              <ul class="mt-4 space-y-3 text-xs leading-6 text-slate-300 sm:text-sm">
                <li>• Keep height and width balanced for a crisp square export.</li>
                <li>• Larger than 1000px still works, but the resulting PNG will be heavier.</li>
                <li>• High contrast between background and module colors improves scan reliability.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .selected-pill {
    background: rgba(255, 255, 255, 0.95);
    color: rgb(2, 6, 23);
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
  }
</style>