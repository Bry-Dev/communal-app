<script lang="ts">
  const year = new Date().getFullYear();
</script>

<footer class="border-t border-white/10 bg-slate-950/80">
  <div class="mx-auto grid max-w-7xl gap-10 px-6 py-12 text-sm text-slate-400 lg:grid-cols-[1.1fr_0.8fr_0.8fr] lg:px-8">
    <div class="space-y-4">
      <div class="flex items-center gap-3 text-white">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-sm font-black text-slate-950">
          AH
        </span>
        <div>
          <p class="font-semibold">App Hub</p>
          <p class="text-slate-400">Useful tools with less friction.</p>
        </div>
      </div>
      <p class="max-w-md leading-6">
        A clean front-end foundation for a growing collection of small, practical web applications.
      </p>
    </div>

    <div>
      <p class="mb-4 font-semibold text-white">Quick links</p>
      <div class="space-y-3">
        <a href="#apps" class="block transition hover:text-white">Browse apps</a>
        <a href="#benefits" class="block transition hover:text-white">Why App Hub</a>
        <a href="#suggest" class="block transition hover:text-white">Submit idea</a>
      </div>
    </div>

    <div>
      <p class="mb-4 font-semibold text-white">Elsewhere</p>
      <div class="space-y-3">
        <a href="https://github.com/Bry-Dev/communal-app" target="_blank" rel="noreferrer" class="block transition hover:text-white">GitHub</a>
        <a href="https://bryan-pineda.web.app/" target="_blank" rel="noreferrer" class="block transition hover:text-white">About me</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" class="block transition hover:text-white">LinkedIn</a>
      </div>
    </div>
  </div>

  <div class="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500 lg:px-8">
    © {year} App Hub. All rights reserved.
  </div>
</footer>