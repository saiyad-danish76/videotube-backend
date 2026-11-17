import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Watch from "./pages/Watch"
import Upload from "./pages/Upload"
import Channel from "./pages/Channel"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/watch/:videoId" element={<Watch />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/c/:username" element={<Channel />} />
      </Route>
    </Routes>
  )
}