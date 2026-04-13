import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, index }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/booking/${movie.id}`)}
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s, border-color 0.25s',
        animation: 'fadeUp 0.4s ease both',
        animationDelay: `${index * 0.06}s`
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        aspectRatio: '2/3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '5rem', position: 'relative', overflow: 'hidden',
        background: `radial-gradient(circle at 50% 40%, ${movie.color}22 0%, #0e0e1a 70%)`
      }}>
       <img src={movie.image_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(8,8,16,0.95) 100%)'
        }} />
        <div style={{
          position: 'absolute', top: '0.8rem', right: '0.8rem',
          background: 'rgba(8,8,16,0.7)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px',
          padding: '0.25rem 0.5rem', fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem', color: 'var(--accent)'
        }}>
          {movie.rating}
        </div>
      </div>
      <div style={{ padding: '1rem 1.2rem 1.2rem' }}>
        <div style={{
          fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
          color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: '0.35rem'
        }}>
          {movie.genre}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '1.3rem',
          letterSpacing: '0.04em', marginBottom: '0.4rem', lineHeight: 1.1
        }}>
          {movie.title}
        </div>
        <div style={{
          display: 'flex', gap: '0.8rem', fontSize: '0.75rem',
          color: 'var(--muted)', marginBottom: '1rem'
        }}>
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
        </div>
        <p style={{
          fontSize: '0.78rem', color: 'var(--muted)',
          lineHeight: 1.6, marginBottom: '1rem'
        }}>
          {movie.desc}
        </p>
        <button style={{
          width: '100%', background: 'var(--accent)', color: '#080810',
          border: 'none', borderRadius: '4px', padding: '0.65rem',
          fontWeight: 500, fontSize: '0.88rem', transition: 'background 0.2s'
        }}>
          Comprar Entrada
        </button>
      </div>
    </div>
  )
}