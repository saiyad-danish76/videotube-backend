import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" })
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!avatar || !coverImage) {
      setError("Avatar and cover image are required")
      return
    }

    // file bhejni ho to JSON nahi, FormData use hota hai
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    data.append("avatar", avatar)
    data.append("coverImage", coverImage)

    setSubmitting(true)
    try {
      await api.post("/users/register", data)
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  const input = "w-full rounded bg-gray-700 p-2 outline-none"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-gray-800 p-6 text-white"
      >
        <h1 className="text-2xl font-bold">Create your account</h1>

        {error && (
          <p className="rounded bg-red-500/20 p-2 text-sm text-red-300">{error}</p>
        )}

        <input className={input} name="fullName" placeholder="Full name" onChange={handleChange} required />
        <input className={input} name="username" placeholder="Username" onChange={handleChange} required />
        <input className={input} name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input className={input} name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <label className="block text-sm text-gray-300">
          Avatar
          <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} className="mt-1 block w-full" />
        </label>
        <label className="block text-sm text-gray-300">
          Cover image
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="mt-1 block w-full" />
        </label>

        <button
          disabled={submitting}
          className="w-full rounded bg-red-600 p-2 font-semibold hover:bg-red-500 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}