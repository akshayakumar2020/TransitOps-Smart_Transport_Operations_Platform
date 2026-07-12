import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('transitops_token')
      localStorage.removeItem('transitops_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
