import './App.css'
import Home from './pages/home.js'
import { Routes, Route, Navigate } from 'react-router'
import Chats from './pages/chats.jsx'
import Profile from './pages/profile.jsx'
import People from './pages/people.jsx'
import Login from './pages/login.js'
import { ToastContainer } from 'react-toastify';
import Signup from './pages/signup.js'
import { useTheme } from './theme/useTheme.js';
import { useCheckSession } from './hooks/use-auth-queries.js'
import LoadingScreen from './components/ui/loading-screen.js'


function App() {

  const { dark, toggleDark } = useTheme();
  const { data: authUser, isLoading } = useCheckSession();

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      className="min-h-screen transition-colors duration-500 ease-in-out"
    >
      <ToastContainer
        position="bottom-right"
        theme={dark ? "dark" : "light"}
        toastClassName="rounded-2xl font-bold"
      />

      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" replace />}>
          <Route index element={<Chats />} />
          <Route path='people' element={<People />} />
          <Route path='profile' element={<Profile dark={dark} toggleDark={toggleDark} />} />
        </Route>

        <Route
          path='/login'
          element={!authUser ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path='/signup'
          element={!authUser ? <Signup /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App