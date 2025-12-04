<template>
  <div class="container py-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">My Listings</h2>
        <p class="text-muted mb-0">Manage all your posted items</p>
      </div>
      <router-link to="/create-listing" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i> Post New Item
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center">
            <h3 class="fw-bold text-primary mb-1">{{ stats.total }}</h3>
            <p class="text-muted mb-0 small">Total Listings</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center">
            <h3 class="fw-bold text-success mb-1">{{ stats.available }}</h3>
            <p class="text-muted mb-0 small">Available</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center">
            <h3 class="fw-bold text-secondary mb-1">{{ stats.sold }}</h3>
            <p class="text-muted mb-0 small">Sold</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <ul class="nav nav-pills mb-4">
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: filter === 'all' }"
          href="#" 
          @click.prevent="filter = 'all'"
        >
          All ({{ stats.total }})
        </a>
      </li>
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: filter === 'available' }"
          href="#" 
          @click.prevent="filter = 'available'"
        >
          Available ({{ stats.available }})
        </a>
      </li>
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: filter === 'sold' }"
          href="#" 
          @click.prevent="filter = 'sold'"
        >
          Sold ({{ stats.sold }})
        </a>
      </li>
    </ul>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-3">Loading your listings...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i> {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredListings.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted mb-3"></i>
      <h4 class="text-muted mb-3">
        {{ filter === 'all' ? 'No listings yet' : `No ${filter} listings` }}
      </h4>
      <p class="text-muted mb-4">
        {{ filter === 'all' ? 'Start selling by posting your first item!' : 'Try changing the filter above.' }}
      </p>
      <router-link v-if="filter === 'all'" to="/create-listing" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i> Post Your First Item
      </router-link>
    </div>

    <!-- Listings Grid -->
    <div v-else class="row g-4">
      <div 
        v-for="listing in filteredListings" 
        :key="listing.listingID" 
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 border-0 shadow-sm listing-card">
          <!-- Image -->
          <div class="position-relative">
            <img
              :src="getImageUrl(listing.imageUrls)"
              class="card-img-top"
              :alt="listing.title"
              style="height: 200px; object-fit: cover; cursor: pointer"
              @click="viewListing(listing.listingID)"
            />
            <!-- Status Badge -->
            <span 
              :class="['badge', 'position-absolute', 'top-0', 'start-0', 'm-2', getStatusBadge(listing.status)]"
            >
              {{ formatStatus(listing.status) }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <h5 class="card-title mb-2">{{ listing.title }}</h5>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h4 class="text-success mb-0">${{ listing.price }}</h4>
              <span :class="['badge', getConditionBadge(listing.condition)]">
                {{ formatCondition(listing.condition) }}
              </span>
            </div>
            <p class="card-text text-muted small mb-2">
              <i class="bi bi-geo-alt me-1"></i> {{ listing.location }}
            </p>
            <p class="card-text text-muted small mb-3">
              <i class="bi bi-eye me-1"></i> {{ listing.viewCount || 0 }} views • 
              Posted {{ getTimeAgo(listing.createdAt) }}
            </p>

            <!-- Action Buttons -->
            <div class="d-grid gap-2">
              <button 
                class="btn btn-outline-primary btn-sm"
                @click="viewListing(listing.listingID)"
              >
                <i class="bi bi-eye me-1"></i> View Details
              </button>
              <div class="row g-2">
                <div class="col-6">
                  <button 
                    class="btn btn-primary btn-sm w-100"
                    @click="editListing(listing.listingID)"
                  >
                    <i class="bi bi-pencil me-1"></i> Edit
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    class="btn btn-danger btn-sm w-100"
                    @click="confirmDelete(listing)"
                  >
                    <i class="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
              <button 
                v-if="listing.status === 'available'"
                class="btn btn-success btn-sm"
                @click="markAsSold(listing)"
              >
                <i class="bi bi-check-circle me-1"></i> Mark as Sold
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listingsAPI } from '../services/api';

const router = useRouter();

const listings = ref([]);
const loading = ref(true);
const error = ref('');
const filter = ref('all');

const stats = computed(() => {
  return {
    total: listings.value.length,
    available: listings.value.filter(l => l.status === 'available').length,
    sold: listings.value.filter(l => l.status === 'sold').length,
  };
});

const filteredListings = computed(() => {
  if (filter.value === 'all') return listings.value;
  return listings.value.filter(l => l.status === filter.value);
});

const fetchMyListings = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await listingsAPI.getUserListings();
    console.log('My listings response:', response.data);
    
    // Handle different response formats
    listings.value = response.data.listings || response.data || [];
    
    // Sort by newest first
    listings.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Failed to fetch listings:', err);
    error.value = 'Failed to load your listings. Please try again.';
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  
  const firstImage = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
  return `http://localhost:5000/${firstImage}`;
};

const getStatusBadge = (status) => {
  const badges = {
    available: 'bg-success',
    pending: 'bg-warning',
    sold: 'bg-secondary'
  };
  return badges[status] || 'bg-secondary';
};

const formatStatus = (status) => {
  const formatted = {
    available: 'Available',
    pending: 'Pending',
    sold: 'Sold'
  };
  return formatted[status] || status;
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

const getTimeAgo = (date) => {
  if (!date) return 'Unknown';
  
  const now = new Date();
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

const viewListing = (id) => {
  router.push(`/listing/${id}`);
};

const editListing = (id) => {
  router.push(`/listing/${id}/edit`);
};

const confirmDelete = async (listing) => {
  if (!confirm(`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`)) {
    return;
  }

  try {
    await listingsAPI.delete(listing.listingID);
    
    // Remove from local list
    listings.value = listings.value.filter(l => l.listingID !== listing.listingID);
    
    alert('Listing deleted successfully!');
  } catch (err) {
    console.error('Failed to delete listing:', err);
    alert('Failed to delete listing. Please try again.');
  }
};

const markAsSold = async (listing) => {
  if (!confirm(`Mark "${listing.title}" as sold?`)) {
    return;
  }

  try {
    await listingsAPI.update(listing.listingID, { status: 'sold' });
    
    // Update local list
    const index = listings.value.findIndex(l => l.listingID === listing.listingID);
    if (index !== -1) {
      listings.value[index].status = 'sold';
    }
    
    alert('Listing marked as sold!');
  } catch (err) {
    console.error('Failed to update listing:', err);
    alert('Failed to update listing. Please try again.');
  }
};

onMounted(() => {
  fetchMyListings();
});
</script>

<style scoped>
.listing-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.nav-pills .nav-link {
  color: #6c757d;
  border-radius: 0.375rem;
}

.nav-pills .nav-link.active {
  background-color: #0d6efd;
  color: white;
}

.nav-pills .nav-link:hover:not(.active) {
  background-color: #e9ecef;
}
</style>
