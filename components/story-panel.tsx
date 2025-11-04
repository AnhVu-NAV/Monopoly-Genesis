import type { Stage } from "@/lib/types"

interface StoryPanelProps {
  stage: Stage
}

export default function StoryPanel({ stage }: StoryPanelProps) {
  return (
    <div className="glass-panel p-8 mb-8">
      <h2 className="text-3xl font-bold mb-4 text-white">{stage.title}</h2>
      <p className="text-lg leading-relaxed text-white/90">{stage.narrative}</p>
    </div>
  )
}
