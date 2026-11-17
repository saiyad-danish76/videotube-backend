import { Link } from "react-router-dom"
import { formatDuration, timeAgo, secure } from "../utils/format"

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="block text-white">
      <div className="relative">
        <img
          src={secure(video.thumbnail)}
          alt={video.title}
          className="aspect-video w-full rounded-xl object-cover"
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <img
          src={secure(video.owner?.avatar)}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
        <div>
          <h3 className="line-clamp-2 font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-400">{video.owner?.fullName}</p>
          <p className="text-sm text-gray-400">
            {video.views} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}