<section class="grid grid-cols-3 place-items-center mb-8">
  <div>
    <p class="text-xl font-montserrat-bold text-white logo">App Hub</p>
  </div>
  <div class="text-white font-montserrat-regular w-[80%]">
    <nav>
      <ul class="flex flex-row justify-evenly">
        <li><a href="/qr-code">QR Code</a></li>
        <li>Next...</li>
      </ul>
    </nav>
  </div>
  <div class="relative md:block hidden">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
    </div>
    <input type="search" id="default-search" class="block p-3 ps-10 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="Search..."/>
  </div>
</section>

<style>
  .logo {
    background: rgb(10,67,103);
    background: linear-gradient(rgb(47, 155, 221) 0%, rgb(6, 42, 134) 100%);
    color:transparent;
    background-clip: text;
  }
</style>