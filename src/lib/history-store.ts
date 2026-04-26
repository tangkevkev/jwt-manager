import type { DecodedJwt } from './decode'

export interface HistoryEntry {
  id: string
  raw: string
  label: string
  savedAt: number
  addedAt: number
  exp?: number
  iat?: number
  saved: boolean
  name?: string
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
    if (!stored) return []
    const parsed = JSON.parse(stored) as HistoryEntry[]
    return parsed.map((e) => ({ ...e, saved: e.saved ?? false, addedAt: e.addedAt ?? e.savedAt }))
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
  const existing = existingIndex >= 0 ? entries[existingIndex] : undefined
  const now = Date.now()
  const entry: HistoryEntry = {
    id: existing ? existing.id : crypto.randomUUID(),
    raw: jwt.raw,
    label: deriveLabel(jwt),
    savedAt: now,
    addedAt: existing ? existing.addedAt : now,
    exp: typeof jwt.payload.exp === 'number' ? jwt.payload.exp : undefined,
    iat: typeof jwt.payload.iat === 'number' ? jwt.payload.iat : undefined,
    saved: existing ? existing.saved : false,
    name: existing ? existing.name : undefined,
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


export function saveEntry(id: string): void {
  const entries = load()
  const index = entries.findIndex((e) => e.id === id)
  if (index < 0) return
  entries[index] = { ...entries[index], saved: true }
  persist(entries)
}

export function renameEntry(id: string, name: string): void {
  if (!name.trim()) return
  const entries = load()
  const index = entries.findIndex((e) => e.id === id)
  if (index < 0) return
  entries[index] = { ...entries[index], name: name.trim() }
  persist(entries)
}
