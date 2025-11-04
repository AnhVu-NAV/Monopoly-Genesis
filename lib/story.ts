import type { Effects, Ending, GameState } from "./types"

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n))
}

export function applyEffects(
  stats: { profit: number; trust: number; power: number },
  effects: Effects,
): { profit: number; trust: number; power: number } {
  return {
    profit: clamp(stats.profit + (effects.profit || 0)),
    trust: clamp(stats.trust + (effects.trust || 0)),
    power: clamp(stats.power + (effects.power || 0)),
  }
}

export function pickEnding(
  stats: { profit: number; trust: number; power: number },
  endings: Ending[],
  flags: string[] = [],
): Ending | null {
  for (const ending of endings) {
    if (!ending.conditions) return ending

    const cond = ending.conditions
    const matchesProfit =
      (!cond.min_profit || stats.profit >= cond.min_profit) && (!cond.max_profit || stats.profit <= cond.max_profit)
    const matchesTrust =
      (!cond.min_trust || stats.trust >= cond.min_trust) && (!cond.max_trust || stats.trust <= cond.max_trust)
    const matchesPower =
      (!cond.min_power || stats.power >= cond.min_power) && (!cond.max_power || stats.power <= cond.max_power)
    const matchesFlags = !cond.requireFlags || cond.requireFlags.every((f) => flags.includes(f))

    if (matchesProfit && matchesTrust && matchesPower && matchesFlags) {
      return ending
    }
  }

  return endings[endings.length - 1] || null
}

export function loadProgress(industryId: string): GameState | null {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem(`monopolyInc:${industryId}`)
  return saved ? JSON.parse(saved) : null
}

export function saveProgress(industryId: string, state: GameState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`monopolyInc:${industryId}`, JSON.stringify(state))
}

export function getNextStage(stageId: string, stats: any, flags: string[], stages: any[]) {
  // Logic to determine next stage based on conditions
  return stageId
}

const PROGRESS_PREFIX = "progress:";
const PROLOGUE_PREFIX = "prologueSeen:";

/** Xoá progress & prologueSeen của 1 industry */
export function resetProgress(industryId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${PROGRESS_PREFIX}${industryId}`);
  localStorage.removeItem(`${PROLOGUE_PREFIX}${industryId}`);
}

/** Xoá progress & prologueSeen của TẤT CẢ industry */
export function resetAllProgress() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith(PROGRESS_PREFIX) || k.startsWith(PROLOGUE_PREFIX)) {
      keys.push(k);
    }
  }
  keys.forEach((k) => localStorage.removeItem(k));
}