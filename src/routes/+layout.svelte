<script>
  import '../app.css';
  import Navbar from '$lib/components/home/Navbar.svelte';
  import Footer from '$lib/components/home/Footer.svelte';
</script>

<div class="flex min-h-screen flex-col">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <Navbar />
  <main id="main-content" tabindex="-1" class="flex-1">
    <slot />
  </main>
  <Footer />
</div>
