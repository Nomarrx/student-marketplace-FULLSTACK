<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Left Sidebar: Filters -->
      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="fw-bold mb-4">Filters</h5>

            <!-- Category Filter -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">Category</h6>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="cat-all" value="" v-model="filters.category" @change="fetchListings">
                <label class="form-check-label" for="cat-all">All</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="cat-textbooks" value="Textbooks" v-model="filters.category" @change="fetchListings">
                <label class="form-check-label" for="cat-textbooks">Textbooks</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="cat-electronics" value="Electronics" v-model="filters.category" @change="fetchListings">
                <label class="form-check-label" for="cat-electronics">Electronics</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="cat-furniture" value="Furniture" v-model="filters.category" @change="fetchListings">
                <label class="form-check-label" for="cat-furniture">Furniture</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="cat-clothing" value="Clothing" v-model="filters.category" @change="fetchListings">
                <label class="form-check-label" for="cat-clothing">Clothing</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="category" id="cat-other" value="Other" v-model="filters.category" @change="fetchListings">
                <label class="form-check-label" for="cat-other">Other</label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">Price Range</h6>
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label small">Min</label>
                  <input type="number" class="form-control form-control-sm" v-model="filters.minPrice" placeholder="$0">
                </div>
                <div class="col-6">
                  <label class="form-label small">Max</label>
                  <input type="number" class="form-control form-control-sm" v-model="filters.maxPrice" placeholder="$1000+">
                </div>
              </div>
              <button class="btn btn-dark btn-sm w-100 mt-2" @click="fetchListings">Apply</button>
            </div>

            <!-- Condition Filter -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">Condition</h6>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="cond-new" value="new" v-model="filters.conditions" @change="fetchListings">
                <label class="form-check-label" for="cond-new">New</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="cond-like-new" value="like-new" v-model="filters.conditions" @change="fetchListings">
                <label class="form-check-label" for="cond-like-new">Like New</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="cond-good" value="good" v-model="filters.conditions" @change="fetchListings">
                <label class="form-check-label" for="cond-good">Good</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="cond-fair" value="fair" v-model="filters.conditions" @change="fetchListings">
                <label class="form-check-label" for="cond-fair">Fair</label>
              </div>
            </div>

            <!-- Clear Filters -->
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">Clear All Filters</button>
          </div>
        </div>
      </div>

      <!-- Right: Listings Grid -->
      <div class="col-md-9">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="fw-bold mb-0">Browse Listings</h3>
            <p class="text-muted small mb-0">Showing {{ listings.length }} listings</p>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <!-- Search -->
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search..." 
              v-model="filters.search"
              @input="debounceSearch"
              style="width: 300px"
            />
            <!-- Sort -->
            <select class="form-select" style="width: 150px" v-model="sortBy" @change="fetchListings">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Listings Grid -->
        <div v-else-if="listings.length > 0">
          <div class="row g-4">
            <div 
              v-for="listing in listings" 
              :key="listing.listingID" 
              class="col-md-4"
            >
              <!-- Card matching wireframe -->
              <div 
                class="card h-100 listing-card border-0 shadow-sm" 
                @click="goToListing(listing.listingID)"
                style="cursor: pointer; overflow: hidden"
              >
                <!-- Image Section -->
                <div class="card-img-wrapper" style="height: 200px; background-color: #f0f0f0; position: relative; overflow: hidden">
                  <img
                    :src="getImageUrl(listing.imageUrls)"
                    class="w-100 h-100"
                    :alt="listing.title"
                    style="object-fit: cover"
                  />
                </div>
                
                <!-- Text Section -->
                <div class="card-body d-flex flex-column" style="background-color: #e8e8f0">
                  <h5 class="card-title fw-bold mb-2" style="font-size: 1rem">{{ listing.title }}</h5>
                  <h4 class="text-dark mb-2" style="font-size: 1.25rem">${{ listing.price }}</h4>
                  <div class="mt-auto">
                    <span :class="['badge', 'mb-2', getConditionBadge(listing.condition)]" style="font-size: 0.75rem">
                      {{ formatCondition(listing.condition) }}
                    </span>
                    <p class="text-muted small mb-0">
                      Posted {{ getTimeAgo(listing.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="text-muted mt-3">No listings found. Try adjusting your filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { listingsAPI } from '../services/api';

const router = useRouter();
const route = useRoute();

const listings = ref([]);
const loading = ref(false);
const sortBy = ref('newest');
const currentTime = ref(new Date());

// Update current time every minute for real-time "posted X ago"
let timeInterval = null;

const filters = ref({
  category: route.query.category || '',
  conditions: [],
  minPrice: '',
  maxPrice: '',
  search: ''
});

let searchTimeout = null;

const fetchListings = async () => {
  loading.value = true;
  try {
    const params = {};
    if (filters.value.category) params.category = filters.value.category;
    if (filters.value.minPrice) params.minPrice = filters.value.minPrice;
    if (filters.value.maxPrice) params.maxPrice = filters.value.maxPrice;
    if (filters.value.search) params.search = filters.value.search;
    
    // Handle multiple conditions
    if (filters.value.conditions.length > 0) {
      params.condition = filters.value.conditions.join(',');
    }

    const response = await listingsAPI.getAll(params);
    console.log('API Response:', response.data);
    
    let fetchedListings = response.data.listings || response.data || [];
    
    // Apply client-side sorting
    if (sortBy.value === 'price-low') {
      fetchedListings.sort((a, b) => a.price - b.price);
    } else if (sortBy.value === 'price-high') {
      fetchedListings.sort((a, b) => b.price - a.price);
    }
    
    listings.value = fetchedListings;
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  } finally {
    loading.value = false;
  }
};

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchListings();
  }, 500);
};

const clearFilters = () => {
  filters.value = {
    category: '',
    conditions: [],
    minPrice: '',
    maxPrice: '',
    search: ''
  };
  fetchListings();
};

const goToListing = (id) => {
  router.push(`/listing/${id}`);
};

const getImageUrl = (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  
  // Handle if imageUrls is a string (old format) or array (new format)
  const firstImage = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
  
  return `http://localhost:5000/${firstImage}`;
};

const getConditionBadge = (condition) => {
  const badges = {
    new: 'bg-success',
    'like-new': 'bg-info',
    good: 'bg-primary',
    fair: 'bg-warning'
  };
  return badges[condition] || 'bg-secondary';
};

const formatCondition = (condition) => {
  const formatted = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair'
  };
  return formatted[condition] || condition;
};

const truncate = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const getTimeAgo = (date) => {
  if (!date) return 'Unknown';
  
  const now = currentTime.value; // Use reactive currentTime
  const posted = new Date(date);
  const diffMs = now - posted;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  
  return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

onMounted(() => {
  fetchListings();
  
  // Update time every minute for real-time "posted X ago"
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 60000); // Update every 60 seconds
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.listing-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-check-input:checked {
  background-color: #212529;
  border-color: #212529;
}

.btn-group .btn.active {
  background-color: #212529;
  border-color: #212529;
  color: white;
}
</style>
