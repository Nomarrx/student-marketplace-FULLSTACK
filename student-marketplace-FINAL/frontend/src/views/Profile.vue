<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <!-- Profile Header -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body text-center py-5">
            <div class="mb-3 position-relative d-inline-block">
              <!-- Profile Picture or Initials -->
              <div 
                v-if="user?.profilePicture"
                class="rounded-circle overflow-hidden"
                style="width: 100px; height: 100px; border: 3px solid #0d6efd"
              >
                <img
                  :src="getProfilePictureUrl(user.profilePicture)"
                  alt="Profile Picture"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
              </div>
              <div 
                v-else
                class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 100px; height: 100px; font-size: 36px; border: 3px solid #0d6efd"
              >
                {{ getInitials(user?.fullName) }}
              </div>

              <!-- Upload Button -->
              <label 
                for="profilePicUpload"
                class="position-absolute bottom-0 end-0 btn btn-sm btn-primary rounded-circle"
                style="width: 35px; height: 35px; padding: 0; cursor: pointer"
                title="Change profile picture"
              >
                <i class="bi bi-camera"></i>
              </label>
              <input
                type="file"
                id="profilePicUpload"
                accept="image/*"
                style="display: none"
                @change="handleProfilePictureChange"
              />
            </div>

            <h3 class="fw-bold mb-1">{{ user?.fullName || 'Loading...' }}</h3>
            <p class="text-muted mb-2">{{ user?.email }}</p>
            <small class="text-muted">
              <i class="bi bi-calendar-check me-1"></i>
              Member since {{ formatDate(user?.createdAt) }}
            </small>

            <!-- Remove Profile Picture Button -->
            <div v-if="user?.profilePicture" class="mt-3">
              <button
                class="btn btn-outline-danger btn-sm"
                @click="handleRemoveProfilePicture"
              >
                <i class="bi bi-trash me-1"></i> Remove Picture
              </button>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">
              <i class="bi bi-person-circle me-2"></i> Personal Information
            </h5>

            <form @submit.prevent="handleUpdateProfile">
              <div class="row g-3">
                <!-- First Name -->
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    v-model="profileForm.firstName"
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
                    v-model="profileForm.lastName"
                    required
                  />
                </div>

                <!-- Email (Read-only) -->
                <div class="col-12">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="profileForm.email"
                    disabled
                  />
                  <small class="text-muted">Email cannot be changed</small>
                </div>

                <!-- Phone -->
                <div class="col-12">
                  <label for="phone" class="form-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phone"
                    v-model="profileForm.phone"
                    placeholder="(306) 123-4567"
                  />
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="updatingProfile"
                  >
                    {{ updatingProfile ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Change Password Form -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">
              <i class="bi bi-shield-lock me-2"></i> Change Password
            </h5>

            <form @submit.prevent="handleChangePassword">
              <div class="row g-3">
                <!-- Current Password -->
                <div class="col-12">
                  <label for="currentPassword" class="form-label">Current Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    required
                  />
                </div>

                <!-- New Password -->
                <div class="col-12">
                  <label for="newPassword" class="form-label">New Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    required
                    minlength="6"
                  />
                  <small class="text-muted">At least 6 characters</small>
                </div>

                <!-- Confirm New Password -->
                <div class="col-12">
                  <label for="confirmPassword" class="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    required
                    minlength="6"
                  />
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-dark w-100"
                    :disabled="updatingPassword"
                  >
                    {{ updatingPassword ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Stats -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">
              <i class="bi bi-graph-up me-2"></i> Account Statistics
            </h5>

            <div class="row g-3 text-center">
              <div class="col-md-4">
                <div class="p-3 bg-light rounded">
                  <h3 class="fw-bold text-primary mb-1">{{ stats.totalListings }}</h3>
                  <small class="text-muted">Total Listings</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 bg-light rounded">
                  <h3 class="fw-bold text-success mb-1">{{ stats.activeListings }}</h3>
                  <small class="text-muted">Active</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 bg-light rounded">
                  <h3 class="fw-bold text-secondary mb-1">{{ stats.soldListings }}</h3>
                  <small class="text-muted">Sold</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone (Optional) -->
        <div class="card border-danger mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold text-danger mb-3">
              <i class="bi bi-exclamation-triangle me-2"></i> Danger Zone
            </h5>
            <p class="text-muted mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              class="btn btn-outline-danger"
              @click="handleDeleteAccount"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import axios from 'axios';

const router = useRouter();
const { user, logout } = useAuth();

const updatingProfile = ref(false);
const updatingPassword = ref(false);
const uploadingPicture = ref(false);

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const stats = ref({
  totalListings: 0,
  activeListings: 0,
  soldListings: 0
});

// Load user data into form
const loadUserData = () => {
  if (user.value) {
    const nameParts = user.value.fullName?.split(' ') || ['', ''];
    profileForm.value = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.value.email || '',
      phone: user.value.phone || ''
    };
  }
};

// Fetch user stats
const fetchStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/listings/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const listings = response.data.listings || [];
    stats.value = {
      totalListings: listings.length,
      activeListings: listings.filter(l => l.status === 'available').length,
      soldListings: listings.filter(l => l.status === 'sold').length
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

// Update profile
const handleUpdateProfile = async () => {
  updatingProfile.value = true;

  try {
    const fullName = `${profileForm.value.firstName} ${profileForm.value.lastName}`.trim();

    const response = await axios.put(
      'http://localhost:5000/api/auth/profile',
      {
        fullName,
        phone: profileForm.value.phone
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    // Update local user data
    if (user.value) {
      user.value.fullName = fullName;
      user.value.phone = profileForm.value.phone;
    }

    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert(error.response?.data?.error || 'Failed to update profile. Please try again.');
  } finally {
    updatingProfile.value = false;
  }
};

// Change password
const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    alert('Password must be at least 6 characters!');
    return;
  }

  updatingPassword.value = true;

  try {
    await axios.put(
      'http://localhost:5000/api/auth/password',
      {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    alert('Password updated successfully!');

    // Clear form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error) {
    console.error('Failed to update password:', error);
    alert(error.response?.data?.error || 'Failed to update password. Please check your current password.');
  } finally {
    updatingPassword.value = false;
  }
};

// Delete account
const handleDeleteAccount = async () => {
  const confirmed = confirm(
    'Are you ABSOLUTELY sure you want to delete your account?\n\n' +
    'This will permanently delete:\n' +
    '- Your profile\n' +
    '- All your listings\n' +
    '- All your messages\n\n' +
    'This action CANNOT be undone!'
  );

  if (!confirmed) return;

  const doubleCheck = prompt('Type "DELETE" to confirm account deletion:');

  if (doubleCheck !== 'DELETE') {
    alert('Account deletion cancelled.');
    return;
  }

  try {
    await axios.delete('http://localhost:5000/api/auth/account', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    alert('Your account has been deleted.');
    logout();
    router.push('/');
  } catch (error) {
    console.error('Failed to delete account:', error);
    alert('Failed to delete account. Please try again.');
  }
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

const getProfilePictureUrl = (picturePath) => {
  if (!picturePath) return '';
  return `http://localhost:5000/${picturePath}`;
};

const handleProfilePictureChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be smaller than 5MB');
    return;
  }

  uploadingPicture.value = true;

  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.post(
      'http://localhost:5000/api/auth/profile-picture',
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Update local user data
    if (user.value) {
      user.value.profilePicture = response.data.profilePicture;
    }

    alert('Profile picture updated successfully!');
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    alert('Failed to upload profile picture. Please try again.');
  } finally {
    uploadingPicture.value = false;
  }
};

const handleRemoveProfilePicture = async () => {
  if (!confirm('Are you sure you want to remove your profile picture?')) {
    return;
  }

  try {
    await axios.delete('http://localhost:5000/api/auth/profile-picture', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Update local user data
    if (user.value) {
      user.value.profilePicture = null;
    }

    alert('Profile picture removed successfully!');
  } catch (error) {
    console.error('Failed to remove profile picture:', error);
    alert('Failed to remove profile picture. Please try again.');
  }
};

const formatDate = (date) => {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  loadUserData();
  fetchStats();
});
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
</style>
