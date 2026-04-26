import type { HistoryEntry } from '../lib/history-store'

interface Callbacks {
  onSelect: (raw: string) => void
  onDelete: (id: string) => void
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function expiryBadge(entry: HistoryEntry): string {
  if (entry.exp === undefined) return ''
  const expired = entry.exp * 1000 < Date.now()
  return expired
    ? '<span class="text-xs px-1.5 py-0.5 rounded bg-red-900 text-red-300">Expired</span>'
    : '<span class="text-xs px-1.5 py-0.5 rounded bg-green-900 text-green-300">Valid</span>'
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function renderHistoryPanel(
  container: HTMLElement,
  entries: HistoryEntry[],
  callbacks: Callbacks,
): void {
  if (entries.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-gray-600 text-sm">
        <p>No tokens yet.</p>
        <p class="mt-1">Paste a JWT above to get started.</p>
      </div>
    `
    return
  }

  container.innerHTML = entries
    .map(
      (entry, i) => `
      <div
        class="group flex items-start gap-2 px-4 py-3 border-b border-gray-800 hover:bg-gray-900 cursor-pointer"
        data-index="${i}"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            <span class="text-sm text-gray-200 truncate max-w-[160px]">${escapeHtml(entry.label)}</span>
            ${expiryBadge(entry)}
          </div>
          <span class="text-xs text-gray-500">${formatDate(entry.savedAt)}</span>
        </div>
        <button
          data-delete
          class="opacity-0 group-hover:opacity-100 shrink-0 text-gray-600 hover:text-red-400 transition-opacity text-xs px-1 py-1"
          title="Delete"
          aria-label="Delete token"
        >✕</button>
      </div>
    `,
    )
    .join('')

  container.querySelectorAll<HTMLElement>('[data-index]').forEach((el) => {
    const index = parseInt(el.dataset.index!, 10)
    const entry = entries[index]
    el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('[data-delete]')) {
        callbacks.onDelete(entry.id)
      } else {
        callbacks.onSelect(entry.raw)
      }
    })
  })
}
