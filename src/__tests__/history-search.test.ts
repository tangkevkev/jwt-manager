import { describe, it, expect } from 'vitest'
import { searchHistory, extractSnippet } from '../lib/history-search'
import type { HistoryEntry } from '../lib/history-store'

function makeRaw(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  const body = btoa(JSON.stringify(payload)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${header}.${body}.sig`
}

function makeEntry(overrides: Partial<HistoryEntry> & { raw: string }): HistoryEntry {
  return {
    id: crypto.randomUUID(),
    label: 'label',
    savedAt: Date.now(),
    saved: false,
    ...overrides,
  }
}

const entryAdmin = makeEntry({
  raw: makeRaw({ sub: 'user123', role: 'admin' }),
  label: 'Admin Token',
})

const entryUser = makeEntry({
  raw: makeRaw({ sub: 'user456', email: 'test@example.com' }),
  label: 'User Token',
})

const entryNamed = makeEntry({
  raw: makeRaw({ sub: 'svc' }),
  label: 'svc',
  name: 'Prod Service Key',
})

describe('searchHistory', () => {
  it('matches by payload value', () => {
    const results = searchHistory([entryAdmin, entryUser], 'admin')
    expect(results).toHaveLength(1)
    expect(results[0].entry).toBe(entryAdmin)
  })

  it('matches by entry name', () => {
    const results = searchHistory([entryAdmin, entryNamed], 'Prod')
    expect(results).toHaveLength(1)
    expect(results[0].entry).toBe(entryNamed)
  })

  it('matches by label when no name set', () => {
    const results = searchHistory([entryAdmin, entryUser], 'Admin')
    expect(results).toHaveLength(1)
    expect(results[0].entry).toBe(entryAdmin)
  })

  it('is case-insensitive', () => {
    const results = searchHistory([entryAdmin], 'ADMIN')
    expect(results).toHaveLength(1)
  })

  it('returns empty array for no match', () => {
    expect(searchHistory([entryAdmin, entryUser], 'nomatch')).toHaveLength(0)
  })

  it('returns empty array for empty query', () => {
    expect(searchHistory([entryAdmin], '')).toHaveLength(0)
    expect(searchHistory([entryAdmin], '   ')).toHaveLength(0)
  })

  it('returns multiple matches', () => {
    const results = searchHistory([entryAdmin, entryUser], 'user')
    expect(results).toHaveLength(2)
  })
})

describe('extractSnippet', () => {
  it('returns context around the match', () => {
    const text = 'the quick brown fox jumps over the lazy dog'
    const snippet = extractSnippet(text, 'fox')
    expect(snippet).toContain('fox')
  })

  it('handles match near the start of the string', () => {
    const text = 'admin is here at the start'
    const snippet = extractSnippet(text, 'admin')
    expect(snippet).toContain('admin')
    expect(snippet).not.toMatch(/^…/)
  })

  it('handles match near the end of the string', () => {
    const text = 'the value is at the end: admin'
    const snippet = extractSnippet(text, 'admin')
    expect(snippet).toContain('admin')
    expect(snippet).not.toMatch(/…$/)
  })

  it('returns empty string for no match', () => {
    expect(extractSnippet('some text', 'nomatch')).toBe('')
  })

  it('adds ellipsis when context is truncated', () => {
    const text = 'a'.repeat(40) + 'match' + 'b'.repeat(40)
    const snippet = extractSnippet(text, 'match')
    expect(snippet).toMatch(/^…/)
    expect(snippet).toMatch(/…$/)
  })
})
