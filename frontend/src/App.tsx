import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'

export default function App() {
  const { user, checked } = useAuth()

  if (!checked) return null

  return (
    <>
      {user && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" replace />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
