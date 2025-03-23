<script>
  import "../app.css";
  import NavBar from "../components/NavBar.svelte";
</script>

<section class="container mx-auto mt-2">
  <NavBar />
  <slot />
</section>