import { createContext, useContext, useEffect, useState } from "react"
import api from "../api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // page khulte hi check karo ki user pehle se logged in hai ya nahi
  useEffect(() => {
    api
      .get("/users/current-user")
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (identifier, password) => {
    const body = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password }
    const res = await api.post("/users/login", body)
    setUser(res.data.data.user)
  }

  const logout = async () => {
    await api.post("/users/logout")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)