import type { DecodedJwt } from './decode'

export interface HistoryEntry {
  id: string
  raw: string
  label: string
  savedAt: number
  exp?: number
  iat?: number
}

const STORAGE_KEY = 'jwt-manager-history'

function deriveLabel(jwt: DecodedJwt): string {
  const { payload } = jwt
  if (typeof payload.sub === 'string' && payload.sub) return payload.sub
  if (typeof payload.iss === 'string' && payload.iss) return payload.iss
  return jwt.raw.slice(0, 20) + '...'
}

function load(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

function persist(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function getHistory(): HistoryEntry[] {
  return load()
}

export function saveToHistory(jwt: DecodedJwt): HistoryEntry {
  const entries = load()
  const existingIndex = entries.findIndex((e) => e.raw === jwt.raw)
  const entry: HistoryEntry = {
    id: existingIndex >= 0 ? entries[existingIndex].id : crypto.randomUUID(),
    raw: jwt.raw,
    label: deriveLabel(jwt),
    savedAt: Date.now(),
    exp: typeof jwt.payload.exp === 'number' ? jwt.payload.exp : undefined,
    iat: typeof jwt.payload.iat === 'number' ? jwt.payload.iat : undefined,
  }
  if (existingIndex >= 0) {
    entries[existingIndex] = entry
  } else {
    entries.unshift(entry)
  }
  persist(entries)
  return entry
}

export function deleteFromHistory(id: string): void {
  persist(load().filter((e) => e.id !== id))
}
