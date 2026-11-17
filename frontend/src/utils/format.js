// Cloudinary ka http link https me badalta hai (live site pe image block na ho)
export const secure = (url) => (url ? url.replace(/^http:\/\//, "https://") : url)

// 125 seconds -> "2:05"
export function formatDuration(totalSeconds = 0) {
  const s = Math.round(totalSeconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, "0")
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${sec}`
  return `${m}:${sec}`
}

// "3 days ago"
export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ]
  for (const [name, value] of units) {
    const count = Math.floor(seconds / value)
    if (count >= 1) return `${count} ${name}${count > 1 ? "s" : ""} ago`
  }
  return "just now"
}