import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Drivers from './pages/Drivers.jsx'
import Trips from './pages/Trips.jsx'
import Maintenance from './pages/Maintenance.jsx'
import FuelExpenses from './pages/FuelExpenses.jsx'
import Reports from './pages/Reports.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel-expenses" element={<FuelExpenses />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
