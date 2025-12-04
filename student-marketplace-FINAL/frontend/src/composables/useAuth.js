import { ref, computed } from 'vue';
import { authAPI } from '../services/api';

// Global auth state
const user = ref(null);
const token = ref(localStorage.getItem('token'));
const loading = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await authAPI.login(credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const register = async (formData) => {
    loading.value = true;
    try {
      const response = await authAPI.register(formData);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  const fetchCurrentUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.log('No token found, user not logged in');
      return;
    }
    
    // Set token if it exists
    token.value = storedToken;
    
    loading.value = true;
    try {
      const response = await authAPI.getCurrentUser();
      console.log('API Response:', response.data);
      
      // Backend returns { success: true, user: {...} }
      // So we need to extract the user object
      user.value = response.data.user || response.data;
      console.log('User set to:', user.value);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Only logout if it's an auth error, not network error
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser
  };
}
