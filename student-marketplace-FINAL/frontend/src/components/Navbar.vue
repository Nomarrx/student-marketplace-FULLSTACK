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
            <router-link to="/" class="nav-link" @click="closeNavbar">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/browse" class="nav-link" @click="closeNavbar">Browse</router-link>
          </li>
          
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <router-link to="/login" class="nav-link" @click="closeNavbar">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-light ms-2" @click="closeNavbar">
                Register
              </router-link>
            </li>
          </template>
          
          <template v-else>
            <li v-if="user" class="nav-item dropdown" ref="dropdownRef">
              <a 
                class="nav-link dropdown-toggle position-relative" 
                href="#" 
                role="button" 
                @click.stop="toggleDropdown"
                aria-expanded="false"
              >
                {{ displayName }}
                
                <span 
                  v-if="totalUnreadCount > 0" 
                  class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                  style="margin-top: 10px; margin-left: -5px;"
                >
                  <span class="visually-hidden">New alerts</span>
                </span>
              </a>
              
              <ul :class="['dropdown-menu', 'dropdown-menu-end', { show: isDropdownOpen }]">
                <li>
                  <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
                    Profile
                  </router-link>
                </li>
                <li>
                  <router-link to="/my-listings" class="dropdown-item" @click="closeDropdown">
                    My Listings
                  </router-link>
                </li>
                <li>
                  <router-link to="/messages" class="dropdown-item d-flex justify-content-between align-items-center" @click="closeDropdown">
                    Messages
                    <span v-if="totalUnreadCount > 0" class="badge bg-danger rounded-pill">
                      {{ totalUnreadCount }}
                    </span>
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a>
                </li>
              </ul>
            </li>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import axios from 'axios';

const { user, isAuthenticated, logout } = useAuth();
const router = useRouter();
const route = useRoute();

// Refs
const isNavbarOpen = ref(false);
const isDropdownOpen = ref(false);
const totalUnreadCount = ref(0);
const dropdownRef = ref(null); // Reference for click-outside detection
let notificationInterval = null;

const displayName = computed(() => {
  return user.value?.fullName || user.value?.email || '';
});

// --- MENU CONTROL FUNCTIONS ---

const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value;
};

// Helper to close everything (useful for mobile)
const closeNavbar = () => {
  isNavbarOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Explicitly close dropdown (attached to links)
const closeDropdown = () => {
  isDropdownOpen.value = false;
  isNavbarOpen.value = false; // Also close mobile menu if it's open
};

// Handle clicks outside the dropdown to close it
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// --- API & LOGIC ---

const fetchUnreadCount = async () => {
  if (!isAuthenticated.value) return;
  try {
    const response = await axios.get('http://localhost:5000/api/messages/conversations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const conversations = response.data.conversations || [];
    totalUnreadCount.value = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  } catch (error) {
    // Silent fail
  }
};

const handleLogout = () => {
  closeDropdown();
  logout();
  router.push('/login');
};

// --- LIFECYCLE HOOKS ---

onMounted(() => {
  fetchUnreadCount();
  notificationInterval = setInterval(fetchUnreadCount, 5000);
  // Add listener for clicking outside the menu
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (notificationInterval) clearInterval(notificationInterval);
  // Clean up listener
  document.removeEventListener('click', handleClickOutside);
});

// Watch for route changes to close menus automatically
watch(() => route.path, () => {
  // 1. Close all menus when route changes
  closeDropdown();
  
  // 2. Fetch new unread counts
  if (isAuthenticated.value) {
    fetchUnreadCount();
  }
});
</script>

<style scoped>
.navbar-brand {
  font-size: 1.25rem;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
}

/* Smooth transition for badge */
.badge {
  transition: all 0.3s ease;
}
</style>