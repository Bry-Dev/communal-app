<script>
  import "../app.css";
  import NavBar from "../components/NavBar.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<section class="mx-auto h-dvh">
  <NavBar />
  <slot />
  <Footer />
</section>