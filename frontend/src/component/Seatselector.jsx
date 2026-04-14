import { useEffect, useMemo, useState, useCallback } from 'react'

const SEAT_PRICES = { vip: 18, mid: 12, basic: 8 }

const generateSeats = (occupiedSeatIds = []) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const occupied = new Set(occupiedSeatIds)
  return rows.map((row, ri) => ({
    row,
    seats: Array.from({ length: 12 }, (_, ci) => {
      const id = `${row}-${ci + 1}`
      const type = ri <= 1 ? 'vip' : ri <= 5 ? 'mid' : 'basic'
      return { id, col: ci + 1, type, occupied: occupied.has(id) }
    })
  }))
}

export default function SeatSelector({ onSelectionChange, occupiedSeatIds = [] }) {
  const [selected, setSelected] = useState([])
  const seats = useMemo(() => generateSeats(occupiedSeatIds), [occupiedSeatIds])

  useEffect(() => {
    setSelected(prev => {
      const available = prev.filter((seat) => !occupiedSeatIds.includes(seat.id))
      onSelectionChange(available)
      return available
    })
  }, [occupiedSeatIds, onSelectionChange])

  const toggle = useCallback((seat) => {
    if (seat.occupied) return
    setSelected(prev => {
      const exists = prev.find(s => s.id === seat.id)
      const updated = exists ? prev.filter(s => s.id !== seat.id) : [...prev, seat]
      onSelectionChange(updated)
      return updated
    })
  }, [onSelectionChange])

  const getSeatStyle = (seat) => {
    const isSelected = selected.find(s => s.id === seat.id)
    const base = {
      width: '28px', height: '24px', borderRadius: '4px 4px 2px 2px',
      border: '1px solid transparent', cursor: seat.occupied ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s', flexShrink: 0, position: 'relative'
    }
    if (isSelected) return { ...base, background: 'var(--accent)', borderColor: 'var(--accent2)', boxShadow: '0 0 10px rgba(201,168,76,0.4)' }
    if (seat.occupied) return { ...base, background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.04)' }
    if (seat.type === 'vip') return { ...base, background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.3)' }
    if (seat.type === 'mid') return { ...base, background: 'rgba(67,97,238,0.15)', borderColor: 'rgba(67,97,238,0.3)' }
    return { ...base, background: 'rgba(58,58,82,0.6)', borderColor: 'rgba(255,255,255,0.08)' }
  }

  return (
    <div>
      <div style={{ width: '70%', margin: '0 auto 2.5rem', height: '6px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', borderRadius: '3px', position: 'relative' }}>
        <span style={{ position: 'absolute', bottom: '-1.4rem', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--muted)' }}>
          PANTALLA
        </span>
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: '1rem', marginTop: '1.5rem' }}>
        {seats.map(row => (
          <div key={row.row} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', width: '14px', textAlign: 'center', flexShrink: 0 }}>
              {row.row}
            </span>
            {row.seats.map((seat, i) => (
              <div key={seat.id} style={{ display: 'contents' }}>
                {i === 6 && <div style={{ width: '16px', flexShrink: 0 }} />}
                <div
                  style={getSeatStyle(seat)}
                  onClick={() => toggle(seat)}
                  title={`${seat.id} - ${seat.type.toUpperCase()} - $${SEAT_PRICES[seat.type]}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'VIP - $18', bg: 'rgba(201,168,76,0.3)', border: 'rgba(201,168,76,0.5)' },
          { label: 'Intermedio - $12', bg: 'rgba(67,97,238,0.3)', border: 'rgba(67,97,238,0.5)' },
          { label: 'Basico - $8', bg: 'rgba(58,58,82,0.6)', border: 'rgba(255,255,255,0.08)' },
          { label: 'Ocupado', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.04)' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.bg, border: `1px solid ${item.border}` }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export { SEAT_PRICES }
