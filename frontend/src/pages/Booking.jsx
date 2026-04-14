import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { moviesService, bookingService } from '../services/api'
import SeatSelector, { SEAT_PRICES } from '../component/Seatselector'
import TicketSummary from '../component/Ticketsummary'
import Loader from '../component/Loader'

export default function Booking({ user }) {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [showtime, setShowtime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deliveryEmail, setDeliveryEmail] = useState(user?.email || '')
  const [occupiedSeatIds, setOccupiedSeatIds] = useState([])

  useEffect(() => {
    moviesService.getById(movieId)
      .then(res => {
        setMovie(res.data)
        setShowtime(res.data.showtimes?.[0] || '')
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [movieId, navigate])

  useEffect(() => {
    if (!movie?.id || !showtime) return

    bookingService.getOccupiedSeats(movie.id, showtime)
      .then((res) => setOccupiedSeatIds(res.data.occupiedSeats || []))
      .catch(() => setOccupiedSeatIds([]))
  }, [movie?.id, showtime])

  const total = selected.reduce((sum, s) => sum + SEAT_PRICES[s.type], 0)

  const handleConfirm = async () => {
    if (!selected.length) return
    if (!deliveryEmail || !/\S+@\S+\.\S+/.test(deliveryEmail)) {
      setError('Ingresa un correo valido para enviar el ticket.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await bookingService.create({
        movieId: movie.id,
        seats: selected.map(s => ({ id: s.id, type: s.type })),
        showtime,
        total,
        deliveryEmail
      })
      setOccupiedSeatIds(prev => [...new Set([...prev, ...selected.map((seat) => seat.id)])])
      navigate('/confirmation', { state: { booking: res.data, movie, selected, showtime, total, user, deliveryEmail } })
    } catch (e) {
      setError(e.response?.data?.message || 'Error al procesar la compra.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader text="Cargando sala" />

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Volver
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.06em' }}>{movie.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
            <span>{movie.genre}</span>
            <span>{movie.duration}</span>
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2.5rem 2rem', flexWrap: 'wrap' }}>
        {['Pelicula', 'Asientos', 'Confirmacion'].map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {i > 0 && <span style={{ color: 'var(--border)', marginRight: '0.3rem' }}>›</span>}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', color: i === 0 ? 'var(--green)' : i === 1 ? 'var(--accent)' : 'var(--muted)' }}>
              {i + 1}. {step}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', padding: '0 2.5rem 4rem', alignItems: 'start' }}>
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: '0.8rem' }}>
              Selecciona Horario
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {movie.showtimes?.map(t => (
                <button
                  key={t}
                  onClick={() => setShowtime(t)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', padding: '0.45rem 1rem', background: showtime === t ? 'rgba(201,168,76,0.12)' : 'var(--bg3)', border: `1px solid ${showtime === t ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '4px', color: showtime === t ? 'var(--accent)' : 'var(--muted)' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <SeatSelector onSelectionChange={setSelected} occupiedSeatIds={occupiedSeatIds} />
        </div>
        <div>
          <TicketSummary movie={movie} selected={selected} showtime={showtime} total={total} SEAT_PRICES={SEAT_PRICES} />
          <div style={{ marginTop: '1rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.45rem' }}>
              Correo de entrega
            </div>
            <input
              type="email"
              value={deliveryEmail}
              onChange={(e) => setDeliveryEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.7rem 0.9rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
            />
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
              El ticket se enviara a este correo junto con su codigo QR.
            </div>
          </div>
          {error && (
            <div style={{ marginTop: '1rem', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '6px', padding: '0.7rem', fontSize: '0.82rem', color: 'var(--red)' }}>
              {error}
            </div>
          )}
          <button
            onClick={handleConfirm}
            disabled={selected.length === 0 || submitting}
            style={{ width: '100%', marginTop: '1rem', background: 'var(--accent)', color: '#080810', border: 'none', borderRadius: '4px', padding: '0.85rem', fontWeight: 500, fontSize: '0.95rem', opacity: selected.length === 0 || submitting ? 0.4 : 1 }}
          >
            {submitting ? 'Procesando...' : selected.length === 0 ? 'Selecciona asientos' : `Confirmar - $${total}`}
          </button>
        </div>
      </div>
    </div>
  )
}
