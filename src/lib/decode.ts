export interface JwtHeader {
  alg?: string
  typ?: string
  [key: string]: unknown
}

export interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: unknown
}

export interface DecodedJwt {
  raw: string
  header: JwtHeader
  payload: JwtPayload
  signature: string
}

export type DecodeResult =
  | { ok: true; value: DecodedJwt }
  | { ok: false; error: string }

function base64urlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '==='.slice(0, (4 - (base64.length % 4)) % 4)
  return atob(padded)
}

export function decodeJwt(token: string): DecodeResult {
  const trimmed = token.trim()
  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return { ok: false, error: 'Invalid JWT: expected 3 segments separated by dots.' }
  }
  const [headerB64, payloadB64, signature] = parts
  try {
    const header = JSON.parse(base64urlDecode(headerB64)) as JwtHeader
    const payload = JSON.parse(base64urlDecode(payloadB64)) as JwtPayload
    return { ok: true, value: { raw: trimmed, header, payload, signature } }
  } catch {
    return { ok: false, error: 'Invalid JWT: could not decode token segments.' }
  }
}

export function formatExpiry(exp: number): string {
  const date = new Date(exp * 1000)
  const expired = date.getTime() < Date.now()
  return `${date.toLocaleString()} (${expired ? 'expired' : 'valid'})`
}
