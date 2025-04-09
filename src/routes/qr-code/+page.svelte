<script lang="ts">
  import { onMount } from 'svelte';
  import SvgQR from '@svelte-put/qr/svg/QR.svelte';
  import { createQrPngDataUrl  } from '@svelte-put/qr';

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  let logo = $state("https://placehold.co/600x400")
  let moduleFill = $state("#ffffff");
  let anchorOuterFill = $state("#ffffff");
  let anchorInnerFill = $state("#ffffff");
  let backgroundFill = $state("#000000");
  let width = $state(500);
  let height = $state(500);
  let data = $state("This is a test");
  let withLogo = $state(false);
  let showPreview = $state(false);
  let isWidthErr = $state(false);
  let isHeightErr = $state(false);
  let files: any = $state(null);
  let image: any = $state(null);
  let shape: 'circle' | 'square' = $state('circle');
  const options = [
    {
      value: 'circle',
      label: 'Circle'
    },
    {
      value: 'square',
      label: 'Square'
    }
  ]
  let dataURL = $state('');
  $effect(() => {
    if(width > 1000) {
      isWidthErr = true;
    }
    if(height > 1000) {
      isHeightErr = true;
    }
  })
  $effect(() => {
    const config = {
      data,
      width,
      height,
      moduleFill,
      backgroundFill,
      anchorInnerFill,
      anchorOuterFill,
      shape,
      logo : withLogo ? logo : undefined
    }
    createQrPngDataUrl(config)
    .then((response) => {
      dataURL = response;
    });
  })
  onMount(async () => {
    const config = {
      data,
      width: 500,
      height: 500,
      backgroundFill,
      moduleFill,
      anchorInnerFill,
      anchorOuterFill,
      shape
    }
    dataURL = await createQrPngDataUrl(config);
  })

  function loadIcon() {
    if (files && files instanceof FileList && validImageTypes.includes(files[0].type)) {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result!.toString());
        logo = reader.result!.toString();
        // dataUrl = createQrPngDataUrl(config);
      });
      reader.readAsDataURL(files[0]);
			showPreview = true;
    }
    else {
      files = new DataTransfer().files
      showPreview = false;
      logo = '';
      alert("Please select proper image(PNG and JPG only).")
    }
  }
</script>

<section class="mx-auto grid grid-cols-2 place-items-start-center w-[80%] py-10 bg-[#0a4367] min-h-[75vh]">
  <fieldset class="grid grid-cols-1 border border-solid border-gray-300 p-5 rounded-md w-full">
    <legend class="font-montserrat-bold text-white underline">Customize</legend>
    <div class="flex flex-col w-full mb-4">
      <label for="text-convert" class="block mb-2 text-sm font-montserrat-medium text-white">Text to QR</label>
      <input type="text" bind:value={data} id="text-convert" class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white text-sm rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none block w-full p-2.5" placeholder="Text to convert" />
    </div>
    <div class="grid grid-cols-2 w-full gap-x-5 mb-4">
      <div class="flex flex-col">
        <label for="height" class="flex items-center mb-2 text-sm font-montserrat-medium text-white">
          Height
          {#if isHeightErr}
            <div class="flex items-center px-4 text-sm rounded-lg  text-red-400" role="alert">
              <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Alert</span>
              <div>
                <span class="font-medium">Alert!</span> filesize will be big.
              </div>
            </div>
          {/if}
        </label>
        <input type="number" bind:value={height} id="height" max=1000 class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white text-sm rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none block w-full p-2.5" placeholder="Text to convert" />
      </div>
      <div class="flex flex-col">
        <label for="width" class="flex items-center mb-2 text-sm font-montserrat-medium text-white">
          Width
          {#if isWidthErr}
            <div class="flex items-center px-4 text-sm rounded-lg  text-red-400" role="alert">
              <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Alert</span>
              <div>
                <span class="font-medium">Alert!</span> filesize will be big.
              </div>
            </div>
          {/if}
        </label>
        <input type="number" bind:value={width} id="width" max=1000 class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white text-sm rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none block w-full p-2.5" placeholder="Text to convert" />
      </div>
    </div>
    <div class="w-full grid grid-cols-2 gap-2 items-center justify-between">
      <div class="flex flex-col justify-start">
        <label for="background-color" class="block mb-2 text-sm font-montserrat-medium text-white">Background Color</label>
        <input type="color" bind:value={backgroundFill} id="background-color" class="" placeholder="Module Color" />
      </div>
      <div class="flex flex-col justify-start">
        <label for="module-color" class="block mb-2 text-sm font-montserrat-medium text-white">Module Color</label>
        <input type="color" bind:value={moduleFill} id="module-color" class="" placeholder="Module Color" />
      </div>
      <div class="flex flex-col justify-start">
        <label for="anchor-inner-color" class="block mb-2 text-sm font-montserrat-medium text-white">Inner Anchor Color</label>
        <input type="color" bind:value={anchorInnerFill} id="anchor-inner-color" class="" placeholder="Module Color" />
      </div>
      <div class="flex flex-col justify-start">
        <label for="anchor-outer-color" class="block mb-2 text-sm font-montserrat-medium text-white">Outer Anchor Color</label>
        <input type="color" bind:value={anchorOuterFill} id="anchor-outer-color" class="" placeholder="Module Color" />
      </div>
    </div>
    <div class="flex flex-col items-start text-white mt-4">
      <label for="shape-radio" class="block mb-2 text-sm font-montserrat-medium text-white">Shape</label>
      <div class="flex flex-row items-center gap-x-5">
        {#each options as shapes }
        <div id="rad-id-{shapes.value}" class="flex items-center">
          <input
            class="mr-1 cursor-pointer"
            type="radio"
            name="Shape"
            id="rad-{shapes.value}"
            value={shapes.value}
            bind:group={shape}
          />
          <label for="rad-{shapes.value}" class="cursor-pointer">{shapes.label}</label>
        </div>
        {/each}
      </div>
    </div>
    <div class="w-full flex items-center my-4">
      <label for="text-convert" class="text-sm font-montserrat-medium text-white">With Logo?</label>
      <input type="checkbox" bind:checked={withLogo} id="text-convert" class="mx-5" placeholder="Text to convert" />
    </div>
    {#if withLogo}
    <div class="flex flex-col w-full">
      <label for="add-icon" class="block mb-2 text-sm font-montserrat-medium text-white">Icon:</label>
      <input id="add-icon" accept="image/jpeg, image/png" type="file" onchange={loadIcon} bind:files class="file:p-2.5 block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none file:bg-gray-700 file:rounded-l-lg file:border-gray-600 file:text-gray-400 bg-gray-700 border-gray-600 placeholder-gray-400" />
      <img class:hidden={!showPreview} bind:this={image} src="" alt="Preview" class="w-[150px] self-center my-4"/>
    </div>
    {/if}
  </fieldset>
  <div class="flex flex-col items-center justify-center self-start mt-4">
    <SvgQR
      style="background-color: {backgroundFill};"
      class=" h-[300px] w-[300px] mb-4"
      {data}
      {shape}
      {moduleFill}
      {anchorOuterFill}
      {anchorInnerFill}
      logo={withLogo ? logo : undefined}
    />
    <a class="text-gray-800 hover:bg-gray-300 bg-white font-medium rounded-lg text-sm px-5 py-2.5" href={dataURL} download="qr.png">Download QR</a>
  </div>
  
  <!-- <img {src} width="180" height="180" alt="a qr code" /> -->
</section>

<style scoped>
  .place-items-start-center {
    place-items: start center;
  }

</style>