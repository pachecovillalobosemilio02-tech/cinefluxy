export default function TicketSummary({ movie, selected, showtime, total, SEAT_PRICES }) {
  const breakdown = selected.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1
    return acc
  }, {})

  const typeColors = { vip: '#c9a84c', mid: '#4361ee', basic: '#888' }

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '1.5rem', position: 'sticky', top: '80px'
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.06em', marginBottom: '1.2rem' }}>
        Resumen
      </div>
      {[
        { label: 'Pelicula', value: movie?.title },
        { label: 'Horario', value: showtime },
        { label: 'Fecha', value: new Date().toLocaleDateString('es-MX') }
      ].map(item => (
        <div key={item.label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.82rem', padding: '0.5rem 0',
          borderBottom: '1px solid var(--border)', color: 'var(--muted)'
        }}>
          <span>{item.label}</span>
          <strong style={{ color: 'var(--text)', textAlign: 'right', maxWidth: '160px' }}>{item.value}</strong>
        </div>
      ))}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        fontSize: '0.82rem', padding: '0.5rem 0',
        borderBottom: '1px solid var(--border)', color: 'var(--muted)'
      }}>
        <span>Asientos</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'flex-end', maxWidth: '160px' }}>
          {selected.length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Sin seleccionar</span>
          ) : (
            selected.map(s => (
              <span key={s.id} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                padding: '0.2rem 0.4rem', background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2px', color: 'var(--accent)'
              }}>
                {s.id}
              </span>
            ))
          )}
        </div>
      </div>
      {selected.length > 0 && (
        <div style={{ margin: '0.8rem 0' }}>
          {Object.entries(breakdown).map(([type, count]) => (
            <div key={type} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '0.78rem', padding: '0.3rem 0', color: 'var(--muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                  padding: '0.1rem 0.35rem', borderRadius: '2px',
                  background: `${typeColors[type]}15`, color: typeColors[type]
                }}>
                  {type.toUpperCase()}
                </span>
                x {count}
              </span>
              <span>${SEAT_PRICES[type] * count}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{
        marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>
          Total
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent)', letterSpacing: '0.04em' }}>
          ${total}
        </span>
      </div>
    </div>
  )
}