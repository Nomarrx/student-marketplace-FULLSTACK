<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold">Post a New Listing</h2>
              <p class="text-muted">
                Share items you want to sell with other SaskPolytech students
              </p>
            </div>

            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <div v-if="success" class="alert alert-success" role="alert">
              {{ success }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <!-- Title -->
                <div class="col-12">
                  <label for="title" class="form-label">Title *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="formData.title"
                    placeholder="e.g., CWEB 280 Textbook"
                    required
                  />
                  <small class="text-muted">Be specific and descriptive</small>
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
                    placeholder="50"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <!-- Campus Meetup Location -->
                <div class="col-12">
                  <label for="campusLocation" class="form-label">
                    Campus Meetup Location * 
                    <small class="text-muted">(Safe public meeting spot)</small>
                  </label>
                  <select
                    class="form-select"
                    id="campusLocation"
                    v-model="formData.campusLocation"
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
                  <small class="text-muted">
                    <i class="bi bi-shield-check"></i> Choose a safe, public location on Regina campus
                  </small>
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label for="description" class="form-label">Description *</label>
                  <textarea
                    class="form-control"
                    id="description"
                    v-model="formData.description"
                    rows="4"
                    placeholder="Describe your item, its condition, and any important details..."
                    required
                    maxlength="500"
                    @input="updateCharCount"
                  ></textarea>
                  <small class="text-muted">{{ charCount }}/500 characters</small>
                </div>

                <!-- Image Upload Section -->
                <div class="col-12">
                  <label for="images" class="form-label">
                    Upload Images * (Max 5 images)
                    <span v-if="images.length > 0" class="badge bg-info ms-2">
                      Drag to reorder
                    </span>
                  </label>
                  <div
                    :class="['border', 'rounded', 'p-4', 'text-center', 'bg-light', { 'border-primary': isDragOver }]"
                    :style="{ 
                      cursor: 'pointer',
                      borderStyle: isDragOver ? 'dashed' : 'solid',
                      backgroundColor: isDragOver ? '#e3f2fd' : '#f8f9fa'
                    }"
                    @dragover.prevent="handleDragOver"
                    @dragleave.prevent="handleDragLeave"
                    @drop.prevent="handleDrop"
                    @click="$refs.fileInput.click()"
                  >
                    <i class="bi bi-cloud-upload fs-1 text-muted"></i>
                    <p class="mb-2">
                      <span v-if="images.length > 0" class="text-success">
                        ✓ {{ images.length }} image(s) selected
                      </span>
                      <span v-else>
                        Click to upload or drag and drop
                      </span>
                    </p>
                    <p class="text-muted small mb-0">PNG or JPG (MAX. 5MB each, up to 5 images)</p>
                    <input
                      ref="fileInput"
                      type="file"
                      class="d-none"
                      accept="image/*"
                      multiple
                      @change="handleFileChange"
                    />
                  </div>

                  <!-- Image Previews with Reordering -->
                  <div v-if="images.length > 0" class="row g-3 mt-3">
                    <div class="col-12">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">
                          <i class="bi bi-arrows-move"></i> Drag to reorder images (first image will be the main thumbnail)
                        </small>
                        <small class="text-muted">
                          {{ images.length }}/5 images
                        </small>
                      </div>
                      
                      <!-- Reorderable Image Grid -->
                      <div 
                        class="row g-3"
                        v-if="images.length > 0"
                      >
                        <div
                          v-for="(image, index) in images"
                          :key="image.id"
                          class="col-6 col-md-4"
                        >
                          <div 
                            class="card border position-relative"
                            :class="{ 'border-primary': index === 0 }"
                            :draggable="true"
                            @dragstart="onDragStart(index)"
                            @dragover.prevent="onDragOver(index)"
                            @drop="onDrop(index)"
                            @dragenter="onDragEnter(index)"
                            @dragleave="onDragLeave(index)"
                            :data-index="index"
                          >
                            <!-- Main Image Indicator -->
                            <div v-if="index === 0" class="position-absolute top-0 start-0 m-1">
                              <span class="badge bg-primary">
                                <i class="bi bi-star-fill me-1"></i>Main
                              </span>
                            </div>
                            
                            <!-- Image Preview -->
                            <img
                              :src="image.preview"
                              class="card-img-top"
                              :style="{ 
                                height: '150px', 
                                objectFit: 'cover',
                                cursor: 'grab'
                              }"
                              :alt="`Preview ${index + 1}`"
                              @dragstart="onDragStart(index)"
                            />
                            
                            <!-- Image Controls -->
                            <div class="card-body p-2">
                              <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                  Image {{ index + 1 }}
                                </small>
                                <div class="btn-group btn-group-sm" role="group">
                                  <!-- Move Up Button -->
                                  <button
                                    type="button"
                                    class="btn btn-outline-secondary btn-sm"
                                    @click="moveImageUp(index)"
                                    :disabled="index === 0"
                                    title="Move up"
                                  >
                                    <i class="bi bi-arrow-up"></i>
                                  </button>
                                  
                                  <!-- Move Down Button -->
                                  <button
                                    type="button"
                                    class="btn btn-outline-secondary btn-sm"
                                    @click="moveImageDown(index)"
                                    :disabled="index === images.length - 1"
                                    title="Move down"
                                  >
                                    <i class="bi bi-arrow-down"></i>
                                  </button>
                                  
                                  <!-- Remove Button -->
                                  <button
                                    type="button"
                                    class="btn btn-outline-danger btn-sm"
                                    @click="removeImage(index)"
                                    title="Remove"
                                  >
                                    <i class="bi bi-x"></i>
                                  </button>
                                </div>
                              </div>
                              
                              <!-- Image Info -->
                              <div class="mt-1">
                                <small class="text-truncate d-block" :title="image.name">
                                  {{ truncateFilename(image.name, 15) }}
                                </small>
                                <small class="text-muted">
                                  {{ formatFileSize(image.size) }}
                                </small>
                              </div>
                            </div>
                            
                            <!-- Drag Handle -->
                            <div class="position-absolute bottom-0 end-0 m-1">
                              <i class="bi bi-arrows-move text-secondary"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Reordering Instructions -->
                      <div v-if="images.length > 1" class="mt-3 p-3 bg-light rounded">
                        <div class="d-flex align-items-center">
                          <i class="bi bi-info-circle me-2 text-info"></i>
                          <small class="text-muted">
                            <strong>Tip:</strong> The first image will be the main thumbnail. Drag images or use arrow buttons to reorder.
                            Set your best image as the first one!
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-dark btn-lg w-100"
                    :disabled="loading || images.length === 0"
                  >
                    <span v-if="loading">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Posting...
                    </span>
                    <span v-else>
                      <i class="bi bi-plus-circle me-2"></i>
                      Post Listing
                    </span>
                  </button>
                </div>
              </div>
            </form>

            <div class="text-center mt-4">
              <button
                class="btn btn-outline-secondary"
                @click="$router.push('/browse')"
                :disabled="loading"
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
import { ref, reactive, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { listingsAPI } from '../services/api';

const router = useRouter();

const formData = reactive({
  title: '',
  description: '',
  price: '',
  category: '',
  condition: '',
  campusLocation: ''
});

const images = ref([]);
const isDragOver = ref(false);
const error = ref('');
const success = ref('');
const loading = ref(false);
const charCount = ref(0);
const dragIndex = ref(null);
const dragOverIndex = ref(null);

// Clean up object URLs when component unmounts
onUnmounted(() => {
  images.value.forEach(image => {
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }
  });
});

// Update character count
const updateCharCount = () => {
  charCount.value = formData.description.length;
};

// Handle file selection
const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  addImages(files);
};

// Drag and drop for file upload
const handleDragOver = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  const files = Array.from(event.dataTransfer.files);
  addImages(files);
};

// Add images with preview and metadata
const addImages = (files) => {
  // Filter only image files
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  if (imageFiles.length === 0) {
    error.value = 'Please upload only image files (PNG, JPG, JPEG)';
    return;
  }
  
  // Check total count
  if (images.value.length + imageFiles.length > 5) {
    error.value = 'You can only upload up to 5 images';
    return;
  }

  // Process each file
  imageFiles.forEach((file, index) => {
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      error.value = `${file.name} is too large. Max size is 5MB`;
      return;
    }
    
    // Create image object with metadata
    const imageObj = {
      id: Date.now() + index, // Unique ID for each image
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    images.value.push(imageObj);
  });
  
  error.value = '';
};

// Remove image
const removeImage = (index) => {
  // Revoke the object URL to prevent memory leaks
  if (images.value[index].preview) {
    URL.revokeObjectURL(images.value[index].preview);
  }
  
  images.value.splice(index, 1);
};

// Move image up in order
const moveImageUp = (index) => {
  if (index > 0) {
    const temp = images.value[index];
    images.value[index] = images.value[index - 1];
    images.value[index - 1] = temp;
  }
};

// Move image down in order
const moveImageDown = (index) => {
  if (index < images.value.length - 1) {
    const temp = images.value[index];
    images.value[index] = images.value[index + 1];
    images.value[index + 1] = temp;
  }
};

// Drag and drop for reordering
const onDragStart = (index) => {
  dragIndex.value = index;
};

const onDragOver = (index) => {
  dragOverIndex.value = index;
  event.preventDefault();
};

const onDrop = (index) => {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    // Swap the images
    const temp = images.value[dragIndex.value];
    images.value[dragIndex.value] = images.value[index];
    images.value[index] = temp;
  }
  dragIndex.value = null;
  dragOverIndex.value = null;
};

const onDragEnter = (index) => {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    // Add visual feedback for drag target
    const element = event.currentTarget;
    element.classList.add('border-success', 'border-2');
  }
};

const onDragLeave = (index) => {
  const element = event.currentTarget;
  element.classList.remove('border-success', 'border-2');
};

// Helper functions
const truncateFilename = (filename, maxLength) => {
  if (filename.length <= maxLength) return filename;
  return filename.substring(0, maxLength - 3) + '...';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Form submission
const handleSubmit = async () => {
  error.value = '';
  success.value = '';

  // Validation
  if (!formData.title || !formData.description || !formData.price) {
    error.value = 'Please fill in all required fields';
    return;
  }

  if (!formData.category) {
    error.value = 'Please select a category';
    return;
  }

  if (!formData.condition) {
    error.value = 'Please select the item condition';
    return;
  }

  if (!formData.campusLocation) {
    error.value = 'Please select a campus meetup location';
    return;
  }

  if (images.value.length === 0) {
    error.value = 'Please upload at least one image';
    return;
  }

  if (formData.price <= 0) {
    error.value = 'Price must be greater than 0';
    return;
  }

  if (formData.description.length > 500) {
    error.value = 'Description must be 500 characters or less';
    return;
  }

  loading.value = true;

  try {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    data.append('campusLocation', formData.campusLocation);

    // Append all images in the order they appear (first image is main)
    images.value.forEach((image, index) => {
      data.append('images', image.file);
      // Optional: Add metadata about image order
      data.append(`image_order_${index}`, index);
    });

    await listingsAPI.create(data);

    success.value = '🎉 Listing posted successfully! Redirecting...';
    
    // Clean up object URLs
    images.value.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    // Redirect to browse page after 1.5 seconds
    setTimeout(() => {
      router.push('/browse');
    }, 1500);

  } catch (err) {
    console.error('Failed to create listing:', err);
    error.value = err.response?.data?.message || 'Failed to create listing. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
textarea {
  resize: vertical;
  min-height: 100px;
}

/* Image preview hover effects */
.card {
  transition: all 0.2s ease;
  cursor: grab;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card:active {
  cursor: grabbing;
}

/* Drag and drop styling */
.card[draggable="true"] {
  user-select: none;
}

.border-2 {
  border-width: 2px !important;
}

/* Button group styling */
.btn-group .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Truncate text */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Loading spinner */
.spinner-border {
  vertical-align: middle;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem !important;
  }
  
  .btn-group {
    flex-wrap: wrap;
  }
  
  .col-6 {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>