const db = require('./db')

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0]
}

const create = async ({ name, email, hashedPassword, birth }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, birth_date) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, birth]
  )
  return result.insertId
}

module.exports = { findByEmail, create }