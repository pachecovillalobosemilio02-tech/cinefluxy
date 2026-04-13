export default function Loader({ text = 'Cargando...' }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: '1rem',
      background: 'var(--bg)'
    }}>
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)'
      }}>
        {text}
      </span>
    </div>
  )
}