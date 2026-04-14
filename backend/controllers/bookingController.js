const db = require('../models/db')
const { v4: uuidv4 } = require('uuid')
const QRCode = require('qrcode')
const nodemailer = require('nodemailer')

const transporterConfig = process.env.SMTP_HOST
  ? {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    }
  : {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    }

const transporter = nodemailer.createTransport(transporterConfig)

const sendWithBrevoApi = async ({ to, subject, html }) => {
  const senderEmail = (process.env.EMAIL_FROM || process.env.EMAIL_USER || '').match(/<([^>]+)>/)?.[1] || process.env.EMAIL_USER
  const senderName = (process.env.EMAIL_FROM || '').match(/^([^<]+)/)?.[1]?.trim() || 'CineFluxy'

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo API ${response.status}: ${body}`)
  }
}

const sendTicketEmail = async ({ to, ticketId, showtime, seats, total, expiresAt, qrImage }) => {
  const subject = `Tu ticket CineMax - ${ticketId}`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0e0e1a;color:#e8e8f0;padding:2rem;border-radius:12px;">
      <h2 style="color:#c9a84c;font-size:1.6rem;margin-bottom:0.5rem;">CineMax</h2>
      <p style="color:#6b6b80;margin-bottom:1.5rem;">Tu compra fue procesada exitosamente.</p>
      <p><strong>Destinatario:</strong> ${to}</p>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Horario:</strong> ${showtime}</p>
      <p><strong>Asientos:</strong> ${seats.map(s => s.id).join(', ')}</p>
      <p><strong>Total:</strong> $${total}</p>
      <p><strong>Valido hasta:</strong> ${expiresAt.toLocaleString('es-MX')}</p>
      <div style="margin-top:1.5rem;text-align:center;">
        <img src="${qrImage}" alt="QR Ticket" style="width:160px;height:160px;border-radius:8px;" />
        <p style="font-size:0.75rem;color:#6b6b80;margin-top:0.5rem;">Presenta este QR al ingresar</p>
      </div>
    </div>
  `

  if (process.env.BREVO_API_KEY) {
    await sendWithBrevoApi({ to, subject, html })
    return
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `CineMax <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  })
}

const createBooking = async (req, res) => {
  const conn = await db.getConnection()
  try {
    const { movieId, seats, showtime, total, deliveryEmail } = req.body
    const userId = req.user.id

    if (!movieId || !seats?.length || !showtime || !total) {
      return res.status(400).json({ message: 'Datos de reserva incompletos.' })
    }

    if (deliveryEmail && !/\S+@\S+\.\S+/.test(deliveryEmail)) {
      return res.status(400).json({ message: 'El correo para enviar el ticket no es valido.' })
    }

    await conn.beginTransaction()

    const seatIds = seats.map((seat) => seat.id)
    const placeholders = seatIds.map(() => '?').join(', ')
    const [takenSeats] = await conn.query(
      `SELECT bs.seat_id
      FROM bookings b
      JOIN booking_seats bs ON bs.booking_id = b.id
      WHERE b.movie_id = ? AND b.showtime = ? AND bs.seat_id IN (${placeholders})`,
      [movieId, showtime, ...seatIds]
    )

    if (takenSeats.length) {
      await conn.rollback()
      return res.status(409).json({
        message: `Estos asientos ya no estan disponibles: ${takenSeats.map((seat) => seat.seat_id).join(', ')}.`
      })
    }

    const ticketId = 'CX-' + uuidv4().split('-')[0].toUpperCase()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 4)

    const [bookingResult] = await conn.query(
      'INSERT INTO bookings (ticket_id, user_id, movie_id, showtime, total, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [ticketId, userId, movieId, showtime, total, expiresAt]
    )
    const bookingId = bookingResult.insertId

    for (const seat of seats) {
      await conn.query(
        'INSERT INTO booking_seats (booking_id, seat_id, seat_type) VALUES (?, ?, ?)',
        [bookingId, seat.id, seat.type]
      )
    }

    const qrData = `${ticketId}|${movieId}|${showtime}|${seats.map(s => s.id).join(',')}`
    const qrImage = await QRCode.toDataURL(qrData)

    await conn.query('UPDATE bookings SET qr_code = ? WHERE id = ?', [qrImage, bookingId])
    await conn.commit()

    const [userRow] = await db.query('SELECT name, email FROM users WHERE id = ?', [userId])
    const user = userRow[0]
    const recipientEmail = deliveryEmail || user.email

    let emailSent = false
    let emailError = null

    try {
      await sendTicketEmail({ to: recipientEmail, ticketId, showtime, seats, total, expiresAt, qrImage })
      emailSent = true
    } catch (emailErr) {
      console.error('Error enviando email:', emailErr.message)
      emailError = emailErr.message
    }

    res.status(201).json({
      ticketId,
      bookingId,
      expiresAt,
      qrCode: qrImage,
      deliveryEmail: recipientEmail,
      emailSent,
      emailError
    })
  } catch (err) {
    await conn.rollback()
    console.error(err)
    res.status(500).json({ message: 'Error al crear la reserva.' })
  } finally {
    conn.release()
  }
}

const validateTicket = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query(
      `SELECT b.*, m.title AS movie_title, m.genre AS movie_genre, m.poster AS movie_poster,
        GROUP_CONCAT(bs.seat_id ORDER BY bs.seat_id SEPARATOR ', ') AS seats
      FROM bookings b
      JOIN movies m ON m.id = b.movie_id
      LEFT JOIN booking_seats bs ON bs.booking_id = b.id
      WHERE b.ticket_id = ?
      GROUP BY b.id, m.title, m.genre, m.poster`,
      [id]
    )
    if (!rows[0]) return res.status(404).json({ valid: false, message: 'Ticket no encontrado.' })
    const now = new Date()
    const valid = new Date(rows[0].expires_at) > now
    res.json({ valid, ticket: rows[0] })
  } catch (err) {
    res.status(500).json({ message: 'Error al validar ticket.' })
  }
}

const getOccupiedSeats = async (req, res) => {
  try {
    const { movieId, showtime } = req.query

    if (!movieId || !showtime) {
      return res.status(400).json({ message: 'Pelicula y horario requeridos.' })
    }

    const [rows] = await db.query(
      `SELECT bs.seat_id
      FROM bookings b
      JOIN booking_seats bs ON bs.booking_id = b.id
      WHERE b.movie_id = ? AND b.showtime = ?`,
      [movieId, showtime]
    )

    res.json({ occupiedSeats: rows.map((row) => row.seat_id) })
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener asientos ocupados.' })
  }
}

const getMyBookings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        b.id,
        b.ticket_id,
        b.movie_id,
        b.showtime,
        b.total,
        b.expires_at,
        b.created_at,
        m.title AS movie_title,
        m.poster AS movie_poster,
        m.genre AS movie_genre,
        GROUP_CONCAT(bs.seat_id ORDER BY bs.seat_id SEPARATOR ', ') AS seats
      FROM bookings b
      JOIN movies m ON b.movie_id = m.id
      LEFT JOIN booking_seats bs ON bs.booking_id = b.id
      WHERE b.user_id = ?
      GROUP BY b.id, b.ticket_id, b.movie_id, b.showtime, b.total, b.expires_at, b.created_at, m.title, m.poster, m.genre
      ORDER BY b.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reservas.' })
  }
}

module.exports = { createBooking, validateTicket, getMyBookings, getOccupiedSeats }
