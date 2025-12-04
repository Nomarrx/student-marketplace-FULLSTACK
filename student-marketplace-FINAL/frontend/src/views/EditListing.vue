<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold">Edit Listing</h2>
              <p class="text-muted">Update your listing details</p>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form v-else @submit.prevent="handleSubmit">
              <div class="row g-3">
                <!-- Title -->
                <div class="col-12">
                  <label for="title" class="form-label">Title *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="formData.title"
                    required
                  />
                </div>

                <!-- Category -->
                <div class="col-md-6">
                  <label for="category" class="form-label">Category *</label>
                  <select
                    class="form-select"
                    id="category"
                    v-model="formData.category"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Textbooks">Textbooks</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <!-- Condition -->
                <div class="col-md-6">
                  <label for="condition" class="form-label">Condition *</label>
                  <select
                    class="form-select"
                    id="condition"
                    v-model="formData.condition"
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                <!-- Price -->
                <div class="col-md-6">
                  <label for="price" class="form-label">Price ($) *</label>
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model="formData.price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <!-- Campus Meetup Location -->
                <div class="col-12">
                  <label for="campusLocation" class="form-label">
                    Campus Meetup Location *
                  </label>
                  <select
                    class="form-select"
                    id="campusLocation"
                    v-model="formData.location"
                    required
                  >
                    <option value="">Select a meetup location</option>
                    <option value="Main Entrance">Main Entrance (4500 Wascana Pkwy)</option>
                    <option value="Library - Main Floor">Library - Main Floor</option>
                    <option value="Student Cafeteria">Student Cafeteria</option>
                    <option value="Main Parking Lot A">Main Parking Lot A</option>
                    <option value="Student Services Front Desk">Student Services Front Desk</option>
                    <option value="Building A - Main Entrance">Building A - Main Entrance</option>
                  </select>
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label for="description" class="form-label">Description *</label>
                  <textarea
                    class="form-control"
                    id="description"
                    v-model="formData.description"
                    rows="4"
                    required
                    maxlength="500"
                  ></textarea>
                  <small class="text-muted">{{ formData.description.length }}/500 characters</small>
                </div>

                <!-- Current Images -->
                <div class="col-12">
                  <label class="form-label">Current Images</label>
                  <div class="row g-2">
                    <div
                      v-for="(image, index) in existingImages"
                      :key="index"
                      class="col-4 col-md-3"
                    >
                      <div class="position-relative">
                        <img
                          :src="getImageUrl(image)"
                          class="img-thumbnail"
                          style="height: 100px; width: 100%; object-fit: cover"
                        />
                        <button
                          type="button"
                          class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          @click="removeExistingImage(index)"
                          style="padding: 2px 8px"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="text-muted small mt-2">
                    You have {{ existingImages.length }} existing image(s)
                  </p>
                </div>

                <!-- Add New Images (Optional) -->
                <div class="col-12">
                  <label for="newImages" class="form-label">
                    Add New Images (Optional)
                  </label>
                  <input
                    ref="fileInput"
                    type="file"
                    class="form-control"
                    accept="image/*"
                    multiple
                    @change="handleFileChange"
                  />
                  <small class="text-muted">
                    You can add up to {{ 5 - existingImages.length }} more image(s)
                  </small>

                  <!-- New Images Preview -->
                  <div v-if="newImages.length > 0" class="row g-2 mt-2">
                    <div
                      v-for="(image, index) in newImages"
                      :key="`new-${index}`"
                      class="col-4 col-md-3"
                    >
                      <div class="position-relative">
                        <img
                          :src="image.preview"
                          class="img-thumbnail"
                          style="height: 100px; width: 100%; object-fit: cover"
                        />
                        <button
                          type="button"
                          class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          @click="removeNewImage(index)"
                          style="padding: 2px 8px"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100"
                    :disabled="submitting"
                  >
                    {{ submitting ? 'Updating...' : 'Update Listing' }}
                  </button>
                </div>
              </div>
            </form>

            <div class="text-center mt-4">
              <button
                class="btn btn-outline-secondary"
                @click="$router.back()"
                :disabled="submitting"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { listingsAPI } from '../services/api';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const submitting = ref(false);

const formData = ref({
  title: '',
  description: '',
  price: '',
  category: '',
  condition: '',
  location: ''
});

const existingImages = ref([]);
const newImages = ref([]);
const removedImages = ref([]);

const fetchListing = async () => {
  loading.value = true;
  try {
    const listingId = route.params.id;
    const response = await listingsAPI.getById(listingId);
    const listing = response.data.listing || response.data;

    formData.value = {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      condition: listing.condition,
      location: listing.location || listing.campusLocation
    };

    // Parse imageUrls if it's a string
    if (listing.imageUrls) {
      if (typeof listing.imageUrls === 'string') {
        existingImages.value = JSON.parse(listing.imageUrls);
      } else {
        existingImages.value = listing.imageUrls;
      }
    }
  } catch (err) {
    console.error('Failed to fetch listing:', err);
    error.value = 'Failed to load listing. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  const totalImages = existingImages.value.length + newImages.value.length + files.length;

  if (totalImages > 5) {
    alert(`You can only have 5 images total. Currently: ${existingImages.value.length + newImages.value.length}`);
    return;
  }

  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} is too large. Max size is 5MB`);
      return;
    }

    newImages.value.push({
      file,
      preview: URL.createObjectURL(file)
    });
  });
};

const removeExistingImage = (index) => {
  const removed = existingImages.value.splice(index, 1)[0];
  removedImages.value.push(removed);
};

const removeNewImage = (index) => {
  const removed = newImages.value.splice(index, 1)[0];
  URL.revokeObjectURL(removed.preview);
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return `http://localhost:5000/${imagePath}`;
};

const handleSubmit = async () => {
  if (existingImages.value.length + newImages.value.length === 0) {
    alert('You must have at least one image');
    return;
  }

  submitting.value = true;

  try {
    const data = new FormData();
    data.append('title', formData.value.title);
    data.append('description', formData.value.description);
    data.append('price', formData.value.price);
    data.append('category', formData.value.category);
    data.append('condition', formData.value.condition);
    data.append('campusLocation', formData.value.location);

    // Send existing images (not removed)
    data.append('existingImages', JSON.stringify(existingImages.value));

    // Append new images
    newImages.value.forEach(img => {
      data.append('images', img.file);
    });

    const listingId = route.params.id;
    await listingsAPI.update(listingId, data);

    alert('Listing updated successfully!');
    router.push(`/listing/${listingId}`);
  } catch (err) {
    console.error('Failed to update listing:', err);
    alert('Failed to update listing. Please try again.');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchListing();
});
</script>

<style scoped>
textarea {
  resize: vertical;
}
</style>
