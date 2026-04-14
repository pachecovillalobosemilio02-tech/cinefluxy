import { useState } from 'react'
import { bookingService } from '../services/api'

export default function ValidateTicket() {
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const validate = async () => {
    if (!ticketId.trim()) {
      setError('Ingresa el codigo del ticket.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await bookingService.validateTicket(ticketId.trim())
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.message || 'No pudimos validar el ticket.')
    } finally {
      setLoading(false)
    }
  }

  const ticket = result?.ticket

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '4rem 2.5rem 2rem', background: 'radial-gradient(ellipse 70% 70% at 10% 0%, rgba(6,214,160,0.08) 0%, transparent 65%)' }}>
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--green)', background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.18)', borderRadius: '999px', padding: '0.32rem 0.8rem', marginBottom: '1rem' }}>
          Control de Acceso
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 4.8rem)', letterSpacing: '0.04em', lineHeight: 0.95, marginBottom: '1rem' }}>
          VALIDAR
          <span style={{ display: 'block', color: 'var(--green)' }}>TICKET</span>
        </h1>
        <p style={{ maxWidth: '560px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Ingresa el codigo del ticket enviado al cliente para verificar si sigue vigente y mostrar los datos de acceso.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 420px) 1fr', gap: '1.5rem', padding: '0 2.5rem 4rem', alignItems: 'start' }}>
        <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.04em', marginBottom: '0.8rem' }}>Buscar Ticket</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: '1rem' }}>
            Ejemplo: `CX-AB12CD34`
          </div>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            placeholder="CX-XXXXXXX"
            onKeyDown={(e) => e.key === 'Enter' && validate()}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.85rem 1rem', color: 'var(--text)', fontSize: '0.92rem', outline: 'none', fontFamily: 'var(--font-mono)' }}
          />
          <button
            onClick={validate}
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', background: 'var(--green)', color: '#04120d', border: 'none', borderRadius: '6px', padding: '0.85rem', fontWeight: 600, fontSize: '0.92rem', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Validando...' : 'Validar Ticket'}
          </button>
          {error && (
            <div style={{ marginTop: '1rem', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px', padding: '0.8rem', color: 'var(--red)', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
        </section>

        <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.4rem', minHeight: '280px' }}>
          {!result && !error && (
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Aun no has validado ningun ticket. Cuando ingreses un codigo valido, veras aqui la informacion completa de la reserva.
            </div>
          )}

          {result && ticket && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', letterSpacing: '0.04em' }}>{ticket.movie_title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{ticket.movie_genre}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: result.valid ? 'var(--green)' : 'var(--red)', fontSize: '0.82rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: result.valid ? 'var(--green)' : 'var(--red)' }} />
                  {result.valid ? 'Ticket valido' : 'Ticket expirado'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Ticket', value: ticket.ticket_id },
                  { label: 'Horario', value: ticket.showtime },
                  { label: 'Asientos', value: ticket.seats || 'Sin asientos' },
                  { label: 'Total', value: `$${Number(ticket.total || 0).toFixed(2)}` },
                  { label: 'Comprado', value: new Date(ticket.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) },
                  { label: 'Valido hasta', value: new Date(ticket.expires_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) }
                ].map((item) => (
                  <div key={item.label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.9rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.25rem' }}>{item.label}</div>
                    <div style={{ color: item.label === 'Ticket' ? 'var(--accent)' : 'var(--text)', fontFamily: item.label === 'Ticket' ? 'var(--font-mono)' : 'inherit', fontSize: '0.88rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
