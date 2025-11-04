"use client"

import type { Choice } from "@/lib/types"

interface ChoiceListProps {
  choices: Choice[]
  onChoice: (choice: Choice) => void
}

export default function ChoiceList({ choices, onChoice }: ChoiceListProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70 font-semibold mb-4">Hãy lựa chọn của bạn:</p>
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => onChoice(choice)}
          className="w-full text-left p-4 glass-panel hover:bg-white/40 transition-all duration-200 group cursor-pointer"
        >
          <div className="flex justify-between items-start gap-4">
            <p className="font-semibold text-white group-hover:text-white/90 transition-colors">
              {choice.label}
            </p>

            {choice.learn && (
              <span className="text-xs bg-white/20 text-white px-2 py-1 rounded whitespace-nowrap">
                📚 Learn
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
