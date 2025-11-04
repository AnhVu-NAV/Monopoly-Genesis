"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { IndustriesIndex } from "@/lib/types"
import Image from "next/image"

export default function IndustryPage() {
  const router = useRouter()
  const [industries, setIndustries] = useState<IndustriesIndex["industries"]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("playerName")
    if (!stored) {
      router.push("/player")
      return
    }

    async function loadIndustries() {
      const res = await fetch("/data/industries.json")
      const data: IndustriesIndex = await res.json()
      setIndustries(data.industries)
      setLoading(false)
    }
    loadIndustries()
  }, [router])

  // : AUTO SCALE CENTER
  useEffect(() => {
    const container = document.getElementById("snap-row")
    if (!container) return

    function detect() {
      const cards = Array.from(container.children) as HTMLElement[]
      const midX = window.innerWidth / 2

      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const cardMid = rect.left + rect.width / 2
        const distance = Math.abs(cardMid - midX)

        // càng gần trung tâm -> scale càng lớn
        const scale = 1.05 + Math.max(0, 0.10 - distance / 300)
        card.style.transform = `scale(${scale})`
      })
    }

    detect()
    container.addEventListener("scroll", detect, { passive: true })
    window.addEventListener("resize", detect)
    return () => {
      container.removeEventListener("scroll", detect)
      window.removeEventListener("resize", detect)
    }
  }, [industries])

  const handleSelect = (industryId: string) => {
    router.push(`/play/${industryId}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 md:px-12 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
      </div>

      <div className="relative w-full max-w-[1520px]">
        <h2 className="text-center font-black text-[42px] md:text-[64px] text-white drop-shadow-md mb-16">
          Chọn Chiến Lược
        </h2>

        {loading ? (
          <p className="text-center text-white/80">Đang tải chiến lược...</p>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden md:flex items-end justify-center gap-12">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => handleSelect(industry.id)}
                  className="relative transition-all duration-200 cursor-pointer flex-shrink-0 hover:scale-[1.12] hover:opacity-100 opacity-85"
                >
                  <div
                    className="w-[180px] h-[360px] md:w-[220px] md:h-[460px]
                    bg-gradient-to-b from-white/70 to-white/10
                    border border-white/40 backdrop-blur-xl rounded-2xl shadow-xl"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3">
                    <Image
                      src={industry.picture}
                      alt={industry.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                    <p className="text-white font-bold text-lg text-center leading-tight">
                      {industry.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* MOBILE: scroll-snap */}
            <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-8">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => handleSelect(industry.id)}
                  className="relative snap-center shrink-0 w-[75vw] max-w-[280px] h-[420px] cursor-pointer
                             transition-all duration-300 hover:scale-[1.12]"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/10
                    border border-white/40 backdrop-blur-xl rounded-2xl shadow-xl"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-3">
                    <Image
                      src={industry.picture}
                      alt={industry.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                    <p className="text-white font-bold text-lg text-center leading-tight">
                      {industry.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => router.push("/player")}
          className="block text-center mx-auto mt-12 text-white/70 hover:text-white font-medium underline text-sm"
        >
          ← Đổi tên người chơi
        </button>
      </div>
    </main>
  )
}
