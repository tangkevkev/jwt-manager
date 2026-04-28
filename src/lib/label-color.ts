import type { HistoryEntry } from './history-store'

export interface LabelColor {
  bg: string
  text: string
}

const PALETTE: LabelColor[] = [
  { bg: 'bg-blue-900', text: 'text-blue-200' },
  { bg: 'bg-emerald-900', text: 'text-emerald-200' },
  { bg: 'bg-purple-900', text: 'text-purple-200' },
  { bg: 'bg-amber-900', text: 'text-amber-200' },
  { bg: 'bg-rose-900', text: 'text-rose-200' },
  { bg: 'bg-orange-900', text: 'text-orange-200' },
  { bg: 'bg-teal-900', text: 'text-teal-200' },
  { bg: 'bg-pink-900', text: 'text-pink-200' },
  { bg: 'bg-indigo-900', text: 'text-indigo-200' },
  { bg: 'bg-cyan-900', text: 'text-cyan-200' },
]

function hashLabel(label: string): number {
  let h = 0
  for (let i = 0; i < label.length; i++) {
    h = (h * 31 + label.charCodeAt(i)) >>> 0
  }
  return h
}

export function getLabelColor(label: string): LabelColor {
  return PALETTE[hashLabel(label) % PALETTE.length]
}

export function getUsedLabels(entries: HistoryEntry[]): string[] {
  const freq = new Map<string, number>()
  for (const entry of entries) {
    for (const lbl of entry.labels) {
      freq.set(lbl, (freq.get(lbl) ?? 0) + 1)
    }
  }
  return [...freq.keys()].sort((a, b) => {
    const diff = (freq.get(b) ?? 0) - (freq.get(a) ?? 0)
    return diff !== 0 ? diff : a.localeCompare(b)
  })
}
