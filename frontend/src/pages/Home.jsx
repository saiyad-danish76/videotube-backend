import { useAuth } from "../context/AuthContext"

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
        <button onClick={logout} className="rounded bg-red-600 px-4 py-2 hover:bg-red-500">
          Logout
        </button>
      </div>
    </div>
  )
}