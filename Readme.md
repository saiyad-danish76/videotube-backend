# VideoTube

A full-stack YouTube-style video platform built with Node.js, Express, MongoDB and React.
Users can register, upload videos, watch, like, comment, subscribe to channels and explore channel pages.

## Live Demo

- Frontend: https://videotube-bice.vercel.app
- Backend API health check: https://videotube-backend-qvu3.onrender.com/api/v1/healthcheck

> The backend runs on a free plan, so the first request can take 30-60 seconds to wake up.

## Features

- Register and login with JWT access and refresh tokens (httpOnly cookies)
- Upload videos and thumbnails (Multer + Cloudinary)
- Watch videos with view counter and watch history
- Like videos, comment (add and delete), subscribe to channels
- Channel pages with cover image, subscriber count and uploaded videos
- Search and pagination on the home feed
- Playlists, tweets and channel dashboard APIs
- Global error handling with consistent API responses

## Tech Stack

| Part | Technologies |
| --- | --- |
| Backend | Node.js, Express 5, MongoDB Atlas, Mongoose, JWT, bcrypt, Multer, Cloudinary |
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS |
| Deployment | Render (backend), Vercel (frontend) |

## Project Structure

```
├── src/                 # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   └── index.js
├── frontend/            # React app
│   └── src/ (pages, components, context, utils)
└── docs/                # Postman collection
```

## Run Locally

### 1. Backend

```bash
npm install
```

Create a `.env` file in the project root (see `.env.sample`):

```
PORT=8000
MONGODB_URI=your_mongodb_atlas_uri_without_trailing_slash
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and proxies `/api` requests to http://localhost:8000.

## API Overview

Base URL: `/api/v1` (all routes except register, login and healthcheck need login)

| Resource | Endpoints |
| --- | --- |
| Users | `POST /users/register`, `POST /users/login`, `POST /users/logout`, `POST /users/refresh-access-token`, `POST /users/change-password`, `GET /users/current-user`, `PUT /users/update-profile`, `PUT /users/update-avatar`, `PUT /users/update-cover-image`, `GET /users/c/:username`, `GET /users/watch-history` |
| Videos | `GET /videos`, `POST /videos`, `GET /videos/:videoId`, `PATCH /videos/:videoId`, `DELETE /videos/:videoId`, `PATCH /videos/toggle/publish/:videoId` |
| Comments | `GET /comments/:videoId`, `POST /comments/:videoId`, `PATCH /comments/c/:commentId`, `DELETE /comments/c/:commentId` |
| Likes | `POST /likes/toggle/v/:videoId`, `GET /likes/videos` |
| Subscriptions | `POST /subscriptions/c/:channelId`, `GET /subscriptions/c/:channelId`, `GET /subscriptions/u/:subscriberId` |
| Playlists | `POST /playlists`, `GET /playlists/user/:userId`, `GET/PATCH/DELETE /playlists/:playlistId`, `PATCH /playlists/add/:videoId/:playlistId`, `PATCH /playlists/remove/:videoId/:playlistId` |
| Tweets | `POST /tweets`, `GET /tweets/user/:userId`, `PATCH/DELETE /tweets/:tweetId` |
| Dashboard | `GET /dashboard/stats`, `GET /dashboard/videos` |
| Healthcheck | `GET /healthcheck` |

A ready-to-import Postman collection is in `docs/youtubebackend.postman_collection.json`.

## Response Format

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

## Author

 Saiyad Danish Hussain
GitHub: https://github.com/saiyad-danish76