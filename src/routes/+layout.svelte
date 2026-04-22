<script>
  import '../app.css';
  import Navbar from '$lib/components/home/Navbar.svelte';
  import Footer from '$lib/components/home/Footer.svelte';
</script>

<div class="min-h-screen bg-slate-950 text-white">
  <Navbar />
  <slot />
  <Footer />
</div>