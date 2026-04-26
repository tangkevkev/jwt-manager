import { describe, it, expect } from 'vitest'
import { decodeJwt, formatExpiry } from '../lib/decode'

const VALID_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJwt', () => {
  it('decodes a valid JWT', () => {
    const result = decodeJwt(VALID_JWT)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(result.value.payload).toMatchObject({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
    expect(result.value.signature).toBeTruthy()
  })

  it('trims whitespace from input', () => {
    const result = decodeJwt('  ' + VALID_JWT + '  \n')
    expect(result.ok).toBe(true)
  })

  it('returns error for fewer than 3 segments', () => {
    const result = decodeJwt('abc.def')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/3 segments/)
  })

  it('returns error for more than 3 segments', () => {
    const result = decodeJwt('a.b.c.d')
    expect(result.ok).toBe(false)
  })

  it('returns error for non-JSON payload', () => {
    // bm90anNvbg = base64url("notjson")
    const result = decodeJwt('eyJhbGciOiJIUzI1NiJ9.bm90anNvbg.sig')
    expect(result.ok).toBe(false)
  })

  it('returns error for empty string', () => {
    const result = decodeJwt('')
    expect(result.ok).toBe(false)
  })

  it('returns error for whitespace-only string', () => {
    const result = decodeJwt('   ')
    expect(result.ok).toBe(false)
  })
})

describe('formatExpiry', () => {
  it('marks a past timestamp as expired', () => {
    const past = Math.floor(Date.now() / 1000) - 3600
    expect(formatExpiry(past)).toContain('expired')
  })

  it('marks a future timestamp as valid', () => {
    const future = Math.floor(Date.now() / 1000) + 3600
    expect(formatExpiry(future)).toContain('valid')
  })
})
