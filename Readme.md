# VideoTube Backend

YouTube-jaisa backend: Node.js, Express 5, MongoDB (Mongoose), Cloudinary, JWT auth.

## Features
- User register, login, logout, refresh token, profile, avatar/cover update
- Video upload, list (search, sort, pagination), update, delete, publish toggle
- Subscriptions, likes, comments, tweets, playlists
- Channel dashboard (stats and videos)
- Watch history, channel profile (aggregation pipelines)

## Setup
```bash
git clone https://github.com/saiyad-danish76/chai-backend
cd chai-backend
npm install
copy .env.sample .env   # fill in your values
npm run dev
```

## API base: `/api/v1`
| Module | Routes |
|---|---|
| users | register, login, logout, refresh-token, current-user, c/:username, history |
| videos | GET/POST `/`, GET/PATCH/DELETE `/:videoId`, PATCH `/toggle/publish/:videoId` |
| subscriptions | POST/GET `/c/:channelId`, GET `/u/:subscriberId` |
| likes | POST `/toggle/v/:videoId`, GET `/videos` |
| comments | GET/POST `/:videoId`, PATCH/DELETE `/c/:commentId` |
| tweets | POST `/`, GET `/user/:userId`, PATCH/DELETE `/:tweetId` |
| playlists | POST `/`, GET `/user/:userId`, GET/PATCH/DELETE `/:playlistId`, PATCH `/add/:videoId/:playlistId`, PATCH `/remove/:videoId/:playlistId` |
| dashboard | GET `/stats`, GET `/videos` |
| healthcheck | GET `/` |

Protected routes need login (cookie or `Authorization: Bearer <token>`).

## Author
Saiyad Danish Hussain