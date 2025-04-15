<script lang="ts">
  const donate = (() => {
    alert("This button does nothing. For now. But I do hope it stays doing nothing.")
  })

  let isOpen:boolean = $state(false);

  const openMenu = () => {
    isOpen = !isOpen
  }
  
</script>

<section class="grid grid-cols-2 md:grid-cols-3 place-items-center w-full bg-[#093754] py-1">
  <div class="flex items-center">
    <a href="/" class="text-xl font-montserrat-bold text-white logo">App Hub</a>
    <button onclick={openMenu} id="nav-toggle" data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 ml-3 text-sm rounded-lg md:hidden focus:outline-none focus:ring-1 text-white hover:bg-[#265a7a] focus:ring-sky-600">
      <span class="sr-only">Open main menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
  </div>
  <div class:hidden={!isOpen} class="text-white md:text-lg text-sm md:block font-montserrat-regular w-[80%] max-md:col-span-2 max-md:order-3 max-md:mt-2 max-md:py-2 md:bg-transparent bg-[#165e8a] rounded-lg">
    <nav>
      <ul class="flex flex-col md:flex-row md:justify-around font-montserrat-bold gap-y-3 justify-center max-md:ml-10">
        <li class="hover:text-sky-300"><a href="/qr-code">QR Code</a></li>
        <li class="hover:text-sky-300"><a href="/">Next...</a></li>
      </ul>
    </nav>
  </div>
  <div class="max-md:order-2">
    <button type="button" onclick={donate} class="text-white bg-gradient-to-r from-[#62BEC1] via-[#62BEC1] to-[#5AD2F4] hover:bg-gradient-to-t focus:ring-1 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-1 text-center me-2">Donate</button>
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