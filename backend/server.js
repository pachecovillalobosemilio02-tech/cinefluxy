require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const moviesRoutes = require('./routes/movies')
const bookingRoutes = require('./routes/booking')

const app = express()
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean)
]

const projectSlug = process.env.VERCEL_PROJECT_SLUG || 'cinefluxy'
const previewOriginPattern = new RegExp(`^https://${projectSlug}(?:-[a-z0-9-]+)?\\.vercel\\.app$`, 'i')

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || previewOriginPattern.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Origen no permitido por CORS'))
  },
  credentials: true
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/movies', moviesRoutes)
app.use('/api/booking', bookingRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
