<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold">Create Your Account</h2>
              <p class="text-muted">
                Join the SaskPolytech Marketplace to start buying and selling
              </p>
            </div>

            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <!-- First Name -->
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    v-model="formData.firstName"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <!-- Last Name -->
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Last Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastName"
                    v-model="formData.lastName"
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <!-- Email -->
                <div class="col-12">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    type="email"
                    :class="['form-control', emailClass]"
                    id="email"
                    v-model="formData.email"
                    placeholder="youremail@saskpolytech.ca"
                    required
                  />
                  <small class="text-muted">Must use @saskpolytech.ca</small>
                  <div v-if="emailError" class="text-danger small mt-1">{{ emailError }}</div>
                  <div v-if="formData.email && !emailError" class="text-success small mt-1">
                    ✅ Valid SaskPolytech email
                  </div>
                </div>

                <!-- Student ID Upload -->
                <div class="col-12">
                  <label for="studentIdImage" class="form-label">
                    Upload Student ID Image *
                    <span v-if="isValidating" class="badge bg-info ms-2">Validating with AI...</span>
                  </label>
                  <div
                    :class="['border', 'rounded', 'p-4', 'text-center', 'bg-light', { 'border-primary': isDragOver }]"
                    :style="{ 
                      cursor: 'pointer',
                      borderStyle: isDragOver ? 'dashed' : 'solid',
                      backgroundColor: isDragOver ? '#e3f2fd' : '#f8f9fa'
                    }"
                    @dragover.prevent="isDragOver = true"
                    @dragleave.prevent="isDragOver = false"
                    @drop.prevent="handleDrop"
                    @click="$refs.fileInput.click()"
                  >
                    <i class="bi bi-cloud-upload fs-1 text-muted"></i>
                    <p class="mb-2">
                      <span v-if="studentIdImage" class="text-success">
                        ✓ {{ studentIdImage.name }}
                      </span>
                      <span v-else>
                        Click to upload or drag and drop
                      </span>
                    </p>
                    <p class="text-muted small mb-0">PNG or JPG (MAX. 5MB)</p>
                    <input
                      ref="fileInput"
                      type="file"
                      class="d-none"
                      accept="image/*"
                      @change="handleFileChange"
                      required
                    />
                  </div>

                  <!-- OCR Progress Bar -->
                  <div v-if="isValidating && ocrProgress > 0" class="mt-3">
                    <div class="d-flex justify-content-between mb-1">
                      <small class="text-muted">Scanning image with AI OCR...</small>
                      <small class="text-muted">{{ ocrProgress }}%</small>
                    </div>
                    <div class="progress" style="height: 8px">
                      <div
                        class="progress-bar progress-bar-striped progress-bar-animated bg-info"
                        role="progressbar"
                        :style="{ width: ocrProgress + '%' }"
                      ></div>
                    </div>
                  </div>

                  <div v-if="studentIdImage && !isValidating" class="mt-2 text-center">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="removeFile"
                    >
                      Remove File
                    </button>
                  </div>

                  <small
                    :class="['d-block', 'mt-2', verificationStatus === 'success' ? 'text-success' : 'text-muted']"
                  >
                    <span v-if="verificationStatus === 'success'">
                      ✅ Verification complete - Valid SaskPolytech Student ID
                    </span>
                    <span v-else>
                      🤖 AI-powered verification: We'll automatically check if this is a valid SaskPoly student ID
                    </span>
                  </small>
                </div>

                <!-- Phone -->
                <div class="col-12">
                  <label for="phoneNumber" class="form-label">Phone (Optional)</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phoneNumber"
                    v-model="formData.phoneNumber"
                    placeholder="(306) 555-5555"
                  />
                </div>

                <!-- Password -->
                <div class="col-md-6">
                  <label for="password" class="form-label">Password *</label>
                  <input
                    type="password"
                    :class="['form-control', passwordClass]"
                    id="password"
                    v-model="formData.password"
                    placeholder="Enter your password"
                    required
                  />
                  <small class="text-muted">Min. 8 characters</small>
                </div>

                <!-- Confirm Password -->
                <div class="col-md-6">
                  <label for="confirmPassword" class="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    :class="['form-control', passwordClass]"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                  <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
                  <small v-if="formData.confirmPassword && !passwordError" class="text-success">
                    ✅ Passwords match
                  </small>
                </div>

                <!-- Terms -->
                <div class="col-12">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="terms"
                      v-model="agreedToTerms"
                      required
                    />
                    <label class="form-check-label" for="terms">
                      I agree to verify I'm a Saskatchewan Polytechnic student.
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-dark btn-lg w-100"
                    :disabled="loading || isValidating || !!passwordError || !!emailError"
                  >
                    {{ loading ? 'Creating Account...' : isValidating ? 'Validating ID...' : 'Create Account' }}
                  </button>
                </div>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0">
                Already have an account?
                <router-link to="/login" class="text-dark fw-bold">Login</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Tesseract from 'tesseract.js';

const router = useRouter();
const { register } = useAuth();

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  campusLocation: 'Regina'
});

const studentIdImage = ref(null);
const isDragOver = ref(false);
const error = ref('');
const loading = ref(false);
const ocrProgress = ref(0);
const isValidating = ref(false);
const verificationStatus = ref('pending');
const agreedToTerms = ref(false);

// Real-time email validation
const emailError = computed(() => {
  if (formData.value.email && !formData.value.email.endsWith('@saskpolytech.ca')) {
    return 'Email must be a valid @saskpolytech.ca address';
  }
  return '';
});

const emailClass = computed(() => {
  if (!formData.value.email) return '';
  return emailError.value ? 'is-invalid' : 'is-valid';
});

// Real-time password validation
const passwordError = computed(() => {
  if (formData.value.confirmPassword && formData.value.password !== formData.value.confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
});

const passwordClass = computed(() => {
  if (!formData.value.password) return '';
  return passwordError.value ? 'is-invalid' : 'is-valid';
});

// OCR validation
const validateStudentIDWithOCR = async (file) => {
  isValidating.value = true;
  ocrProgress.value = 0;
  verificationStatus.value = 'pending';

  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          ocrProgress.value = Math.round(m.progress * 100);
        }
      }
    });

    const text = result.data.text.toLowerCase();
    console.log('OCR Text detected:', text);

    const hasSaskatchewan = text.includes('saskatchewan');
    const hasPolytechnic = text.includes('polytechnic') || text.includes('saskpoly');
    const hasStudent = text.includes('student');
    const hasID = text.includes('id') || text.includes('i.d');
    const hasNumbers = /\d{7,}/.test(text);

    if (!hasSaskatchewan && !hasPolytechnic) {
      isValidating.value = false;
      verificationStatus.value = 'failed';
      return {
        valid: false,
        message: 'This doesn\'t appear to be a Saskatchewan Polytechnic student ID.'
      };
    }

    if (!hasStudent && !hasID) {
      isValidating.value = false;
      verificationStatus.value = 'failed';
      return {
        valid: false,
        message: 'This doesn\'t appear to be a student ID.'
      };
    }

    if (!hasNumbers) {
      isValidating.value = false;
      verificationStatus.value = 'failed';
      return {
        valid: false,
        message: 'We couldn\'t detect a student ID number in the image.'
      };
    }

    isValidating.value = false;
    verificationStatus.value = 'success';
    return { valid: true, message: 'Student ID validated successfully!' };
  } catch (err) {
    console.error('OCR Error:', err);
    isValidating.value = false;
    verificationStatus.value = 'failed';
    return {
      valid: true,
      message: 'Unable to automatically verify, but admin will review your ID.'
    };
  }
};

// Image quality validation
const validateImageQuality = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 300 || img.height < 300) {
        reject('Image is too small. Please upload a clearer photo (minimum 300x300 pixels).');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let totalBrightness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (pixels.length / 4);

        if (avgBrightness < 15) {
          reject('Image is too dark. Please upload a photo with better lighting.');
          return;
        }
        if (avgBrightness > 240) {
          reject('Image is too bright or blank.');
          return;
        }

        resolve(true);
      } catch (err) {
        resolve(true);
      }
    };

    img.onerror = () => reject('Failed to load image.');
    img.src = URL.createObjectURL(file);
  });
};

// File validation and OCR
const validateAndSetFile = async (file) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file (PNG, JPG, JPEG)';
    verificationStatus.value = 'failed';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB';
    verificationStatus.value = 'failed';
    return;
  }

  if (file.size < 50 * 1024) {
    error.value = 'Image file is too small.';
    verificationStatus.value = 'failed';
    return;
  }

  try {
    await validateImageQuality(file);
    const ocrResult = await validateStudentIDWithOCR(file);

    if (!ocrResult.valid) {
      error.value = ocrResult.message;
      verificationStatus.value = 'failed';
      return;
    }

    studentIdImage.value = file;
    error.value = '';
  } catch (validationError) {
    error.value = validationError;
    isValidating.value = false;
    verificationStatus.value = 'failed';
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleDrop = (event) => {
  isDragOver.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    validateAndSetFile(files[0]);
  }
};

const removeFile = () => {
  studentIdImage.value = null;
  verificationStatus.value = 'pending';
  error.value = '';
};

const handleSubmit = async () => {
  error.value = '';

  if (emailError.value) {
    error.value = emailError.value;
    return;
  }

  if (passwordError.value) {
    error.value = passwordError.value;
    return;
  }

  if (formData.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  if (!studentIdImage.value) {
    error.value = 'Please upload your student ID';
    return;
  }

  loading.value = true;

  try {
    const data = new FormData();
    data.append('fullName', `${formData.value.firstName} ${formData.value.lastName}`);
    data.append('email', formData.value.email);
    data.append('password', formData.value.password);
    data.append('phoneNumber', formData.value.phoneNumber);
    data.append('campusLocation', formData.value.campusLocation);
    data.append('studentIDImage', studentIdImage.value);

    await register(data);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
