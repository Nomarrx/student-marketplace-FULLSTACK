<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Navbar />
    
    <main class="flex-grow-1">
      <router-view />
    </main>
    
    <footer class="bg-dark text-white mt-auto py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5 class="fw-bold">SaskPolytech Marketplace</h5>
            <p class="text-muted">
              Buy and sell safely within the Saskatchewan Polytechnic student community.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">© 2025 Student Marketplace. All rights reserved.</p>
            <p class="text-muted small">
              Team: Darrel Baffour, Divine Nworisa, Harsh Vyas
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useAuth } from './composables/useAuth';

const { fetchCurrentUser } = useAuth();

onMounted(() => {
  fetchCurrentUser();
});
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
