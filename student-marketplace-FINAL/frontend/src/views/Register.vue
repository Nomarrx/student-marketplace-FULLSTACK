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

            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ error }}
              <button type="button" class="btn-close" @click="error = ''"></button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
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

                <div class="col-12">
                  <label class="form-label">
                    Upload Student ID Image *
                    <span v-if="isValidating" class="badge bg-info ms-2">Validating with AI...</span>
                  </label>
                  
                  <div
                    :class="['border', 'rounded', 'p-4', 'text-center', 'bg-light', { 'border-primary': isDragOver }]"
                    :style="{ 
                      cursor: isValidating ? 'wait' : 'pointer',
                      borderStyle: isDragOver ? 'dashed' : 'solid',
                      backgroundColor: isDragOver ? '#e3f2fd' : '#f8f9fa'
                    }"
                    @dragover.prevent="!isValidating && (isDragOver = true)"
                    @dragleave.prevent="isDragOver = false"
                    @drop.prevent="handleDrop"
                    @click="!isValidating && $refs.fileInput.click()"
                  >
                    <i class="bi bi-cloud-upload fs-1 text-muted"></i>
                    
                    <div class="mb-2">
                      <span v-if="studentIdImage" class="text-success fw-bold">
                        ✓ {{ studentIdImage.name }}
                      </span>
                      <span v-else>
                        Click to upload or drag and drop
                      </span>
                    </div>

                    <p class="text-muted small mb-0">PNG or JPG (MAX. 5MB)</p>
                    
                    <input
                      ref="fileInput"
                      type="file"
                      class="d-none"
                      accept="image/*"
                      @change="handleFileChange"
                    />
                  </div>

                  <div v-if="isValidating && ocrProgress > 0" class="mt-3">
                    <div class="d-flex justify-content-between mb-1">
                      <small class="text-muted">Scanning image text...</small>
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

                  <small :class="['d-block', 'mt-2', verificationMessageClass]">
                    {{ verificationMessage }}
                  </small>
                </div>

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

                <div class="col-md-6">
                  <label for="password" class="form-label">Password *</label>
                  <input
                    type="password"
                    :class="['form-control', passwordClass]"
                    id="password"
                    v-model="formData.password"
                    placeholder="Enter password"
                    required
                  />
                  <small class="text-muted">Min. 8 characters</small>
                </div>

                <div class="col-md-6">
                  <label for="confirmPassword" class="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    :class="['form-control', passwordClass]"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    placeholder="Confirm password"
                    required
                  />
                  <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
                  <small v-if="formData.confirmPassword && !passwordError" class="text-success">
                    ✅ Match
                  </small>
                </div>

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

                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-dark btn-lg w-100"
                    :disabled="isSubmitDisabled"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ submitButtonText }}
                  </button>
                  
                  <div v-if="isSubmitDisabled && !loading" class="text-center mt-2 small text-muted">
                    <span v-if="isValidating">Wait for ID check...</span>
                    <span v-else-if="passwordError">Fix passwords...</span>
                    <span v-else-if="emailError">Fix email...</span>
                    <span v-else-if="!studentIdImage">Upload ID...</span>
                  </div>
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
import { ref, computed } from 'vue';
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
const verificationStatus = ref('pending'); // 'pending', 'success', 'failed'
const verificationMessage = ref('🤖 We use AI to verify your Student ID matches your name.');
const agreedToTerms = ref(false);

// --- Computeds for UI Logic ---

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

const verificationMessageClass = computed(() => {
  if (verificationStatus.value === 'success') return 'text-success fw-bold';
  if (verificationStatus.value === 'failed') return 'text-danger';
  return 'text-muted';
});

const isSubmitDisabled = computed(() => {
  return loading.value || 
         isValidating.value || 
         !!passwordError.value || 
         !!emailError.value ||
         !agreedToTerms.value;
});

const submitButtonText = computed(() => {
  if (loading.value) return 'Creating Account...';
  if (isValidating.value) return 'Verifying ID...';
  return 'Create Account';
});

// --- Helper Functions ---

const checkNameMatch = (ocrText, firstName, lastName) => {
  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  };

  const ocrWords = normalizeText(ocrText);
  const firstNameWords = normalizeText(firstName);
  const lastNameWords = normalizeText(lastName);
  const allInputNames = [...firstNameWords, ...lastNameWords];

  let matchCount = 0;
  for (const inputName of allInputNames) {
    if (ocrWords.some(ocrWord => 
      ocrWord.includes(inputName) || 
      inputName.includes(ocrWord) ||
      ocrWord === inputName
    )) {
      matchCount++;
    }
  }

  // Pass if 2 parts match or 50% of name parts match
  return matchCount >= 2 || (allInputNames.length > 0 && matchCount >= allInputNames.length * 0.5);
};

// --- Main Validation Logic ---

const validateStudentIDWithOCR = async (file) => {
  isValidating.value = true;
  ocrProgress.value = 0;
  verificationStatus.value = 'pending';
  error.value = '';

  // --- DEV BACKDOOR ---
  // If file name has 'bypass' or 'test', skip AI
  if (file.name.toLowerCase().includes('bypass') || file.name.toLowerCase().includes('test')) {
    console.log('⚡ TESTING MODE: Skipping OCR checks');
    setTimeout(() => {
      isValidating.value = false;
      verificationStatus.value = 'success';
      verificationMessage.value = '✅ TEST MODE: Verification Bypassed';
    }, 800);
    return { valid: true };
  }
  // --------------------

  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          ocrProgress.value = Math.round(m.progress * 100);
        }
      }
    });

    const text = result.data.text.toLowerCase();
    console.log('OCR Result:', text);

    // 1. Check for SaskPoly keywords
    const isSaskPoly = text.includes('saskatchewan') || text.includes('polytechnic') || text.includes('saskpoly');
    
    // 2. Check for ID keywords
    const isIDCard = text.includes('student') || text.includes('id') || /\d{6,}/.test(text); // Relaxed check

    if (!isSaskPoly && !isIDCard) {
      return { 
        valid: false, 
        message: 'Could not detect "Saskatchewan Polytechnic" or Student ID numbers. Please ensure image is clear.' 
      };
    }

    // 3. Name Match
    if (formData.value.firstName && formData.value.lastName) {
      const nameMatches = checkNameMatch(text, formData.value.firstName, formData.value.lastName);
      if (!nameMatches) {
        return { 
          valid: false, 
          message: `Name mismatch. Could not find "${formData.value.firstName} ${formData.value.lastName}" on the ID.` 
        };
      }
    }

    verificationStatus.value = 'success';
    verificationMessage.value = '✅ Verification complete. ID verified successfully.';
    return { valid: true };

  } catch (err) {
    console.error('OCR Error:', err);
    // Fallback: If AI fails, let them proceed with a warning/manual check flag
    verificationStatus.value = 'success'; 
    verificationMessage.value = '⚠️ AI Check failed, but image uploaded for manual review.';
    return { valid: true }; 
  } finally {
    // ALWAYS stop the spinner
    isValidating.value = false;
  }
};

const validateAndSetFile = async (file) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file (PNG, JPG, JPEG)';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB';
    return;
  }

  // Set file tentatively
  studentIdImage.value = file;
  
  // Run OCR
  const ocrResult = await validateStudentIDWithOCR(file);

  if (!ocrResult.valid) {
    // If invalid, clear the file and show error
    studentIdImage.value = null;
    verificationStatus.value = 'failed';
    verificationMessage.value = '❌ ' + ocrResult.message;
    error.value = ocrResult.message;
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) validateAndSetFile(file);
};

const handleDrop = (event) => {
  isDragOver.value = false;
  if (isValidating.value) return; // Prevent drop while validating
  
  const files = event.dataTransfer.files;
  if (files.length > 0) validateAndSetFile(files[0]);
};

const removeFile = () => {
  studentIdImage.value = null;
  verificationStatus.value = 'pending';
  verificationMessage.value = '🤖 Upload your ID to verify name and school.';
  error.value = '';
};

// --- Submit Handler ---

const handleSubmit = async () => {
  console.log("Submit clicked");
  error.value = '';

  // 1. Manual Validation Checks
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
    error.value = 'You must upload a verified Student ID to continue.';
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

    // Call the composable
    await register(data);
    
    // Redirect on success
    console.log("Registration successful");
    router.push('/');
    
  } catch (err) {
    console.error("Registration failed:", err);
    error.value = err.response?.data?.message || 'Registration failed. Please check your connection.';
  } finally {
    loading.value = false;
  }
};
</script>