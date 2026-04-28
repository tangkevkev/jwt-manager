import type { DecodeResult } from '../lib/decode'
import { formatExpiry } from '../lib/decode'
import type { HistoryEntry } from '../lib/history-store'
import { getLabelColor, getUsedLabels } from '../lib/label-color'

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

export function renderLabelEditor(
  container: HTMLElement,
  entry: HistoryEntry,
  allEntries: HistoryEntry[],
  onUpdate: (id: string, labels: string[]) => void,
): void {
  const usedLabels = getUsedLabels(allEntries)

  function render(currentLabels: string[]): void {
    const chips = currentLabels
      .map((lbl) => {
        const { bg, text } = getLabelColor(lbl)
        return `<span class="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${bg} ${text}">
          ${escapeHtml(lbl)}
          <button data-remove-label="${escapeHtml(lbl)}" class="hover:opacity-70 leading-none" aria-label="Remove label ${escapeHtml(lbl)}">×</button>
        </span>`
      })
      .join('')

    container.innerHTML = `
      <div class="rounded-lg border border-gray-800 mb-4">
        <div class="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-600">Labels</span>
        </div>
        <div class="px-4 py-3 bg-gray-950">
          <div class="flex flex-wrap gap-1.5 mb-2 min-h-[1.5rem]">${chips}</div>
          <div class="relative">
            <input
              id="label-input"
              type="text"
              placeholder="Add label…"
              autocomplete="off"
              class="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
            <ul
              id="label-suggestions"
              class="hidden absolute z-10 left-0 right-0 mt-0.5 bg-gray-900 border border-gray-700 rounded shadow-lg max-h-40 overflow-y-auto"
            ></ul>
          </div>
        </div>
      </div>
    `

    const input = container.querySelector<HTMLInputElement>('#label-input')!
    const suggestionsList = container.querySelector<HTMLUListElement>('#label-suggestions')!

    function addLabel(val: string): void {
      const trimmed = val.trim().replace(/,$/, '').trim()
      if (!trimmed || currentLabels.includes(trimmed)) {
        input.value = ''
        hideSuggestions()
        return
      }
      const next = [...currentLabels, trimmed]
      onUpdate(entry.id, next)
      render(next)
    }

    function showSuggestions(query: string): void {
      const filtered = usedLabels.filter(
        (l) => l.toLowerCase().includes(query.toLowerCase()) && !currentLabels.includes(l),
      )
      if (!filtered.length) {
        hideSuggestions()
        return
      }
      suggestionsList.innerHTML = filtered
        .map(
          (lbl) =>
            `<li data-suggestion="${escapeHtml(lbl)}" class="px-3 py-1.5 text-xs text-gray-200 cursor-pointer hover:bg-gray-800">${escapeHtml(lbl)}</li>`,
        )
        .join('')
      suggestionsList.classList.remove('hidden')
    }

    function hideSuggestions(): void {
      suggestionsList.classList.add('hidden')
    }

    input.addEventListener('focus', () => showSuggestions(input.value))
    input.addEventListener('input', () => showSuggestions(input.value))
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addLabel(input.value)
      } else if (e.key === 'Escape') {
        hideSuggestions()
      }
    })
    input.addEventListener('blur', () => {
      setTimeout(hideSuggestions, 150)
    })

    suggestionsList.addEventListener('mousedown', (e) => {
      const li = (e.target as HTMLElement).closest<HTMLElement>('[data-suggestion]')
      if (li) {
        e.preventDefault()
        addLabel(li.dataset.suggestion!)
      }
    })

    container.querySelectorAll<HTMLElement>('[data-remove-label]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const lbl = btn.dataset.removeLabel!
        const next = currentLabels.filter((l) => l !== lbl)
        onUpdate(entry.id, next)
        render(next)
      })
    })
  }

  render(entry.labels)
}

export function clearLabelEditor(container: HTMLElement): void {
  container.innerHTML = ''
}

export function clearDecodeOutput(containers: DecodeContainers): void {
  containers.payload.innerHTML = ''
  containers.header.innerHTML = ''
  containers.signature.innerHTML = ''
}
