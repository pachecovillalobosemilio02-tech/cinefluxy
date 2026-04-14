import { useEffect, useMemo, useState } from 'react'
import { bookingService } from '../services/api'
import Loader from '../component/Loader'

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`

export default function Account({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bookingService.getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setError('No pudimos cargar tu historial por ahora.'))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const totalSpent = bookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0)
    const activeTickets = bookings.filter((booking) => new Date(booking.expires_at) > new Date()).length

    return {
      totalBookings: bookings.length,
      totalSpent,
      activeTickets
    }
  }, [bookings])

  if (loading) return <Loader text="Cargando tu cuenta" />

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '4rem 2.5rem 2rem', background: 'radial-gradient(ellipse 70% 70% at 10% 0%, rgba(201,168,76,0.1) 0%, transparent 65%)' }}>
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '999px', padding: '0.32rem 0.8rem', marginBottom: '1rem' }}>
          Mi Cuenta
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 4.8rem)', letterSpacing: '0.04em', lineHeight: 0.95, marginBottom: '1rem' }}>
          TU ESPACIO
          <span style={{ display: 'block', color: 'var(--accent)' }}>CINEFLUXY</span>
        </h1>
        <p style={{ maxWidth: '560px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Consulta tus datos, revisa tus tickets y ten a mano el historial completo de compras en un solo lugar.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '1.5rem', padding: '0 2.5rem 4rem', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                {user?.name?.slice(0, 1)?.toUpperCase() || 'C'}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.04em' }}>{user?.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.15rem' }}>Ubicacion</div>
                <div style={{ fontSize: '0.9rem' }}>{user?.locationLabel || 'No registrada'}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.15rem' }}>Miembro desde</div>
                <div style={{ fontSize: '0.9rem' }}>{new Date().toLocaleDateString('es-CO')}</div>
              </div>
            </div>
          </section>

          <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.4rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.04em', marginBottom: '1rem' }}>Resumen</div>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {[
                { label: 'Compras realizadas', value: stats.totalBookings },
                { label: 'Tickets activos', value: stats.activeTickets },
                { label: 'Total invertido', value: formatCurrency(stats.totalSpent) }
              ].map((item) => (
                <div key={item.label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.9rem 1rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.04em' }}>Historial de Compras</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Todos tus tickets y reservas recientes.</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {bookings.length} registros
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px', padding: '0.8rem', color: 'var(--red)', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {!bookings.length && !error && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
              Aun no tienes compras registradas. Cuando reserves tu primera pelicula, aparecera aqui con su ticket.
            </div>
          )}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {bookings.map((booking) => {
              const isActive = new Date(booking.expires_at) > new Date()

              return (
                <article key={booking.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                    <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                        {booking.movie_poster || '🎬'}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', letterSpacing: '0.03em' }}>{booking.movie_title}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{booking.movie_genre}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive ? 'var(--green)' : 'var(--muted)', fontSize: '0.78rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? 'var(--green)' : 'var(--border)' }} />
                      {isActive ? 'Activo' : 'Expirado'}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.9rem' }}>
                    {[
                      { label: 'Ticket', value: booking.ticket_id },
                      { label: 'Horario', value: booking.showtime },
                      { label: 'Asientos', value: booking.seats || 'Pendiente' },
                      { label: 'Total', value: formatCurrency(booking.total) },
                      { label: 'Comprado', value: new Date(booking.created_at).toLocaleDateString('es-CO') },
                      { label: 'Valido hasta', value: new Date(booking.expires_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) }
                    ].map((item) => (
                      <div key={item.label}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.2rem' }}>{item.label}</div>
                        <div style={{ fontSize: item.label === 'Ticket' ? '0.78rem' : '0.86rem', color: item.label === 'Ticket' ? 'var(--accent)' : 'var(--text)', fontFamily: item.label === 'Ticket' ? 'var(--font-mono)' : 'inherit' }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
