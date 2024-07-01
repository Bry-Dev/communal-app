<script lang="ts">
  import { qr } from '@svelte-put/qr/img';

  let qrLogo = "https://placehold.co/600x400"
  let qrData = "https://bryan-pineda.web.app/"
  let qrImage:HTMLInputElement
  let showImage: Boolean = false;
  let image:HTMLImageElement;
  function loadIcon() {
    if (qrImage.files) {
			showImage = true;
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result!.toString());
        qrLogo = reader.result!.toString();
        // dataUrl = createQrPngDataUrl(config);
      });
      reader.readAsDataURL(qrImage.files[0]);
			
			return;
    } 
  }
  function test() {
    let testImg = document.getElementById('test-qr') as HTMLImageElement
    console.log(testImg.src)
    const a = document.createElement('a')
    a.href = testImg.src
    a.download = "qr.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
</script>

<section>
  <div class="w-3/5 mx-auto flex flex-col gap-4 items-center">
    <div class="flex flex-col w-full">
      <label for="text-convert" class="block mb-2 text-sm font-montserrat-medium text-white">Text to convert</label>
      <input type="text" bind:value={qrData} id="text-convert" class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white text-sm rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none block w-full p-2.5" placeholder="Text to convert" />
    </div>
    <div class="flex flex-col w-full">
      <label for="add-icon" class="block mb-2 text-sm font-montserrat-medium text-white">Add icon?</label>
      <input id="add-icon" type="file" on:change={loadIcon} bind:this={qrImage} class="file:p-2.5 block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none file:bg-gray-700 file:rounded-l-lg file:border-gray-600 file:text-gray-400 bg-gray-700 border-gray-600 placeholder-gray-400" />
      <img class:hidden={!showImage} bind:this={image} src="" alt="Preview" class="w-[100px]"/>
    </div>
    <!-- <a href={image.src} download="qr.png">Download QR as SVG</a> -->
    <button on:click={test} class="p-2 text-white bg-teal-600 rounded">Download QR as PNG</button>
    <img
      id="test-qr"
      use:qr={{
        data: qrData,
        logo: qrLogo,
        shape: 'circle',
        anchorInnerFill: 'gray',
        anchorOuterFill: 'gray',
        moduleFill: 'gray',
        width: 300,
        height: 300,
      }}
      class="h-[200px] min-w-[200px] md:w-[300px] md:h-[300px]"
      alt="qr"
    />
  </div>
</section>