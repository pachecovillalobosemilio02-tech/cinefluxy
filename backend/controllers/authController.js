const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const register = async (req, res) => {
  try {
    const { name, email, password, birth, locationLabel, latitude, longitude } = req.body
    if (!name || !email || !password || !birth || !locationLabel?.trim()) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' })
    }
    const age = (new Date() - new Date(birth)) / (365.25 * 24 * 3600 * 1000)
    if (age < 18) {
      return res.status(400).json({ message: 'Debes tener 18 anos o mas.' })
    }
    const existing = await userModel.findByEmail(email)
    if (existing) {
      return res.status(400).json({ message: 'El correo ya esta registrado.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = await userModel.create({ name, email, hashedPassword, birth, locationLabel, latitude, longitude })
    const token = jwt.sign({ id: userId, email, name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
    res.status(201).json({
      token,
      user: { id: userId, name, email, locationLabel: locationLabel.trim(), latitude: latitude ?? null, longitude: longitude ?? null }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al registrar usuario.' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password, locationLabel, latitude, longitude } = req.body
    if (!email || !password || !locationLabel?.trim()) {
      return res.status(400).json({ message: 'Correo, contrasena y ciudad/pais requeridos.' })
    }
    const user = await userModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' })
    }
    await userModel.updateLocation(user.id, { locationLabel, latitude, longitude })
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        locationLabel: locationLabel.trim(),
        latitude: latitude ?? null,
        longitude: longitude ?? null
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al iniciar sesion.' })
  }
}

module.exports = { register, login }
