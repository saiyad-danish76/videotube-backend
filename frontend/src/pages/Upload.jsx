import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

export default function Upload() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!videoFile || !thumbnail) {
      setError("Video file and thumbnail are required")
      return
    }

    const data = new FormData()
    data.append("title", title)
    data.append("description", description)
    data.append("videoFile", videoFile)
    data.append("thumbnail", thumbnail)

    setUploading(true)
    try {
      const res = await api.post("/videos", data, {
        onUploadProgress: (event) => {
          if (event.total) setProgress(Math.round((event.loaded * 100) / event.total))
        },
      })
      navigate(`/watch/${res.data.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
      setUploading(false)
    }
  }

  const input = "w-full rounded bg-gray-800 p-2 outline-none"

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Upload video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded bg-red-500/20 p-2 text-sm text-red-300">{error}</p>}

        <input className={input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className={input} rows="4" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label className="block text-sm text-gray-300">
          Video file
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="mt-1 block w-full" />
        </label>
        <label className="block text-sm text-gray-300">
          Thumbnail
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="mt-1 block w-full" />
        </label>

        {uploading && (
          <div>
            <div className="h-2 overflow-hidden rounded bg-gray-700">
              <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {progress < 100 ? `Uploading ${progress}%` : "Processing, please wait..."}
            </p>
          </div>
        )}

        <button
          disabled={uploading}
          className="w-full rounded bg-red-600 p-2 font-semibold hover:bg-red-500 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  )
}