import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    if (!form.email || !form.password) return 'Completa todos los campos.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Email no valido.'
    return null
  }

  const submit = async () => {
    setError('')
    const err = validate()
    if (err) return setError(err)
    setLoading(true)
    try {
      const res = await authService.login(form)
      localStorage.setItem('cinefluxy_token', res.data.token)
      onLogin(res.data.user)
    } catch (e) {
      setError(e.response?.data?.message || 'Error al iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(201,168,76,0.12) 0%, transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2.5rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', letterSpacing: '0.06em', color: 'var(--accent)', textAlign: 'center', marginBottom: '0.25rem' }}>
          CINE<span style={{ color: 'var(--text)' }}>FLUXY</span>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: '2rem', textTransform: 'uppercase' }}>
          Experiencia Premium
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '1.5rem' }}>Iniciar Sesion</div>
        {error && (
          <div style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '6px', padding: '0.7rem', fontSize: '0.82rem', color: 'var(--red)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        {[
          { label: 'Correo electronico', key: 'email', type: 'email', placeholder: 'correo@ejemplo.com' },
          { label: 'Contrasena', key: 'password', type: 'password', placeholder: 'min. 6 caracteres' }
        ].map(field => (
          <div key={field.key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={set(field.key)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.7rem 0.9rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        ))}
        <button
          onClick={submit}
          disabled={loading}
          style={{ width: '100%', marginTop: '0.5rem', background: 'var(--accent)', color: '#080810', border: 'none', borderRadius: '4px', padding: '0.85rem', fontWeight: 500, fontSize: '0.95rem', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Procesando...' : 'Entrar'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
          No tienes cuenta? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Registrate</Link>
        </div>
      </div>
    </div>
  )
}