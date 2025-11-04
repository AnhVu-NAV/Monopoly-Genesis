"use client";
import Image from "next/image";
import * as React from "react";

export default function StartupLoading({
  onDone,
  delayMs = 5000,
}: { onDone?: () => void; delayMs?: number }) {
  // chạy đếm 5s rồi gọi onDone
  React.useEffect(() => {
    const t = setTimeout(() => onDone?.(), delayMs);
    return () => clearTimeout(t);
  }, [delayMs, onDone]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-white">
        {/* logo / icon nếu có */}
        {/* <Image src="/logo.svg" alt="Monopoly Genesis" width={64} height={64} /> */}

        <div className="text-lg font-semibold">Đang khởi động trò chơi…</div>
        <div className="text-xs text-white/70">Chuẩn bị mô phỏng nền kinh tế</div>

        {/* spinner đơn giản */}
        <div className="mt-2 h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />

        {/* progress bar giả lập */}
        <div className="mt-3 w-64 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-emerald-400 animate-[loadingGrow_5s_linear_forwards]" />
        </div>

        <style jsx>{`
          @keyframes loadingGrow {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
