import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveToHistory, getHistory, deleteFromHistory, saveEntry, renameEntry } from '../lib/history-store'
import type { DecodedJwt } from '../lib/decode'

const store: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
})

const jwt1: DecodedJwt = {
  raw: 'header.payload.sig',
  header: { alg: 'HS256', typ: 'JWT' },
  payload: { sub: 'user123', iss: 'my-app', iat: 1000000, exp: 9999999999 },
  signature: 'sig',
}

const jwt2: DecodedJwt = {
  raw: 'header2.payload2.sig2',
  header: { alg: 'HS256', typ: 'JWT' },
  payload: { sub: 'user456' },
  signature: 'sig2',
}

describe('historyStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no history', () => {
    expect(getHistory()).toEqual([])
  })

  it('saves a JWT and retrieves it', () => {
    saveToHistory(jwt1)
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].raw).toBe(jwt1.raw)
  })

  it('uses sub claim as label', () => {
    saveToHistory(jwt1)
    expect(getHistory()[0].label).toBe('user123')
  })

  it('falls back to iss if no sub', () => {
    const noSub: DecodedJwt = { ...jwt1, payload: { iss: 'my-app' } }
    saveToHistory(noSub)
    expect(getHistory()[0].label).toBe('my-app')
  })

  it('truncates token as label if no sub or iss', () => {
    const noLabel: DecodedJwt = { ...jwt1, payload: {} }
    saveToHistory(noLabel)
    expect(getHistory()[0].label).toMatch(/\.\.\.$/)
  })

  it('deduplicates on same raw token and updates timestamp', async () => {
    saveToHistory(jwt1)
    const firstSavedAt = getHistory()[0].savedAt

    await new Promise<void>((r) => setTimeout(r, 10))

    saveToHistory(jwt1)
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].savedAt).toBeGreaterThanOrEqual(firstSavedAt)
  })

  it('stores exp and iat from payload', () => {
    saveToHistory(jwt1)
    const entry = getHistory()[0]
    expect(entry.exp).toBe(9999999999)
    expect(entry.iat).toBe(1000000)
  })

  it('stores undefined for missing exp/iat', () => {
    saveToHistory(jwt2)
    const entry = getHistory()[0]
    expect(entry.exp).toBeUndefined()
    expect(entry.iat).toBeUndefined()
  })

  it('prepends newer entries to history', () => {
    saveToHistory(jwt1)
    saveToHistory(jwt2)
    expect(getHistory()[0].raw).toBe(jwt2.raw)
  })

  it('deletes an entry by id', () => {
    saveToHistory(jwt1)
    saveToHistory(jwt2)
    const id = getHistory()[0].id
    deleteFromHistory(id)
    expect(getHistory()).toHaveLength(1)
  })

  it('persists across reads (simulates reload)', () => {
    saveToHistory(jwt1)
    expect(getHistory()).toHaveLength(1)
    expect(getHistory()[0].raw).toBe(jwt1.raw)
  })

  it('new entries default to saved: false', () => {
    saveToHistory(jwt1)
    expect(getHistory()[0].saved).toBe(false)
  })

  it('treats missing saved field as false (backward compat)', () => {
    const legacy = [{ id: '1', raw: 'a.b.c', label: 'test', savedAt: Date.now() }]
    store['jwt-manager-history'] = JSON.stringify(legacy)
    expect(getHistory()[0].saved).toBe(false)
  })


  describe('saveEntry', () => {
    it('promotes entry to saved', () => {
      saveToHistory(jwt1)
      const id = getHistory()[0].id
      saveEntry(id)
      expect(getHistory()[0].saved).toBe(true)
    })

    it('is a no-op for unknown id', () => {
      saveToHistory(jwt1)
      saveEntry('unknown-id')
      expect(getHistory()).toHaveLength(1)
    })
  })

  describe('renameEntry', () => {
    it('updates the name of an entry', () => {
      saveToHistory(jwt1)
      const id = getHistory()[0].id
      renameEntry(id, 'My Token')
      expect(getHistory()[0].name).toBe('My Token')
    })

    it('ignores empty name', () => {
      saveToHistory(jwt1)
      const id = getHistory()[0].id
      renameEntry(id, 'My Token')
      renameEntry(id, '   ')
      expect(getHistory()[0].name).toBe('My Token')
    })

    it('is a no-op for unknown id', () => {
      saveToHistory(jwt1)
      renameEntry('unknown-id', 'Test')
      expect(getHistory()[0].name).toBeUndefined()
    })
  })
})
