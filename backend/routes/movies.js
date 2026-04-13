const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const movieModel = require('../models/movieModel')

router.get('/', authMiddleware, async (req, res) => {
  try {
    const movies = await movieModel.getAll()
    res.json(movies)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener peliculas.' })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const movie = await movieModel.getById(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Pelicula no encontrada.' })
    res.json(movie)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pelicula.' })
  }
})

module.exports = router