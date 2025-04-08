<script lang="ts">
  import { AppList } from "$lib/data/AppList";
</script>

<section class="flex justify-center items-center gap-3 text-white mb-20">
  {#each AppList as app }
    <div class="{app.isAvailable ? 'max-w-[40em]' : 'max-w-[25em]'} h-[300px] min-w-[13em] border-2 rounded-lg py-5 px-3">
      <a href={app.link} target="_blank" rel="noopener noreferrer" class="font-bold font-montserrat-bold">{app.title}</a>
      <p class="text-pretty py-2">
        {app.description}
      </p>
      <a href={app.trialLink} target="_blank" rel="noopener noreferrer" class="font-semibold">
        Try it<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline-block h-4 w-4 ml-1" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd"></path>
        </svg>
      </a>
    </div>
  {/each}
</section>