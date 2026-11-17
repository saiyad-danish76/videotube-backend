import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../api"
import VideoCard from "../components/VideoCard"

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // naya search aaye to page 1 se shuru
  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError("")
    api
      .get("/videos", { params: { page, limit: 12, query } })
      .then((res) => {
        const data = res.data.data
        setVideos(data.docs)
        setTotalPages(data.totalPages)
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load videos"))
      .finally(() => setLoading(false))
  }, [page, query])

  if (loading) return <p className="text-gray-400">Loading videos...</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <div>
      {query && <h2 className="mb-4 text-lg">Results for "{query}"</h2>}

      {videos.length === 0 ? (
        <p className="text-gray-400">No videos found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded bg-gray-800 px-4 py-2 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded bg-gray-800 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}