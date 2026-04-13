import { Link } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', height: '64px',
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <Link to="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.8rem',
        letterSpacing: '0.08em',
        color: 'var(--accent)'
      }}>
        CINE<span style={{ color: 'var(--text)' }}>FLUXY</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Hola, <strong style={{ color: 'var(--accent)' }}>{user.name}</strong>
        </span>
        <button onClick={onLogout} style={{
          background: 'transparent', border: '1px solid rgba(230,57,70,0.3)',
          color: 'var(--red)', padding: '0.45rem 1.1rem', borderRadius: '4px',
          fontSize: '0.82rem', transition: 'all 0.2s'
        }}>
          Salir
        </button>
      </div>
    </nav>
  )
}