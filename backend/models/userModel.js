const db = require('./db')

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0]
}

const create = async ({ name, email, hashedPassword, birth, locationLabel, latitude, longitude }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, birth_date, location_label, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, birth, locationLabel || null, latitude ?? null, longitude ?? null]
  )
  return result.insertId
}

const updateLocation = async (id, { locationLabel, latitude, longitude }) => {
  await db.query(
    'UPDATE users SET location_label = ?, latitude = ?, longitude = ? WHERE id = ?',
    [locationLabel || null, latitude ?? null, longitude ?? null, id]
  )
}

module.exports = { findByEmail, create, updateLocation }
