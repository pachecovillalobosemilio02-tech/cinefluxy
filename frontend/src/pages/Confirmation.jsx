import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

export default function Confirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!state) return navigate('/')
    const t = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(t)
  }, [state, navigate])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', paddingTop: '64px' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Generando ticket...
        </span>
      </div>
    )
  }

  const { booking, movie, selected, showtime, total, user, deliveryEmail } = state
  const ticketId = booking?.ticketId || 'CX-' + Math.random().toString(36).slice(2, 9).toUpperCase()
  const qrData = `${ticketId}|${movie.title}|${showtime}|${selected.map(s => s.id).join(',')}`
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 4)
  const sentTo = booking?.deliveryEmail || deliveryEmail || user?.email

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 2rem 4rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', fontSize: '1.5rem' }}>
            OK
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Compra Exitosa</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Tu ticket ha sido enviado a {sentTo}</div>
        </div>
        <div style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.15)', borderRadius: '6px', padding: '0.7rem 1rem', marginBottom: '1.5rem', fontSize: '0.78rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)' }}>
              Ticket valido hasta las <strong style={{ color: 'var(--green)' }}>{expiry.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</strong>
            </span>
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', borderRadius: '8px', flexShrink: 0 }}>
                {movie.poster}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.04em' }}>{movie.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{movie.genre}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', marginTop: '0.4rem' }}>{ticketId}</div>
              </div>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '0 1.5rem' }} />
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.8rem' }}>
                  {[
                    { label: 'Fecha', value: new Date().toLocaleDateString('es-MX') },
                    { label: 'Hora', value: showtime },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>{f.label}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>Asientos</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{selected.map(s => s.id).join(' - ')}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>Total</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--accent)' }}>${total}</div>
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '6px' }}>
                  <QRCodeSVG value={qrData} size={90} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.3rem' }}>ESCANEAR AL INGRESAR</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button onClick={() => window.print()} style={{ flex: 1, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.75rem', fontSize: '0.88rem' }}>
              Imprimir
            </button>
            <button onClick={() => navigate('/')} style={{ flex: 1, background: 'var(--accent)', color: '#080810', border: 'none', borderRadius: '4px', padding: '0.75rem', fontWeight: 500, fontSize: '0.88rem' }}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
