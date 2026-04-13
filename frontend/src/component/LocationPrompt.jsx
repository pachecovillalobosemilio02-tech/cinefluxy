import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cinefluxy_location'

const getStoredLocation = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const loadStoredLocation = getStoredLocation

export default function LocationPrompt({ value, onChange }) {
  const [status, setStatus] = useState(() => (value?.latitude != null && value?.longitude != null ? 'ready' : 'idle'))
  const [message, setMessage] = useState(() => (value?.locationLabel ? `Ubicacion detectada: ${value.locationLabel}` : 'Necesitamos tu ubicacion para continuar.'))

  useEffect(() => {
    const stored = getStoredLocation()
    if (stored && value?.latitude == null && value?.longitude == null) {
      onChange(stored)
      setStatus('ready')
      setMessage(`Ubicacion detectada: ${stored.locationLabel || 'Compartida correctamente'}`)
    }
  }, [onChange, value?.latitude, value?.longitude])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      setMessage('Tu navegador no permite obtener ubicacion.')
      return
    }

    setStatus('loading')
    setMessage('Solicitando permiso de ubicacion...')

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const locationData = {
          latitude: Number(coords.latitude.toFixed(6)),
          longitude: Number(coords.longitude.toFixed(6)),
          locationLabel: `Lat ${coords.latitude.toFixed(4)}, Lng ${coords.longitude.toFixed(4)}`
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(locationData))
        onChange(locationData)
        setStatus('ready')
        setMessage(`Ubicacion detectada: ${locationData.locationLabel}`)
      },
      () => {
        setStatus('error')
        setMessage('Debes permitir la ubicacion para continuar.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  useEffect(() => {
    if (status === 'idle') requestLocation()
  }, [status])

  return (
    <div style={{ marginBottom: '1rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', padding: '0.9rem' }}>
      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
        Ubicacion del usuario
      </div>
      <div style={{ color: status === 'error' ? 'var(--red)' : 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.45 }}>
        {message}
      </div>
      <button
        type="button"
        onClick={requestLocation}
        disabled={status === 'loading'}
        style={{ marginTop: '0.75rem', background: status === 'ready' ? 'transparent' : 'var(--accent)', color: status === 'ready' ? 'var(--accent)' : '#080810', border: `1px solid ${status === 'ready' ? 'var(--accent)' : 'transparent'}`, borderRadius: '4px', padding: '0.65rem 0.85rem', fontSize: '0.82rem', fontWeight: 500, opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? 'Detectando...' : status === 'ready' ? 'Actualizar ubicacion' : 'Compartir ubicacion'}
      </button>
    </div>
  )
}
