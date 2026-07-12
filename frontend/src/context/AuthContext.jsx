import React, { createContext, useContext, useState, useCallback } from 'react'
import axiosClient from '../api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('transitops_user')
    return raw ? JSON.parse(raw) : null
  })

  const login = useCallback(async (email, password) => {
    const { data } = await axiosClient.post('/api/auth/login', { email, password })
    localStorage.setItem('transitops_token', data.token)
    localStorage.setItem('transitops_user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const signup = useCallback(async (payload) => {
    const { data } = await axiosClient.post('/api/auth/signup', payload)
    localStorage.setItem('transitops_token', data.token)
    localStorage.setItem('transitops_user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('transitops_token')
    localStorage.removeItem('transitops_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isFleetManager: user?.role === 'FLEET_MANAGER',
      isSafetyOfficer: user?.role === 'SAFETY_OFFICER'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
