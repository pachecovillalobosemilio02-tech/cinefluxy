import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'cinefluxy_location'
const COUNTRY_OPTIONS = ['Colombia', 'Mexico', 'Argentina', 'Chile', 'Peru', 'Ecuador', 'Estados Unidos', 'Espana', 'Otro']

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
  const [city, setCity] = useState(value?.city || '')
  const [country, setCountry] = useState(value?.country || '')
  const locationLabel = useMemo(() => {
    const parts = [city.trim(), country.trim()].filter(Boolean)
    return parts.join(', ')
  }, [city, country])

  useEffect(() => {
    const stored = getStoredLocation()
    if (stored && !value?.locationLabel) {
      onChange(stored)
      setCity(stored.city || '')
      setCountry(stored.country || '')
    }
  }, [onChange, value?.locationLabel])

  useEffect(() => {
    const nextValue = {
      city,
      country,
      locationLabel,
      latitude: null,
      longitude: null
    }

    onChange(nextValue)

    if (locationLabel) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue))
    }
  }, [city, country, locationLabel, onChange])

  return (
    <div style={{ marginBottom: '1rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', padding: '0.9rem' }}>
      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
        De donde eres
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.45, marginBottom: '0.75rem' }}>
        Solo pedimos tu ciudad y pais. No usamos tu ubicacion exacta.
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad"
          style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.7rem 0.9rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.7rem 0.9rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
        >
          <option value="">Selecciona tu pais</option>
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
