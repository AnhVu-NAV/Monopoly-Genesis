"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { Story, GameState, Choice } from "@/lib/types"
import { loadProgress, saveProgress, resetProgress, applyEffects, pickEnding, resetAllProgress } from "@/lib/story"
import EndScreen from "@/components/end-screen"
import LearnModal from "@/components/learn-modal"
import Toast from "@/components/toast"
import NarrationScreen from "@/components/narration-screen"
import StartupLoading from "@/components/startup-loading"

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const industryId = params.industryId as string

  const [story, setStory] = useState<Story | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false })
  const [learnModal, setLearnModal] = useState<{
    show: boolean;
    lesson?: string;
    effects?: { profit?: number; trust?: number; power?: number };
  }>({ show: false });
  const [showPrologue, setShowPrologue] = useState(false);
  const [booting, setBooting] = useState(false);      
  const playerName = typeof window !== "undefined" ? localStorage.getItem("playerName") : null
  type Effects = { profit?: number; trust?: number; power?: number }
  

  function effectColor(label: "profit" | "trust" | "power", v: number) {
    if (v > 0) return {
      chip: "bg-emerald-500/90 text-white ring-1 ring-emerald-600/50",
      bar: "bg-emerald-400"
    }
    if (v < 0) return {
      chip: "bg-rose-500/90 text-white ring-1 ring-rose-600/50",
      bar: "bg-rose-400"
    }
    return {
      chip: "bg-slate-400/80 text-white ring-1 ring-slate-500/40",
      bar: "bg-slate-300"
    }
  }

  function formatSigned(v: number) {
    if (v > 0) return `+${v}`
    if (v < 0) return `${v}`
    return "±0"
  }

  function summarizeEffects(effects?: Effects) {
    if (!effects) return ""
    const parts: string[] = []
    if (typeof effects.profit === "number") parts.push(`Profit ${formatSigned(effects.profit)}`)
    if (typeof effects.trust === "number") parts.push(`Trust ${formatSigned(effects.trust)}`)
    if (typeof effects.power === "number") parts.push(`Power ${formatSigned(effects.power)}`)
    return parts.join(" • ")
  }

  /** Badge nhỏ hiển thị delta */
  function EffectBadge({
    label,
    value,
  }: {
    label: "profit" | "trust" | "power"
    value?: number
  }) {
    if (typeof value !== "number") return null
    const palette = effectColor(label, value)
    const icon =
      label === "profit" ? "💰" :
        label === "trust" ? "🤝" :
          "🏛️"
    const text =
      label === "profit" ? "Lợi nhuận" :
        label === "trust" ? "Niềm tin" :
          "Quyền lực"
    return (
      <span
        className={[
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
          "backdrop-blur-sm whitespace-nowrap",
          palette.chip,
        ].join(" ")}
        title={`${text} ${formatSigned(value)}`}
      >
        <span className="leading-none">{icon}</span>
        <span className="leading-none">{text}</span>
        <span className="leading-none">{formatSigned(value!)}</span>
      </span>
    )
  }


  useEffect(() => {
    async function initGame() {
      try {
        console.log("[v0] Loading game for industry:", industryId)
        const storyRes = await fetch(`/data/story_${industryId}.json`)

        if (!storyRes.ok) {
          throw new Error(`Failed to load story: ${storyRes.status}`)
        }

        const storyData: Story = await storyRes.json()

        if (!storyData.stages || storyData.stages.length === 0) {
          throw new Error("Invalid story data: no stages found")
        }

        setStory(storyData)

        const seenKey = `prologueSeen:${industryId}`;
        const seen = typeof window !== "undefined" ? localStorage.getItem(seenKey) : "1";
        setShowPrologue(!!storyData.prologue && !seen);

        let state = loadProgress(industryId)
        if (!state) {
          state = {
            industryId,
            currentStageId: storyData.stages[0].id,
            stats: { ...storyData.initial_stats },
            flags: [],
          }
        }
        setGameState(state)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Failed to load game:", error)
        setError(error instanceof Error ? error.message : "Failed to load game")
        setLoading(false)
      }
    }

    initGame()
  }, [industryId])

  const handlePrologueDone = () => {
    const seenKey = `prologueSeen:${industryId}`;
    localStorage.setItem(seenKey, "1");
    // ✅ reset tiến trình của industry hiện tại
    resetProgress(industryId);
    if (story) {
      setGameState({
        industryId,
        currentStageId: story.stages[0].id,
        stats: { ...story.initial_stats },
        flags: [],
        endingId: undefined, // ✅ xoá ending nếu có
      });
    }
    setShowPrologue(false);
    setBooting(true);
  };

  const handlePrologueSkip = () => {
    const seenKey = `prologueSeen:${industryId}`;
    localStorage.setItem(seenKey, "1");
    // ✅ reset như trên
    resetProgress(industryId);
    if (story) {
      setGameState({
        industryId,
        currentStageId: story.stages[0].id,
        stats: { ...story.initial_stats },
        flags: [],
        endingId: undefined,
      });
    }
    setShowPrologue(false);
    setBooting(true);
  };

  const handleChoice = (choice: Choice) => {
    if (!gameState || !story) return

    const effectSummary = summarizeEffects(choice.effects)

    let toastMsg = choice.result_text || ""
    if (effectSummary) {
      toastMsg = toastMsg
        ? `${toastMsg}\n\nHiệu ứng: ${effectSummary}`
        : `Hiệu ứng: ${effectSummary}`
    }
    setToast({ message: toastMsg, show: true })
    setTimeout(() => setToast({ message: "", show: false }), 3500)

    const newStats = applyEffects(gameState.stats, choice.effects)
    const newFlags = [...(gameState.flags || [])]

    if (choice.setFlags) {
      newFlags.push(...choice.setFlags)
    }

    // mở modal sau khi chọn (bài học nếu có + hiệu ứng)
    setLearnModal({
      show: true,
      lesson: typeof choice.learn === "string" ? choice.learn : undefined,
      effects: {
        profit: choice.effects?.profit ?? 0,
        trust: choice.effects?.trust ?? 0,
        power: choice.effects?.power ?? 0,
      },
    });

    let nextStageId: string | undefined

    if (choice.next_if && choice.next_if.length > 0) {
      for (const condition of choice.next_if) {
        const profitMatch =
          (!condition.min_profit || newStats.profit >= condition.min_profit) &&
          (!condition.max_profit || newStats.profit <= condition.max_profit)
        const trustMatch =
          (!condition.min_trust || newStats.trust >= condition.min_trust) &&
          (!condition.max_trust || newStats.trust <= condition.max_trust)
        const powerMatch =
          (!condition.min_power || newStats.power >= condition.min_power) &&
          (!condition.max_power || newStats.power <= condition.max_power)
        const flagsMatch = !condition.requireFlags || condition.requireFlags.every((f) => newFlags.includes(f))

        if (profitMatch && trustMatch && powerMatch && flagsMatch) {
          nextStageId = condition.next
          break
        }
      }

    }

    let newState: GameState

    if (choice.ending) {
      const ending = story.endings.find((e) => e.id === choice.ending)
      newState = {
        ...gameState,
        stats: newStats,
        flags: newFlags,
        endingId: ending?.id,
      }
    } else if (nextStageId) {
      newState = {
        ...gameState,
        stats: newStats,
        flags: newFlags,
        currentStageId: nextStageId,
      }
    } else if (choice.next) {
      newState = {
        ...gameState,
        stats: newStats,
        flags: newFlags,
        currentStageId: choice.next,
      }
    } else {
      const ending = pickEnding(newStats, story.endings, newFlags)
      newState = {
        ...gameState,
        stats: newStats,
        flags: newFlags,
        endingId: ending?.id,
      }
    }

    setGameState(newState)
    saveProgress(industryId, newState)
  }

  const handleReset = () => {
    if (!story) return;
    // xoá cả prologueSeen của industry hiện tại
    resetProgress(industryId);

    const initialState: GameState = {
      industryId,
      currentStageId: story.stages[0].id,
      stats: { ...story.initial_stats },
      flags: [],
    };
    setGameState(initialState);

    // cho hiện lại prologue
    if (story.prologue) setShowPrologue(true);
  };

  const handleHome = () => {
    try { localStorage.removeItem(`progress:${industryId}`) } catch {}
    try { localStorage.removeItem(`prologueSeen:${industryId}`) } catch {}
    setShowPrologue(false);
    setBooting(false);
    resetAllProgress();
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải trò chơi...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={handleHome}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              ← Trang chủ
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <h2 className="text-lg font-bold text-destructive mb-2">Lỗi tải trò chơi</h2>
            <p className="text-foreground/80">{error}</p>
            <button
              onClick={handleHome}
              className="mt-4 px-4 py-2 bg-foreground text-background rounded hover:opacity-90 transition-opacity"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!story || !gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Đang khởi tạo trò chơi...</p>
      </div>
    )
  }

  if (showPrologue && story?.prologue) {
    return (
      <NarrationScreen
        prologue={story.prologue as any}
        onComplete={handlePrologueDone}
        onSkip={handlePrologueSkip}
      />
    );
  }


  const isGameEnd = !!gameState.endingId
  const ending = isGameEnd ? story.endings.find((e) => e.id === gameState.endingId) : null
  const currentStage = story.stages.find((s) => s.id === gameState.currentStageId)

  if (!currentStage && !isGameEnd) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              ← Làm lại
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <h2 className="text-lg font-bold text-destructive mb-2">Lỗi giai đoạn</h2>
            <p className="text-foreground/80">Không tìm thấy giai đoạn: {gameState.currentStageId}</p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-foreground text-background rounded hover:opacity-90 transition-opacity"
            >
              Bắt đầu lại từ đầu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with bokeh effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
      </div>

      <div className="relative z-50 mx-3 sm:mx-4 md:mx-6 mt-2 sm:mt-3 md:mt-4 mb-3 sm:mb-4 md:mb-6">
        <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-lg sm:rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 shadow-lg">
          {/* Left: Player Name Input */}
          <input
            type="text"
            value={playerName || ""}
            readOnly
            placeholder="Tên người chơi"
            className="flex-1 bg-transparent text-foreground placeholder-foreground/50 focus:outline-none text-xs sm:text-sm font-medium"
          />

          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto ml-0 sm:ml-6">
            <button
              onClick={handleHome}
              className="text-foreground/80 hover:text-foreground transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Trang chủ
            </button>
            <div className="w-px h-4 sm:h-5 bg-foreground/20" />
            <Link
              href="/guide"
              className="text-foreground/80 hover:text-foreground transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Hướng dẫn
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {!isGameEnd ? (
          currentStage && (
            <>
              <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {/* Left Column - Stats & Graph */}
                  <div className="col-span-1 space-y-3 sm:space-y-4">
                    {/* Profit Bar Chart */}
                    <div className="bg-white/40 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Lợi Nhuận</p>
                      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 transition-all duration-500"
                          style={{ width: `${gameState.stats.profit}%` }}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-foreground mt-1">{gameState.stats.profit}%</p>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="bg-white/40 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Niềm Tin</p>
                        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 transition-all duration-500"
                            style={{ width: `${gameState.stats.trust}%` }}
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-foreground mt-1">{gameState.stats.trust}%</p>
                      </div>
                      <div className="bg-white/40 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Quyền Lực</p>
                        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 transition-all duration-500"
                            style={{ width: `${gameState.stats.power}%` }}
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-foreground mt-1">{gameState.stats.power}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Story & Choices */}
                  <div className="col-span-1 md:col-span-2 space-y-4 sm:space-y-6">
                    {/* Story Info */}
                    <div className="bg-white/40 backdrop-blur rounded-2xl p-4 sm:p-6">
                      <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                        {currentStage.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">{currentStage.narrative}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      {currentStage.choices.map((choice, idx) => {
                        const hasLearn = Boolean(choice.learn)

                        return (
                          <div key={idx}>
                            <button
                              onClick={() => handleChoice(choice)}
                              className="relative w-full bg-white/40 backdrop-blur border border-white/30 rounded-lg sm:rounded-xl p-3 sm:p-4
                     hover:bg-white/50 transition-all text-left group min-h-20 sm:min-h-24 z-0"
                            >
                              {/* badge nằm TRONG button + z-10 */}
                              {hasLearn && (
                                <span
                                  className="absolute top-2 right-2 z-10 pointer-events-none
                         inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5
                         text-[10px] sm:text-[11px] font-semibold leading-none tracking-tight
                         text-white bg-blue-600/90 ring-1 ring-blue-700/40 shadow-sm
                         backdrop-blur-sm whitespace-nowrap"
                                >
                                  📚 Learn
                                </span>
                              )}

                              <div className="flex items-start justify-between gap-2 sm:gap-3">
                                <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                                  {choice.label}
                                </p>
                              </div>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  onClick={handleReset}
                  className="text-xs sm:text-sm text-foreground/70 hover:text-foreground px-4 sm:px-6 py-2 border border-white/30 rounded-full hover:bg-white/10 transition-all font-medium"
                >
                  Làm lại
                </button>
              </div>
            </>
          )
        ) : ending ? (
          <EndScreen ending={ending} stats={gameState.stats} onPlayAgain={handleReset} />
        ) : null}
      </div>

      {booting && (
        <StartupLoading
          delayMs={5000}
          onDone={() => setBooting(false)}
        />
      )}

      {toast.show && <Toast message={toast.message} />}
      {learnModal.show && (
        <LearnModal
          lesson={learnModal.lesson}
          effects={learnModal.effects}
          onClose={() => setLearnModal({ show: false })}
        />
      )}

    </div>
  )
}
