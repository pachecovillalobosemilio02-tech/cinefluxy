require('dotenv').config({ path: __dirname + '/.env' })
console.log('PASSWORD:', JSON.stringify(process.env.DB_PASSWORD))

require('dotenv').config({ path: __dirname + '/.env' })
require('dotenv').config()
console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
})
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const moviesRoutes = require('./routes/movies')
const bookingRoutes = require('./routes/booking')

const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/movies', moviesRoutes)
app.use('/api/booking', bookingRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))