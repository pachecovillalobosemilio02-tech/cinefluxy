import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import Navbar from './component/navbar_new'
import Loader from './component/Loader'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cinefluxy_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    localStorage.setItem('cinefluxy_user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('cinefluxy_user')
    localStorage.removeItem('cinefluxy_token')
    setUser(null)
  }

  if (loading) return <Loader text="Iniciando CineFluxy" />

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/booking/:movieId" element={user ? <Booking user={user} /> : <Navigate to="/login" />} />
        <Route path="/confirmation" element={user ? <Confirmation /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}