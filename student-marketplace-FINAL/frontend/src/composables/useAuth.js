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
      loading.value = false; // Ensure loading stops if no token
      return;
    }
    
    // Set token if it exists
    token.value = storedToken;
    
    loading.value = true;
    try {
      const response = await authAPI.getCurrentUser();
      user.value = response.data.user || response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      
      // FIX: If the token is invalid or user doesn't exist (401/403/404), LOGOUT immediately
      // This prevents the infinite spinner
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404)) {
        console.log("Token invalid or user not found. Logging out.");
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
