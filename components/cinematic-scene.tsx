"use client"

import { useEffect, useRef, useState } from "react"

interface CinematicSceneProps {
  mood: "triumph" | "temptation" | "crisis" | "collapse" | "growth" | "corruption"
  emotion: "hope" | "greed" | "fear" | "despair" | "ambition"
  imageUrl?: string
}

export default function CinematicScene({ mood, emotion, imageUrl }: CinematicSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [offset, setOffset] = useState(0)

  // Color palettes based on mood
  const moodColors = {
    triumph: { primary: "#FFD700", secondary: "#FFA500", overlay: "rgba(255,215,0,0.1)" },
    temptation: { primary: "#DC143C", secondary: "#8B0000", overlay: "rgba(220,20,60,0.15)" },
    crisis: { primary: "#4B0082", secondary: "#FF6347", overlay: "rgba(75,0,130,0.15)" },
    collapse: { primary: "#2F4F4F", secondary: "#696969", overlay: "rgba(47,79,79,0.2)" },
    growth: { primary: "#32CD32", secondary: "#228B22", overlay: "rgba(50,205,50,0.1)" },
    corruption: { primary: "#FF4500", secondary: "#8B4513", overlay: "rgba(255,69,0,0.15)" },
  }

  const emotionIntensity = {
    hope: 0.8,
    greed: 0.9,
    fear: 0.7,
    despair: 0.6,
    ambition: 0.85,
  }

  // Parallax animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.3) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Draw cinematic effects on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colors = moodColors[mood]
    const intensity = emotionIntensity[emotion]

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw radial gradient based on mood
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height),
    )

    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(0.5, colors.secondary)
    gradient.addColorStop(1, "#000")

    ctx.globalAlpha = intensity * 0.3
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw parallax layers
    ctx.globalAlpha = 0.15
    ctx.fillStyle = colors.primary
    for (let i = 0; i < 3; i++) {
      const yPos = ((offset + i * 30) % 100) * (canvas.height / 100)
      ctx.fillRect(0, yPos, canvas.width, canvas.height * 0.15)
    }

    // Draw lighting effects
    ctx.globalAlpha = 0.4
    ctx.fillStyle = colors.primary
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width * 0.3, canvas.height * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()

    // Reset alpha
    ctx.globalAlpha = 1
  }, [offset, mood, emotion])

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden bg-black">
      <canvas ref={canvasRef} width={800} height={400} className="absolute inset-0 w-full h-full" />

      {imageUrl && (
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Scene"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          crossOrigin="anonymous"
        />
      )}

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

      {/* Emotion indicator */}
      <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded text-xs text-white backdrop-blur">
        Cảm xúc: <span className="font-bold capitalize">{emotion}</span>
      </div>
    </div>
  )
}
