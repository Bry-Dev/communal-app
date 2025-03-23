<section class="grid grid-cols-3 place-items-center w-full bg-gray-700">
  <div>
    <a href="/" class="text-xl font-montserrat-bold text-white logo">App Hub</a>
  </div>
  <div class="text-white font-montserrat-regular w-[80%]">
    <nav>
      <ul class="flex flex-row justify-evenly">
        <li><a href="/qr-code">QR Code</a></li>
        <li><a href="/">Next...</a></li>
      </ul>
    </nav>
  </div>
  <div class="relative md:block hidden">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
    </div>
    <input type="search" id="default-search" class="block p-3 ps-10 text-sm rounded-lg focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400 caret-white text-white" placeholder="Search..."/>
  </div>
</section>

<style>
  .logo {
    background: rgb(10,67,103);
    background: linear-gradient(rgb(210, 237, 253) 0%, rgb(8, 143, 221) 100%);
    color:transparent;
    background-clip: text;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active{
    -webkit-background-clip: text;
    -webkit-text-fill-color: #ffffff;
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: inset 0 0 20px 20px #374151;
  }
</style>