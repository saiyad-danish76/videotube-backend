import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api"
import { useAuth } from "../context/AuthContext"
import VideoCard from "../components/VideoCard"
import { secure } from "../utils/format"

export default function Channel() {
  const { username } = useParams()
  const { user } = useAuth()

  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api
      .get(`/users/c/${username}`)
      .then(async (res) => {
        const ch = res.data.data.channel
        setChannel(ch)
        const vRes = await api.get("/videos", { params: { userId: ch._id, limit: 50 } })
        setVideos(vRes.data.data.docs)
      })
      .catch((err) => setError(err.response?.data?.message || "Channel not found"))
      .finally(() => setLoading(false))
  }, [username])

  const toggleSubscribe = async () => {
    try {
      const res = await api.post(`/subscriptions/c/${channel._id}`)
      const subscribed = res.data.data.subscribed
      setChannel((c) => ({
        ...c,
        isSubscribed: subscribed,
        subscribersCount: c.subscribersCount + (subscribed ? 1 : -1),
      }))
    } catch (err) {
      setError(err.response?.data?.message || "Action failed")
    }
  }

  if (loading) return <p className="text-gray-400">Loading...</p>
  if (!channel) return <p className="text-red-400">{error}</p>

  const isOwn = user._id === channel._id

  return (
    <div className="mx-auto max-w-6xl">
      {channel.coverImage ? (
        <img
          src={secure(channel.coverImage)}
          alt=""
          className="h-40 w-full rounded-xl object-cover md:h-56"
        />
      ) : (
        <div className="h-40 w-full rounded-xl bg-gray-800 md:h-56" />
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <img
          src={secure(channel.avatar)}
          alt=""
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{channel.fullName}</h1>
          <p className="text-sm text-gray-400">
            @{channel.username} • {channel.subscribersCount} subscribers • {videos.length} videos
          </p>
        </div>
        {!isOwn && (
          <button
            onClick={toggleSubscribe}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              channel.isSubscribed ? "bg-gray-700" : "bg-white text-black"
            }`}
          >
            {channel.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

      <h2 className="mb-4 mt-8 text-lg font-semibold">Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-400">No videos yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      )}
    </div>
  )
}