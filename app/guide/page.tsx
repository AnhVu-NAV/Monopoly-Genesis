"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GuidePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background with bokeh effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
      </div>

      <div className="relative w-full max-w-2xl glass-panel-light p-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-6">Hướng dẫn</h1>
        <p className="text-lg text-foreground/90 leading-relaxed mb-4">
          Storytelling Web Game về "chủ nghĩa tư bản độc quyền" theo Lênin
        </p>
        <p className="text-foreground/70 mb-8">
          Lựa chọn một ngành công nghiệp và đi theo con đường phát triển công ty của bạn. Mỗi lựa chọn sẽ ảnh hưởng đến
          ba chỉ số: Lợi nhuận, Niềm tin, và Quyền lực. Cuộc chơi kết thúc khi bạn đạt đến một trong các kết thúc khác
          nhau dựa trên chiến lược của bạn.
        </p>

        <button
          onClick={() => router.back()}
          className="inline-block px-8 py-3 bg-white rounded-full font-semibold text-primary hover:opacity-90 transition-all"
        >
          ← Quay lại
        </button>
      </div>
    </main>
  )
}
