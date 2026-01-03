import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add Bearer token if authenticated
apiClient.interceptors.request.use(
  async (config) => {
    const { isInitialized, isAuthenticated, token, refreshToken } = useAuth()

    // Only add auth if Keycloak has been initialized and user is authenticated
    if (isInitialized.value && isAuthenticated.value && token.value) {
      // Ensure token is fresh before request
      await refreshToken()
      config.headers.Authorization = `Bearer ${token.value}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { isInitialized, isAuthenticated, login, logout } = useAuth()

    if (error.response?.status === 401) {
      // Unauthorized - token invalid or expired
      if (isInitialized.value && isAuthenticated.value) {
        // Try to re-authenticate
        await logout()
        await login(window.location.pathname)
      }
    }

    if (error.response?.status === 403) {
      // Forbidden - authenticated but lacking permissions
      if (isInitialized.value) {
        await router.push('/access-denied')
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
