export type Prize = { position: string; amount: string; name: string }
export type DrawSnapshot = {
  campaignId: string
  campaignName: string
  drawDate: string
  eligibleEntries: number
  populationHash: string
}
export type WinnerResult = { prize: Prize; entryId: string; selectedAt: string }

export type DrawState = {
  snapshot: DrawSnapshot
  prizes: Prize[]
  winners: WinnerResult[]
  isStarted: boolean
}

const snapshot: DrawSnapshot = {
  campaignId: "LL-2026-W01",
  campaignName: "Lisiti Langa",
  drawDate: "01 September 2026 · 14:00 CAT",
  eligibleEntries: 28450,
  populationHash: "7F1D2A40...B19E",
}

const prizes: Prize[] = [
  { position: "1st", amount: "MWK 500,000", name: "Grand prize" },
  { position: "2nd", amount: "MWK 250,000", name: "Second prize" },
  { position: "3rd", amount: "MWK 100,000", name: "Third prize" },
]

const entries = [
  "LL-2026-000123",
  "LL-2026-000784",
  "LL-2026-001245",
  "LL-2026-000347",
  "LL-2026-000891",
  "LL-2026-001006",
  "LL-2026-000562",
  "LL-2026-001112",
]

// Module-level in-memory draw state (mirrors the original singleton DrawService).
type Store = { winners: WinnerResult[]; isStarted: boolean }
const globalStore = globalThis as unknown as { __mraDraw?: Store }
const store: Store = (globalStore.__mraDraw ??= { winners: [], isStarted: false })

export function getState(): DrawState {
  return { snapshot, prizes, winners: store.winners, isStarted: store.isStarted }
}

export function startDraw(): void {
  store.winners = []
  store.isStarted = true
}

export function selectWinner(position: string): WinnerResult {
  const prize = prizes.find((p) => p.position === position)
  if (!prize) throw new Error(`Unknown prize position: ${position}`)
  const result: WinnerResult = {
    prize,
    entryId: entries[store.winners.length % entries.length],
    selectedAt: new Date().toISOString(),
  }
  store.winners = [...store.winners, result]
  store.isStarted = true
  return result
}
