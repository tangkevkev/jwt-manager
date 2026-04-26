import type { SearchResult } from '../lib/history-search'

function formatDate(ts: number): string {
  const d = new Date(ts)
  const datePart = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const timePart = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${datePart} · ${timePart}`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightMatch(snippet: string, query: string): string {
  if (!snippet) return ''
  const index = snippet.toLowerCase().indexOf(query.toLowerCase())
  if (index < 0) return escapeHtml(snippet)
  const before = snippet.slice(0, index)
  const match = snippet.slice(index, index + query.length)
  const after = snippet.slice(index + query.length)
  return (
    escapeHtml(before) +
    `<mark class="bg-yellow-700 text-yellow-100 rounded px-0.5">${escapeHtml(match)}</mark>` +
    escapeHtml(after)
  )
}

export function renderSearchResults(
  container: HTMLElement,
  results: SearchResult[],
  query: string,
  onSelect: (raw: string) => void,
): void {
  if (results.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-gray-600 text-sm">
        <p>No tokens match <span class="text-gray-400">"${escapeHtml(query)}"</span>.</p>
      </div>
    `
    return
  }

  container.innerHTML = `
    <div class="p-4">
      <p class="text-xs text-gray-600 mb-3 uppercase tracking-wider font-semibold">${results.length} result${results.length === 1 ? '' : 's'}</p>
      ${results
        .map(
          (r, i) => `
        <div
          data-result-index="${i}"
          class="rounded-lg border border-gray-800 overflow-hidden mb-3 hover:border-gray-600 cursor-pointer transition-colors"
        >
          <div class="px-4 py-2 bg-gray-900 border-b border-gray-800 flex items-center gap-2">
            <span class="text-sm font-medium text-gray-200">${escapeHtml(r.entry.name ?? r.entry.label)}</span>
            ${r.entry.saved ? '<span class="text-xs text-yellow-500">★</span>' : ''}
            <span class="ml-auto text-xs text-gray-600 shrink-0">${formatDate(r.entry.addedAt ?? r.entry.savedAt)}</span>
          </div>
          ${
            r.snippet
              ? `<div class="px-4 py-3 bg-gray-950">
                  <pre class="text-xs font-mono text-gray-400 whitespace-pre-wrap break-all leading-relaxed">${highlightMatch(r.snippet, query)}</pre>
                </div>`
              : ''
          }
        </div>
      `,
        )
        .join('')}
    </div>
  `

  container.querySelectorAll<HTMLElement>('[data-result-index]').forEach((el) => {
    const index = parseInt(el.dataset.resultIndex!, 10)
    el.addEventListener('click', () => onSelect(results[index].entry.raw))
  })
}
