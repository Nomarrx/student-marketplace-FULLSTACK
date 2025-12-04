<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold">
        🎓 SaskPolytech Marketplace
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="toggleNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div :class="['collapse', 'navbar-collapse', { show: isNavbarOpen }]">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/browse" class="nav-link">Browse</router-link>
          </li>
          
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-light ms-2">
                Register
              </router-link>
            </li>
          </template>
          
          <template v-else>
            <li v-if="user" class="nav-item dropdown">
              <a 
                class="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                @click="toggleDropdown"
                aria-expanded="false"
              >
                {{ displayName }}
              </a>
              <ul :class="['dropdown-menu', 'dropdown-menu-end', { show: isDropdownOpen }]">
                <li>
                  <router-link to="/profile" class="dropdown-item">Profile</router-link>
                </li>
                <li>
                  <router-link to="/my-listings" class="dropdown-item">My Listings</router-link>
                </li>
                <li>
                  <router-link to="/messages" class="dropdown-item">Messages</router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a>
                </li>
              </ul>
            </li>
            <!-- Loading state -->
            <li v-else class="nav-item">
              <span class="nav-link">
                <span class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
              </span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const { user, isAuthenticated, logout } = useAuth();
const router = useRouter();

const isNavbarOpen = ref(false);
const isDropdownOpen = ref(false);

// Computed for display name
const displayName = computed(() => {
  const name = user.value?.fullName || user.value?.email || '';
  console.log('Navbar displayName computed:', name, 'User:', user.value);
  return name;
});

// Debug: Watch user changes
watch(user, (newUser) => {
  console.log('Navbar: User updated:', newUser);
}, { immediate: true });

watch(isAuthenticated, (newAuth) => {
  console.log('Navbar: Auth status:', newAuth);
}, { immediate: true });

const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.25rem;
}

.dropdown-menu {
  position: absolute;
  right: 0;
}
</style>
