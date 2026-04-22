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
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Live utility</p>
          <h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            QR Code Generator
          </h1>
          <p class="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Generate a branded QR code with custom colors, shapes, size controls, and optional logo upload.
            The layout below turns the tool into a cleaner app experience instead of a plain settings form.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 text-sm text-slate-200">
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
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Customize</p>
              <h2 class="mt-2 text-2xl font-semibold text-white">Build your QR code</h2>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Canvas</p>
              <p class="mt-1 text-lg font-semibold text-white">{width} × {height}</p>
            </div>
          </div>

          <div class="space-y-8">
            <div class="space-y-3">
              <label for="text-convert" class="block text-sm font-medium text-slate-200">Text or URL</label>
              <textarea
                id="text-convert"
                bind:value={data}
                rows="4"
                class="block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                placeholder="Paste a URL, text, or contact info"
              ></textarea>
              <p class="text-sm text-slate-400">Best for links, Wi-Fi credentials, profile URLs, menus, and event signage.</p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Quick presets</h3>
                <p class="text-xs text-slate-500">One tap theme</p>
              </div>
              <div class="flex flex-wrap gap-3">
                {#each presets as preset}
                  <button
                    type="button"
                    onclick={() => applyPreset(preset)}
                    class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    {preset.label}
                  </button>
                {/each}
              </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="height" class="flex items-center gap-2 text-sm font-medium text-slate-200">
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
                <label for="width" class="flex items-center gap-2 text-sm font-medium text-slate-200">
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
                <label for="background-color" class="mb-3 block text-sm font-medium text-slate-200">Background</label>
                <div class="flex items-center gap-3">
                  <input id="background-color" type="color" bind:value={backgroundFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{backgroundFill}</span>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="module-color" class="mb-3 block text-sm font-medium text-slate-200">Module</label>
                <div class="flex items-center gap-3">
                  <input id="module-color" type="color" bind:value={moduleFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{moduleFill}</span>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="anchor-inner-color" class="mb-3 block text-sm font-medium text-slate-200">Inner anchor</label>
                <div class="flex items-center gap-3">
                  <input id="anchor-inner-color" type="color" bind:value={anchorInnerFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{anchorInnerFill}</span>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <label for="anchor-outer-color" class="mb-3 block text-sm font-medium text-slate-200">Outer anchor</label>
                <div class="flex items-center gap-3">
                  <input id="anchor-outer-color" type="color" bind:value={anchorOuterFill} class="p-1 h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                  <span class="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300">{anchorOuterFill}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Shape</h3>
              <div class="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                {#each shapeOptions as option}
                  <label class="cursor-pointer">
                    <input type="radio" class="sr-only" name="shape" value={option.value} bind:group={shape} />
                    <span
                      class:selected-pill={shape === option.value}
                      class="inline-flex rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition"
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
                  <h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Logo overlay</h3>
                  <p class="mt-2 text-sm leading-6 text-slate-400">
                    Add a PNG or JPG logo in the center for branded sharing.
                  </p>
                </div>

                <label class="inline-flex cursor-pointer items-center gap-3">
                  <span class="text-sm font-medium text-slate-200">Enable</span>
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
                    class="block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-sky-100"
                  />

                  {#if showPreview}
                    <div class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center gap-4">
                        <img src={logoPreview} alt="Logo preview" class="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/10" />
                        <div>
                          <p class="text-sm font-medium text-white">Logo preview ready</p>
                          <p class="text-sm text-slate-400">Centered inside the QR code.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onclick={removeLogo}
                        class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
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
                <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Preview</p>
                <h2 class="mt-2 text-2xl font-semibold text-white">Ready to export</h2>
              </div>
              <a
                href={dataURL}
                download="qr.png"
                class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-xl"
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
                <p class="mt-2 text-sm font-medium text-white">{shape}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Logo</p>
                <p class="mt-2 text-sm font-medium text-white">{withLogo ? 'Enabled' : 'None'}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Text length</p>
                <p class="mt-2 text-sm font-medium text-white">{data.length} chars</p>
              </div>
            </div>

            <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Helpful notes</h3>
              <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
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