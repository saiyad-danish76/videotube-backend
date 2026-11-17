import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { secure } from "../utils/format"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    const q = search.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/")
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-800 bg-gray-900 px-4 py-3 text-white">
      <Link to="/" className="text-xl font-bold text-red-500">
        VideoTube
      </Link>

      <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-xl">
        <input
          className="w-full rounded-l bg-gray-800 px-3 py-2 outline-none"
          placeholder="Search videos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="rounded-r bg-gray-700 px-4 hover:bg-gray-600">Search</button>
      </form>

      {user && (
        <div className="flex items-center gap-3">
          <img
            src={secure(user.avatar)}
            alt={user.username}
            className="h-9 w-9 rounded-full object-cover"
          />
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-3 py-1.5 text-sm hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}