<script lang="ts">
  const donate = (() => {
    alert("This button does nothing. For now. But I do hope it stays doing nothing.")
  })

  let isOpen:boolean = $state(false);

  
</script>

<section class="grid grid-cols-3 place-items-center w-full bg-[#093754] pt-1">
  <div>
    <a href="/" class="text-xl font-montserrat-bold text-white logo">App Hub</a>
  </div>
  <div class="text-white font-montserrat-regular w-[80%]">
    <nav>
      <ul class="flex flex-row justify-evenly font-montserrat-bold">
        <li class="hover:text-sky-300"><a href="/qr-code">QR Code</a></li>
        <li class="hover:text-sky-300"><a href="/">Next...</a></li>
      </ul>
    </nav>
  </div>
  <div>
    <button type="button" onclick={donate} class="text-white bg-gradient-to-r from-[#62BEC1] via-[#62BEC1] to-[#5AD2F4] hover:bg-gradient-to-t focus:ring-1 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Donate</button>
    <!-- <a href="/" class="text-md font-montserrat-bold text-white logo">Donate</a> -->
  </div>
  <!-- <div class="relative md:block hidden">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
    </div>
    <input type="search" id="default-search" class="block p-3 ps-10 text-sm rounded-lg focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400 caret-white text-white" placeholder="Search..."/>
  </div> -->
</section>

<style>
  /* input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active{
    -webkit-background-clip: text;
    -webkit-text-fill-color: #ffffff;
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: inset 0 0 20px 20px #374151;
  } */
</style>