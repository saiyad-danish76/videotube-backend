import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api"
import { useAuth } from "../context/AuthContext"
import { secure, timeAgo } from "../utils/format"

export default function Watch() {
  const { videoId } = useParams()
  const { user } = useAuth()

  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    api
      .get(`/videos/${videoId}`)
      .then(async (res) => {
        const v = res.data.data
        setVideo(v)

        // video mil gaya, ab baaki cheezein ek saath mangao
        const [channelRes, likedRes, commentsRes] = await Promise.all([
          api.get(`/users/c/${v.owner.username}`),
          api.get("/likes/videos"),
          api.get(`/comments/${videoId}`, { params: { limit: 50 } }),
        ])
        setChannel(channelRes.data.data.channel)
        setLiked(likedRes.data.data.some((x) => x._id === videoId))
        setComments(commentsRes.data.data.docs)
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load video"))
      .finally(() => setLoading(false))
  }, [videoId])

  const toggleLike = async () => {
    try {
      const res = await api.post(`/likes/toggle/v/${videoId}`)
      setLiked(res.data.data.liked)
    } catch (err) {
      setError(err.response?.data?.message || "Action failed")
    }
  }

  const toggleSubscribe = async () => {
    try {
      const res = await api.post(`/subscriptions/c/${video.owner._id}`)
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

  const addComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const res = await api.post(`/comments/${videoId}`, { content: newComment })
      // backend naya comment bina owner ke deta hai, isliye apna user jod do
      const created = {
        ...res.data.data,
        owner: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          avatar: user.avatar,
        },
      }
      setComments([created, ...comments])
      setNewComment("")
    } catch (err) {
      setError(err.response?.data?.message || "Could not add comment")
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/c/${commentId}`)
      setComments(comments.filter((c) => c._id !== commentId))
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment")
    }
  }

  if (loading) return <p className="text-gray-400">Loading...</p>
  if (!video) return <p className="text-red-400">{error || "Video not found"}</p>

  const isOwnVideo = user._id === video.owner._id

  return (
    <div className="mx-auto max-w-4xl">
      <video
        src={secure(video.videoFile)}
        poster={secure(video.thumbnail)}
        controls
        className="w-full rounded-xl bg-black"
      />

      <h1 className="mt-4 text-xl font-bold">{video.title}</h1>
      <p className="text-sm text-gray-400">
        {video.views} views • {timeAgo(video.createdAt)}
      </p>

      {error && <p className="mt-2 rounded bg-red-500/20 p-2 text-sm text-red-300">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={secure(video.owner.avatar)}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{video.owner.fullName}</p>
            {channel && (
              <p className="text-sm text-gray-400">{channel.subscribersCount} subscribers</p>
            )}
          </div>
          {channel && !isOwnVideo && (
            <button
              onClick={toggleSubscribe}
              className={`ml-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                channel.isSubscribed ? "bg-gray-700" : "bg-white text-black"
              }`}
            >
              {channel.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        <button
          onClick={toggleLike}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            liked ? "bg-red-600" : "bg-gray-800"
          }`}
        >
          {liked ? "Liked" : "Like"}
        </button>
      </div>

      <p className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-800 p-3 text-sm">
        {video.description}
      </p>

      <h2 className="mt-8 text-lg font-semibold">{comments.length} Comments</h2>

      <form onSubmit={addComment} className="mt-3 flex gap-2">
        <input
          className="w-full rounded bg-gray-800 px-3 py-2 outline-none"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="rounded bg-red-600 px-4 hover:bg-red-500">Comment</button>
      </form>

      <div className="mt-6 space-y-5">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3">
            <img
              src={secure(c.owner?.avatar)}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{c.owner?.fullName}</span>{" "}
                <span className="text-gray-400">{timeAgo(c.createdAt)}</span>
              </p>
              <p>{c.content}</p>
            </div>
            {c.owner?._id === user._id && (
              <button
                onClick={() => deleteComment(c._id)}
                className="text-sm text-gray-400 hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}