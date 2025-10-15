import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
})

export default apiClient
