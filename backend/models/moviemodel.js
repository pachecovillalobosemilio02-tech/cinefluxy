const db = require('./db')

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM movies ORDER BY id ASC')
  return rows
}

const getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id])
  if (!rows[0]) return null
  const [showtimes] = await db.query('SELECT time FROM showtimes WHERE movie_id = ?', [id])
  return { ...rows[0], showtimes: showtimes.map(s => s.time) }
}

module.exports = { getAll, getById }