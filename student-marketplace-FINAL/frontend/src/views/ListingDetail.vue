<template>
  <div class="container py-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb small">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item"><router-link to="/browse">{{ listing?.category || 'Category' }}</router-link></li>
        <li class="breadcrumb-item active">{{ listing?.title || 'Item' }}</li>
      </ol>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Listing Content -->
    <div v-else-if="listing" class="row">
      <!-- Left Column: Images -->
      <div class="col-md-6">
        <!-- Main Image -->
        <div class="card mb-3 border-0">
          <img
            :src="getCurrentImage()"
            class="card-img-top rounded"
            :alt="listing.title"
            style="height: 400px; width: 100%; object-fit: contain; background-color: #f8f9fa; cursor: pointer"
            @click="openImageModal"
          />
        </div>

        <!-- Thumbnail Gallery (all images) -->
        <div v-if="listing.imageUrls && listing.imageUrls.length > 1" class="row g-2">
          <div
            v-for="(image, index) in listing.imageUrls"
            :key="index"
            :class="listing.imageUrls.length <= 4 ? 'col-3' : 'col-2'"
          >
            <div 
              class="thumbnail-wrapper"
              :class="{ 'active': currentImageIndex === index }"
              @click="currentImageIndex = index"
            >
              <img
                :src="getImageUrl(image)"
                :alt="`${listing.title} - Image ${index + 1}`"
                class="img-fluid rounded"
                style="height: 80px; width: 100%; object-fit: cover; cursor: pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details -->
      <div class="col-md-6">
        <!-- Title -->
        <h2 class="fw-bold mb-2">{{ listing.title }}</h2>
        
        <!-- Price -->
        <h3 class="text-success mb-3">${{ listing.price }}</h3>
        
        <!-- Condition Badge -->
        <span :class="['badge', 'mb-3', getConditionBadge(listing.condition), 'fs-6']">
          {{ formatCondition(listing.condition) }}
        </span>

        <!-- Info List -->
        <div class="mb-3">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-tag me-2 text-muted"></i>
            <strong class="me-2">Category:</strong>
            <span>{{ listing.category }}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-geo-alt me-2 text-muted"></i>
            <strong class="me-2">Location:</strong>
            <span>{{ listing.location || listing.campusLocation || 'Main Campus' }}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-calendar me-2 text-muted"></i>
            <strong class="me-2">Posted:</strong>
            <span>{{ formatDate(listing.createdAt) }}</span>
          </div>
        </div>

        <hr />

        <!-- Description -->
        <div class="mb-4">
          <h5 class="fw-bold mb-2">Description</h5>
          <p class="text-muted" style="white-space: pre-wrap">{{ listing.description }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="d-grid gap-2">
          <button
            v-if="isAuthenticated && !isOwner"
            class="btn btn-dark btn-lg"
            @click="handleMessageSeller"
          >
            <i class="bi bi-chat-dots me-2"></i> Message Seller
          </button>

          <button
            v-if="isOwner"
            class="btn btn-primary btn-lg"
            @click="handleEdit"
          >
            <i class="bi bi-pencil me-2"></i> Edit Listing
          </button>

          <button
            v-if="isOwner"
            class="btn btn-danger btn-lg"
            @click="handleDelete"
          >
            <i class="bi bi-trash me-2"></i> Delete Listing
          </button>

          <button
            v-if="!isAuthenticated"
            class="btn btn-dark btn-lg"
            @click="$router.push('/login')"
          >
            Login to Contact Seller
          </button>
        </div>
      </div>
    </div>

    <!-- Seller Info Section -->
    <div v-if="listing" class="row mt-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="fw-bold mb-3">Seller Information</h5>
            <div class="d-flex align-items-center">
              <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style="width: 50px; height: 50px; font-size: 20px; flex-shrink: 0">
                {{ getInitials(listing.seller?.fullName) }}
              </div>
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">{{ listing.seller?.fullName || 'Unknown Seller' }}</p>
                <small class="text-muted">
                  <i class="bi bi-check-circle-fill text-success me-1"></i>
                  Member since {{ formatYear(listing.seller?.createdAt || listing.createdAt) }}
                </small>
              </div>
              <button 
                v-if="isAuthenticated && !isOwner" 
                class="btn btn-dark"
                @click="handleMessageSeller"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="mt-4">
      <button class="btn btn-outline-secondary" @click="$router.push('/browse')">
        <i class="bi bi-arrow-left me-2"></i> Back to Browse
      </button>
    </div>

    <!-- Image Modal -->
    <div 
      v-if="showModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background-color: rgba(0,0,0,0.8)"
      @click="closeImageModal"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body p-0 position-relative">
            <button 
              type="button" 
              class="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
              @click="closeImageModal"
              style="z-index: 10"
            ></button>
            <img 
              :src="getCurrentImage()" 
              class="img-fluid w-100 rounded"
              style="max-height: 90vh; object-fit: contain"
              @click.stop
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { listingsAPI } from '../services/api';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const { user, isAuthenticated } = useAuth();

const listing = ref(null);
const loading = ref(true);
const error = ref('');
const currentImageIndex = ref(0);
const showModal = ref(false);

const isOwner = computed(() => {
  return user.value && listing.value && user.value.userID === listing.value.sellerID;
});

const fetchListing = async () => {
  loading.value = true;
  error.value = '';

  try {
    const listingId = route.params.id;
    const response = await listingsAPI.getById(listingId);
    
    console.log('API Response:', response.data);
    
    // Backend returns { success: true, listing: {...} }
    listing.value = response.data.listing || response.data;
    
    // Ensure imageUrls is an array
    if (listing.value.imageUrls && typeof listing.value.imageUrls === 'string') {
      try {
        listing.value.imageUrls = JSON.parse(listing.value.imageUrls);
      } catch (e) {
        console.error('Failed to parse imageUrls:', e);
        listing.value.imageUrls = [];
      }
    }
  } catch (err) {
    console.error('Failed to fetch listing:', err);
    error.value = 'Failed to load listing. It may have been deleted.';
  } finally {
    loading.value = false;
  }
};

const getCurrentImage = () => {
  if (!listing.value?.imageUrls || listing.value.imageUrls.length === 0) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  return getImageUrl(listing.value.imageUrls[currentImageIndex.value]);
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
  return `http://localhost:5000/${imagePath}`;
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

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatDate = (date) => {
  if (!date) return 'Unknown';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatYear = (date) => {
  if (!date) return '2022';
  return new Date(date).getFullYear();
};

const openImageModal = () => {
  showModal.value = true;
};

const closeImageModal = () => {
  showModal.value = false;
};

const handleMessageSeller = () => {
  // Store the listing and seller info in localStorage to pre-populate message
  localStorage.setItem('pendingMessage', JSON.stringify({
    listingID: listing.value.listingID,
    sellerID: listing.value.sellerID,
    listingTitle: listing.value.title,
    sellerName: listing.value.seller?.fullName
  }));
  
  // Redirect to messages page
  router.push('/messages');
};

const handleEdit = () => {
  router.push(`/listing/${listing.value.listingID}/edit`);
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this listing?')) return;

  try {
    await listingsAPI.delete(listing.value.listingID);
    alert('Listing deleted successfully!');
    router.push('/browse');
  } catch (err) {
    console.error('Failed to delete listing:', err);
    alert('Failed to delete listing. Please try again.');
  }
};

onMounted(() => {
  fetchListing();
});
</script>

<style scoped>
.breadcrumb-item a {
  text-decoration: none;
  color: #6c757d;
}

.breadcrumb-item a:hover {
  color: #212529;
}

.thumbnail-wrapper {
  border: 2px solid transparent;
  border-radius: 0.375rem;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.thumbnail-wrapper:hover {
  transform: scale(1.05);
}

.thumbnail-wrapper.active {
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}

.modal.show {
  display: block !important;
}
</style>
