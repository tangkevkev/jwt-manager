import type { DecodeResult } from '../lib/decode'
import { formatExpiry } from '../lib/decode'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderJson(obj: Record<string, unknown>, highlightExp?: number, prominent = false): string {
  const fontSize = prominent ? 'text-base' : 'text-xs'
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
  return `<pre class="${fontSize} font-mono leading-relaxed whitespace-pre-wrap break-all text-gray-200">${rendered.join('\n')}</pre>`
}

function card(title: string, body: string, badge?: string, prominent = false, copyBtn = false): string {
  const padding = prominent ? 'p-6' : 'p-3'
  const titleColor = prominent ? 'text-gray-300' : 'text-gray-600'
  const accentBorder = prominent ? 'border-l-2 border-blue-500' : ''
  return `
    <div class="rounded-lg border border-gray-800 ${accentBorder} overflow-hidden mb-4">
      <div class="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span class="text-xs font-semibold uppercase tracking-wider ${titleColor}">${title}</span>
        ${badge ? `<span class="text-xs px-2 py-0.5 rounded-full border border-yellow-700 bg-yellow-950 text-yellow-300">${badge}</span>` : ''}
        ${copyBtn ? `<button data-copy-payload class="ml-auto text-xs text-gray-500 hover:text-gray-200 px-2 py-0.5 rounded hover:bg-gray-800 transition-colors">Copy</button>` : ''}
      </div>
      <div class="${padding} bg-gray-950">${body}</div>
    </div>
  `
}

export interface DecodeContainers {
  payload: HTMLElement
  header: HTMLElement
  signature: HTMLElement
}

export function renderDecodeOutput(containers: DecodeContainers, result: DecodeResult): void {
  if (!result.ok) {
    containers.payload.innerHTML = `<div class="rounded-lg border border-red-800 bg-red-950 p-4 text-red-300 text-sm">${escapeHtml(result.error)}</div>`
    containers.header.innerHTML = ''
    containers.signature.innerHTML = ''
    return
  }

  const { header, payload, signature } = result.value
  const exp = typeof payload.exp === 'number' ? payload.exp : undefined

  containers.payload.innerHTML = card('Payload', renderJson(payload, exp, true), undefined, true, true)
  containers.header.innerHTML = card('Header', renderJson(header))

  const copyBtn = containers.payload.querySelector<HTMLButtonElement>('[data-copy-payload]')
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
        copyBtn.textContent = 'Copied!'
        setTimeout(() => { copyBtn.textContent = 'Copy' }, 1500)
      })
    })
  }
  containers.signature.innerHTML = card(
    'Signature',
    `<p class="text-xs font-mono text-gray-400 break-all">${escapeHtml(signature)}</p>`,
    'Not Verified',
  )
}

export function clearDecodeOutput(containers: DecodeContainers): void {
  containers.payload.innerHTML = ''
  containers.header.innerHTML = ''
  containers.signature.innerHTML = ''
}
