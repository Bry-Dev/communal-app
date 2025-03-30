<script lang="ts">
  import { AppList } from "$lib/data/AppList";
</script>

<section>
  {#each AppList as app }
    {app.description}
  {/each}
</section>