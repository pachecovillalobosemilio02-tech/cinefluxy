import { useState, useEffect } from 'react'
import { moviesService } from '../services/api'
import MovieCard from '../component/moviecard'
import Loader from '../component/Loader'

const GENRES = ['Todos', 'Sci-Fi', 'Drama', 'Accion', 'Western', 'Terror', 'Animacion']

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')

  useEffect(() => {
    moviesService.getAll()
      .then(res => setMovies(res.data))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Cargando cartelera" />

  const filtered = filter === 'Todos' ? movies : movies.filter(m => m.genre.includes(filter))

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '5rem 2.5rem 3rem', position: 'relative', background: 'radial-gradient(ellipse 70% 70% at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 65%)' }}>
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2px', padding: '0.3rem 0.7rem', marginBottom: '1.2rem' }}>
          Cartelera 2026
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '0.04em', lineHeight: 0.92, marginBottom: '1.2rem' }}>
          VIVE LA
          <span style={{ display: 'block', color: 'var(--accent)' }}>EXPERIENCIA</span>
        </h1>
        <p style={{ maxWidth: '480px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Selecciona tu pelicula, elige tus asientos y recibe tu ticket digital en segundos.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0 2.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {GENRES.map(g => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            style={{ padding: '0.4rem 1rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid', transition: 'all 0.2s', background: filter === g ? 'var(--accent)' : 'transparent', color: filter === g ? '#080810' : 'var(--text)', borderColor: filter === g ? 'var(--accent)' : 'var(--border)' }}
          >
            {g}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '0 2.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.06em' }}>En Cartelera</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>{filtered.length} peliculas</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', padding: '0 2.5rem 4rem' }}>
        {filtered.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>
    </div>
  )
}