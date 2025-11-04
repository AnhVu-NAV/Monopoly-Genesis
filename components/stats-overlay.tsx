"use client"

interface StatsOverlayProps {
  profit: number
  trust: number
  power: number
}

export default function StatsOverlay({ profit, trust, power }: StatsOverlayProps) {
  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex-1">
      <div className="text-xs font-semibold mb-2 text-white">{label}</div>
      <div className="bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="glass-panel p-6">
      <div className="grid grid-cols-3 gap-6">
        <StatBar label="💰 Lợi Nhuận" value={profit} color="bg-yellow-400" />
        <StatBar label="🤝 Niềm Tin" value={trust} color="bg-blue-400" />
        <StatBar label="🏛️ Quyền Lực" value={power} color="bg-red-400" />
      </div>
    </div>
  )
}
