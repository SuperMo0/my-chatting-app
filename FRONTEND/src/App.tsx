import { useEffect } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import { Routes, Route, Navigate } from 'react-router'
import Chats from './pages/Chats.jsx'
import Profile from './pages/Profile.jsx'
import People from './pages/People.jsx'
import { useAuthStore } from './stores/auth.store.js';
import Login from './pages/Login.js'
import { ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import Signup from './pages/Signup.js'
import { useTheme } from './theme/useTheme.js';

function App() {
  const { authUser, check, isChecking } = useAuthStore();
  const { dark, toggleDark } = useTheme();

  useEffect(() => {
    check();
  }, [check]);

  if (isChecking) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500'>
        <ClipLoader color='#3b82f6' size={50} />
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-blue animate-pulse">
          Securing Connection
        </p>
      </div>
    );
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