import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinefluxy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cinefluxy_token')
      localStorage.removeItem('cinefluxy_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data)
}

export const moviesService = {
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`)
}

export const bookingService = {
  create: (data) => api.post('/booking', data),
  getMyBookings: () => api.get('/booking/mine'),
  validateTicket: (id) => api.get(`/booking/validate/${id}`)
}

export default api