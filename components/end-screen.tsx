"use client"

import type { Ending } from "@/lib/types"
import { useEffect } from "react";

interface EndScreenProps {
  ending: Ending
  stats: {
    profit: number
    trust: number
    power: number
  }
  onPlayAgain: () => void
}

export default function EndScreen({ ending, stats, onPlayAgain }: EndScreenProps) {


  useEffect(() => {
    const id = ending?.id;
    if (!id) return;

    // Clarity
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("event", `ending_${id}`);
    }

    // GA4
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "ending_result", {
        ending_id: id,
      });
    }
  }, [ending?.id]);

  const playerName =
    typeof window !== "undefined" ? localStorage.getItem("playerName") : ""

  return (
    <div className="py-12">
      <div className="bg-card border border-border rounded-lg p-12 text-center max-w-2xl mx-auto">

        {/* tên người chơi */}
        {playerName && (
          <p className="text-foreground/70 text-sm mb-3">
            Người chơi: <span className="font-semibold text-foreground">{playerName}</span>
          </p>
        )}

        <div className="text-6xl mb-6">{ending.title.split(" ")[0]}</div>
        <h2 className="text-3xl font-bold mb-6">{ending.title}</h2>
        <p className="text-lg text-foreground/90 mb-8 leading-relaxed">{ending.text}</p>

        {/* Final Stats */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4 text-muted-foreground">Final Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--stat-profit)]">{Math.round(stats.profit)}</div>
              <div className="text-sm text-muted-foreground">💰 Profit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--stat-trust)]">{Math.round(stats.trust)}</div>
              <div className="text-sm text-muted-foreground">🤝 Trust</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--stat-power)]">{Math.round(stats.power)}</div>
              <div className="text-sm text-muted-foreground">🏛️ Power</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Chơi Lại
          </button>

          <a
            href="/industry"
            className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors text-center"
          >
            Chọn Ngành Mới
          </a>
        </div>
      </div>
    </div>
  )
}
