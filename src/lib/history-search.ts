import type { HistoryEntry } from './history-store'
import { decodeJwt } from './decode'

export interface SearchResult {
  entry: HistoryEntry
  snippet: string
}

const SNIPPET_RADIUS = 30

export function extractSnippet(payloadText: string, query: string): string {
  const index = payloadText.toLowerCase().indexOf(query.toLowerCase())
  if (index < 0) return ''
  const start = Math.max(0, index - SNIPPET_RADIUS)
  const end = Math.min(payloadText.length, index + query.length + SNIPPET_RADIUS)
  const snippet = payloadText.slice(start, end)
  return (start > 0 ? '…' : '') + snippet + (end < payloadText.length ? '…' : '')
}

export function searchHistory(entries: HistoryEntry[], query: string): SearchResult[] {
  if (!query.trim()) return []
  const lower = query.toLowerCase()
  const results: SearchResult[] = []

  for (const entry of entries) {
    const nameMatch = (entry.name ?? entry.label).toLowerCase().includes(lower)
    const labelMatch = entry.labels.some((l) => l.toLowerCase().includes(lower))
    const decoded = decodeJwt(entry.raw)
    const payloadText = decoded.ok ? JSON.stringify(decoded.value.payload, null, 2) : ''
    const payloadMatch = payloadText.toLowerCase().includes(lower)

    if (nameMatch || labelMatch || payloadMatch) {
      results.push({
        entry,
        snippet: payloadMatch ? extractSnippet(payloadText, query) : '',
      })
    }
  }

  return results
}
