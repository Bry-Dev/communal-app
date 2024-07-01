<script>
  import "../app.css";
  import NavBar from "../components/NavBar.svelte";
</script>

<section class="container mx-auto mt-4">
  <NavBar />
  <slot />
</section>
