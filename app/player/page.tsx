"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PlayerPage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")

  const handleStart = () => {
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName)
      router.push("/industry")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background with bokeh effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
      </div>

      <div className="relative glass-panel-light w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-primary text-center mb-8">Đăng ký</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên người chơi"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleStart()}
            className="w-full px-4 py-3 bg-white rounded-lg border border-white/50 placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            autoFocus
          />
          <button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Tham gia
          </button>
        </div>
      </div>
    </main>
  )
}
