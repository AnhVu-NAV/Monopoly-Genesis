export type Effects = {
  profit?: number
  trust?: number
  power?: number
}

export type Choice = {
  id: string
  label: string
  result_text: string
  effects: Effects
  next?: string | null
  ending?: string | null
  tag?: string | null
  learn?: string | null
  emotion?: "hope" | "greed" | "fear" | "despair" | "ambition"
  setFlags?: string[]
  requireFlags?: string[]
  next_if?: Array<{
    min_profit?: number
    max_profit?: number
    min_trust?: number
    max_trust?: number
    min_power?: number
    max_power?: number
    requireFlags?: string[]
    next: string
  }>
}

export type Stage = {
  id: string
  title: string
  narrative: string
  choices: Choice[]
  image_prompt?: string
  mood?: "triumph" | "temptation" | "crisis" | "collapse" | "growth" | "corruption"
  requireFlags?: string[]
}

export type Ending = {
  id: string
  title: string
  text: string
  conditions?: {
    min_profit?: number
    min_trust?: number
    min_power?: number
    max_profit?: number
    max_trust?: number
    max_power?: number
    requireFlags?: string[]
  }
  image_prompt?: string
}

export type Story = {
  schema_version: string
  industry_id: string
  name: string
  intro: string
  prologue?: {
    title?: string
    voice?: { lang?: string; name?: string; rate?: number; pitch?: number; volume?: number }
    paragraphs: string[]
    audio?: string[]
  }
  initial_stats: { profit: number; trust: number; power: number }
  stages: Stage[]
  endings: Ending[]
}

export type IndustriesIndex = {
  industries: {
    id: string
    name: string
    intro: string
    picture: string
    storyPath: string
  }[]
}

export type GameState = {
  industryId: string
  currentStageId: string
  stats: {
    profit: number
    trust: number
    power: number
  }
  flags?: string[]
  endingId?: string
}


