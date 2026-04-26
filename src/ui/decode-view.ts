import type { DecodeResult } from '../lib/decode'
import { formatExpiry } from '../lib/decode'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderJson(obj: Record<string, unknown>, highlightExp?: number): string {
  const lines = JSON.stringify(obj, null, 2).split('\n')
  const rendered = lines.map((line) => {
    if (highlightExp !== undefined && line.includes('"exp"')) {
      return (
        `<span class="text-yellow-300">${escapeHtml(line)}</span>` +
        ` <span class="text-gray-500 text-xs">// ${formatExpiry(highlightExp)}</span>`
      )
    }
    return escapeHtml(line)
  })
  return `<pre class="text-sm font-mono leading-relaxed whitespace-pre-wrap break-all text-gray-200">${rendered.join('\n')}</pre>`
}

function card(title: string, body: string, badge?: string): string {
  return `
    <div class="rounded-lg border border-gray-800 overflow-hidden mb-4">
      <div class="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">${title}</span>
        ${badge ? `<span class="text-xs px-2 py-0.5 rounded-full border border-yellow-700 bg-yellow-950 text-yellow-300">${badge}</span>` : ''}
      </div>
      <div class="p-4 bg-gray-950">${body}</div>
    </div>
  `
}

export function renderDecodeOutput(container: HTMLElement, result: DecodeResult): void {
  if (!result.ok) {
    container.innerHTML = `<div class="rounded-lg border border-red-800 bg-red-950 p-4 text-red-300 text-sm">${escapeHtml(result.error)}</div>`
    return
  }

  const { header, payload, signature } = result.value
  const exp = typeof payload.exp === 'number' ? payload.exp : undefined

  container.innerHTML =
    card('Header', renderJson(header)) +
    card('Payload', renderJson(payload, exp)) +
    card(
      'Signature',
      `<p class="text-sm font-mono text-gray-400 break-all">${escapeHtml(signature)}</p>`,
      'Not Verified',
    )
}
