<section class="page-width pb-10 pt-10 sm:pb-12 sm:pt-16">
  <div class="flex items-center justify-between gap-10">
    <div class="max-w-2xl">
      <p class="mb-5 flex items-center gap-2 text-sm font-medium text-accent"><span class="h-2 w-2 rounded-full bg-accent" aria-hidden="true"></span>Free tools. Open to everyone.</p>
      <h1 class="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">Small tools.<br />A little less busywork.</h1>
      <p class="mt-6 max-w-lg text-lg leading-8 text-muted">Make a QR code. Check your word count. Get the little things done, and get on with your day.</p>
    </div>
    <div class="tool-mark hidden shrink-0 md:grid" aria-hidden="true">
      <div class="mark-qr"><span></span><span></span><span></span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 2h8v8H2zm12 0h8v8h-8zM2 14h8v8H2zm12 0h4v4h-4zm4 4h4v4h-4z" /></svg></div>
      <div class="mark-text">Aa<span class="text-line"></span><span class="text-line short"></span><span class="word-label">Words that count.</span></div>
    </div>
  </div>
</section>
<style>
  .tool-mark { width: 238px; height: 230px; position: relative; }
  .mark-qr { position: absolute; top: 0; left: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 23px; width: 136px; height: 136px; border-radius: 24px; transform: rotate(-8deg); background: var(--accent-soft); color: var(--accent); }
  .mark-qr span { border: 6px solid currentColor; border-radius: 4px; }
  .mark-qr svg { width: 100%; height: 100%; }
  .mark-text { position: absolute; bottom: 0; right: 0; width: 160px; padding: 14px 22px 20px; border: 1px solid var(--line); border-radius: 16px; transform: rotate(6deg); background: var(--surface); color: var(--secondary); box-shadow: 0 6px 18px var(--shadow); font-family: 'Montserrat', sans-serif; font-size: 48px; font-weight: 500; line-height: 1.4; }
  .text-line { display: block; height: 4px; margin-top: 6px; border-radius: 3px; background: var(--secondary-soft); }
  .text-line.short { width: 65%; }
  .word-label { display: block; margin-top: 13px; font-family: 'Segoe UI', sans-serif; font-size: 11px; color: var(--muted); }
</style>
