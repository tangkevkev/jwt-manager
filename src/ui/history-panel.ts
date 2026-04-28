import type { HistoryEntry } from '../lib/history-store'
import { getLabelColor } from '../lib/label-color'

interface Callbacks {
  onSelect: (id: string, raw: string) => void
  onDelete: (id: string) => void
  onSave: (id: string) => void
  onRename: (id: string, name: string) => void
  onLabelFilter: (label: string) => void
  onClearFilter: () => void
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function expiryBadge(entry: HistoryEntry): string {
  if (entry.exp === undefined) return ''
  const expired = entry.exp * 1000 < Date.now()
  return expired
    ? '<span class="text-xs px-1.5 py-0.5 rounded bg-red-900 text-red-300">Expired</span>'
    : ''
}

function labelChips(entry: HistoryEntry): string {
  if (!entry.labels.length) return ''
  const chips = entry.labels
    .map((lbl) => {
      const { bg, text } = getLabelColor(lbl)
      return `<span
        data-filter-label="${escapeHtml(lbl)}"
        class="text-xs px-1.5 py-0.5 rounded cursor-pointer ${bg} ${text} hover:opacity-80 transition-opacity"
      >${escapeHtml(lbl)}</span>`
    })
    .join('')
  return `<div class="flex flex-wrap gap-1 mt-1">${chips}</div>`
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const datePart = d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timePart = d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} · ${timePart}`
}

function renderEntry(entry: HistoryEntry, isNew = false, isActive = false): string {
  const displayLabel = entry.name || entry.label
  const activeClasses = isActive ? 'bg-blue-950 border-l-2 border-blue-500' : ''

  if (entry.saved) {
    return `
      <div
        class="group flex items-start gap-2 px-4 py-3 border-b border-gray-800 hover:bg-gray-900 cursor-pointer ${activeClasses}"
        data-id="${entry.id}"
        data-saved
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            ${
              isNew
                ? `<input
                    data-rename
                    type="text"
                    value="${escapeHtml(displayLabel)}"
                    class="flex-1 bg-transparent text-sm text-gray-200 border-b border-blue-500 outline-none min-w-0"
                  />`
                : `<span data-label class="text-sm text-gray-200 break-words">${escapeHtml(displayLabel)}</span>
                   <input
                    data-rename
                    type="text"
                    value="${escapeHtml(displayLabel)}"
                    class="hidden flex-1 bg-transparent text-sm text-gray-200 border-b border-blue-500 outline-none min-w-0"
                  />`
            }
            ${expiryBadge(entry)}
          </div>
          ${labelChips(entry)}
          <span class="text-xs text-gray-500">${formatDate(entry.addedAt ?? entry.savedAt)}</span>
        </div>
        <button
          data-delete
          class="opacity-0 group-hover:opacity-100 shrink-0 text-gray-600 hover:text-red-400 transition-opacity text-xs px-1 py-1"
          title="Delete"
          aria-label="Delete token"
        >✕</button>
      </div>
    `
  }

  return `
    <div
      class="group flex items-start gap-2 px-4 py-3 border-b border-gray-800 hover:bg-gray-900 cursor-pointer ${activeClasses}"
      data-id="${entry.id}"
    >
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5 flex-wrap">
          <span class="text-sm text-gray-400 break-words">${escapeHtml(displayLabel)}</span>
          ${expiryBadge(entry)}
        </div>
        ${labelChips(entry)}
        <span class="text-xs text-gray-600">${formatDate(entry.addedAt ?? entry.savedAt)}</span>
      </div>
      <button
        data-bookmark
        class="opacity-0 group-hover:opacity-100 shrink-0 text-gray-600 hover:text-yellow-400 transition-opacity text-xs px-1 py-1"
        title="Save"
        aria-label="Save token"
      >☆</button>
      <button
        data-delete
        class="opacity-0 group-hover:opacity-100 shrink-0 text-gray-600 hover:text-red-400 transition-opacity text-xs px-1 py-1"
        title="Delete"
        aria-label="Delete token"
      >✕</button>
    </div>
  `
}

function sectionHeader(title: string): string {
  return `<div class="px-4 py-1.5 bg-gray-900 border-b border-gray-800">
    <span class="text-xs font-semibold uppercase tracking-wider text-gray-600">${title}</span>
  </div>`
}

function filterIndicator(label: string): string {
  const { bg, text } = getLabelColor(label)
  return `<div class="px-3 py-2 border-b border-gray-800 flex items-center gap-2 bg-gray-900">
    <span class="text-xs text-gray-400">Filtered by:</span>
    <span class="text-xs px-1.5 py-0.5 rounded ${bg} ${text}">${escapeHtml(label)}</span>
    <button
      data-clear-filter
      class="ml-auto text-xs text-gray-500 hover:text-gray-200 px-1.5 py-0.5 rounded hover:bg-gray-800 transition-colors"
      aria-label="Clear filter"
    >✕ Clear</button>
  </div>`
}

export function renderHistoryPanel(
  container: HTMLElement,
  entries: HistoryEntry[],
  callbacks: Callbacks,
  newlySavedId?: string,
  activeEntryId?: string | null,
  filterLabel?: string | null,
): void {
  const filtered = filterLabel
    ? entries.filter((e) => e.labels.includes(filterLabel))
    : entries

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-gray-600 text-sm">
        <p>No tokens yet.</p>
        <p class="mt-1">Paste a JWT above to get started.</p>
      </div>
    `
    return
  }

  const saved = filtered.filter((e) => e.saved)
  const recent = filtered.filter((e) => !e.saved)

  let html = ''
  if (filterLabel) {
    html += filterIndicator(filterLabel)
  }
  if (saved.length > 0) {
    html += sectionHeader('Saved')
    html += saved.map((e) => renderEntry(e, e.id === newlySavedId, e.id === activeEntryId)).join('')
  }
  if (recent.length > 0) {
    html += sectionHeader('Recent')
    html += recent.map((e) => renderEntry(e, false, e.id === activeEntryId)).join('')
  }
  if (filterLabel && saved.length === 0 && recent.length === 0) {
    html += `<div class="p-6 text-center text-gray-600 text-sm">No tokens with this label.</div>`
  }
  container.innerHTML = html

  const clearFilterBtn = container.querySelector<HTMLElement>('[data-clear-filter]')
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      callbacks.onClearFilter()
    })
  }

  container.querySelectorAll<HTMLElement>('[data-id]').forEach((el) => {
    const id = el.dataset.id!
    const entry = entries.find((e) => e.id === id)!
    const renameInput = el.querySelector<HTMLInputElement>('[data-rename]')
    const labelEl = el.querySelector<HTMLElement>('[data-label]')

    el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-delete]')) {
        callbacks.onDelete(entry.id)
        return
      }
      if (target.closest('[data-bookmark]')) {
        callbacks.onSave(entry.id)
        return
      }
      if (target.closest('[data-rename]') || target.closest('[data-label]')) {
        if (labelEl && renameInput) {
          labelEl.classList.add('hidden')
          renameInput.classList.remove('hidden')
          renameInput.focus()
          renameInput.select()
        }
        return
      }
      const filterTarget = (target as HTMLElement).closest<HTMLElement>('[data-filter-label]')
      if (filterTarget) {
        callbacks.onLabelFilter(filterTarget.dataset.filterLabel!)
        return
      }
      callbacks.onSelect(entry.id, entry.raw)
    })

    if (renameInput) {
      const commitRename = () => {
        const val = renameInput.value.trim()
        if (val) {
          callbacks.onRename(entry.id, val)
        } else if (labelEl) {
          labelEl.classList.remove('hidden')
          renameInput.classList.add('hidden')
        }
      }

      renameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          commitRename()
        }
        if (e.key === 'Escape') {
          if (labelEl) {
            labelEl.classList.remove('hidden')
            renameInput.classList.add('hidden')
          }
        }
      })

      renameInput.addEventListener('blur', commitRename)

      if (el.dataset.id === newlySavedId) {
        renameInput.focus()
      }
    }
  })
}
