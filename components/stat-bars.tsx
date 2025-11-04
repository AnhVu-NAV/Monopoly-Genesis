interface StatBarsProps {
  stats: {
    profit: number
    trust: number
    power: number
  }
}

export default function StatBars({ stats }: StatBarsProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-sm">💰 Profit</label>
            <span className="text-sm font-mono">{Math.round(stats.profit)}</span>
          </div>
          <div className="stat-bar">
            <div className="stat-bar-profit h-full transition-all duration-300" style={{ width: `${stats.profit}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-sm">🤝 Trust</label>
            <span className="text-sm font-mono">{Math.round(stats.trust)}</span>
          </div>
          <div className="stat-bar">
            <div className="stat-bar-trust h-full transition-all duration-300" style={{ width: `${stats.trust}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-sm">🏛️ Power</label>
            <span className="text-sm font-mono">{Math.round(stats.power)}</span>
          </div>
          <div className="stat-bar">
            <div className="stat-bar-power h-full transition-all duration-300" style={{ width: `${stats.power}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
