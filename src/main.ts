import './style.css'
import { decodeJwt } from './lib/decode'
import { saveToHistory, getHistory, deleteFromHistory, pruneTemporaryEntries, saveEntry, renameEntry } from './lib/history-store'
import { renderDecodeOutput, clearDecodeOutput } from './ui/decode-view'
import { renderHistoryPanel } from './ui/history-panel'
import { searchHistory } from './lib/history-search'
import { renderSearchResults } from './ui/search-results-view'

const app = document.getElementById('app')!

app.innerHTML = `
  <div class="flex flex-col-reverse md:flex-row h-screen bg-gray-950 text-gray-100 overflow-hidden">
    <aside class="h-40 md:h-auto md:w-72 md:flex-shrink-0 border-t md:border-t-0 md:border-r border-gray-800 flex flex-col overflow-hidden">
      <div class="px-4 py-2 border-b border-gray-800 flex-shrink-0 hidden md:block">
        <h1 class="text-sm font-semibold text-gray-100">JWT Manager</h1>
      </div>
      <div class="px-3 py-2 border-b border-gray-800 flex-shrink-0">
        <input
          id="history-search"
          type="search"
          placeholder="Search history…"
          class="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500"
          autocomplete="off"
          spellcheck="false"
        />
      </div>
      <div id="history-list" class="flex-1 overflow-y-auto"></div>
    </aside>
    <main class="flex-1 grid grid-cols-1 md:grid-cols-[1fr_20rem] overflow-hidden min-h-0">
      <!-- Left: payload only -->
      <div id="payload-output" class="order-2 md:order-1 overflow-y-auto p-4"></div>
      <!-- Right: input → header → signature -->
      <div class="order-1 md:order-2 md:border-l border-b md:border-b-0 border-gray-800 p-4 flex flex-col gap-3 overflow-y-auto">
        <div class="flex items-center md:hidden">
          <h1 class="text-sm font-semibold text-gray-100">JWT Manager</h1>
        </div>
        <div id="input-wrapper" class="flex-1 flex flex-col min-h-32">
          <textarea
            id="jwt-input"
            class="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:border-blue-500 placeholder-gray-600"
            placeholder="Paste your JWT here…"
            spellcheck="false"
            autocomplete="off"
          ></textarea>
          <div id="token-bar" class="hidden flex-col gap-2">
            <div class="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
              <span id="token-preview" class="flex-1 text-xs font-mono text-gray-500 truncate"></span>
              <button id="copy-btn" class="shrink-0 text-xs text-gray-400 hover:text-gray-100 px-2 py-1 rounded hover:bg-gray-800 transition-colors">Copy</button>
              <button id="clear-btn" class="shrink-0 text-xs text-blue-500 hover:text-blue-300 px-2 py-1 rounded hover:bg-gray-800 transition-colors">New</button>
            </div>
            <p class="text-xs text-gray-600">Paste anywhere to replace</p>
          </div>
        </div>
        <div id="header-output"></div>
        <div id="signature-output"></div>
      </div>
    </main>
  </div>
`

const input = document.getElementById('jwt-input') as HTMLTextAreaElement
const inputWrapper = document.getElementById('input-wrapper')!
const tokenBar = document.getElementById('token-bar')!
const tokenPreview = document.getElementById('token-preview')!
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement
const clearBtn = document.getElementById('clear-btn')!

const containers = {
  payload: document.getElementById('payload-output')!,
  header: document.getElementById('header-output')!,
  signature: document.getElementById('signature-output')!,
}

const historyList = document.getElementById('history-list')!
const historySearch = document.getElementById('history-search') as HTMLInputElement

let currentRaw = ''
let currentQuery = ''

function showTokenBar(raw: string): void {
  currentRaw = raw
  tokenPreview.textContent = raw.length > 48 ? raw.slice(0, 48) + '…' : raw
  input.classList.add('hidden')
  tokenBar.classList.remove('hidden')
  tokenBar.classList.add('flex')
  inputWrapper.classList.remove('flex-1')
}

function hideTokenBar(): void {
  currentRaw = ''
  input.classList.remove('hidden')
  tokenBar.classList.add('hidden')
  tokenBar.classList.remove('flex')
  inputWrapper.classList.add('flex-1')
}

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentRaw).then(() => {
    copyBtn.textContent = 'Copied!'
    setTimeout(() => { copyBtn.textContent = 'Copy' }, 1500)
  })
})

clearBtn.addEventListener('click', () => {
  input.value = ''
  hideTokenBar()
  clearDecodeOutput(containers)
})

document.addEventListener('paste', (e) => {
  if (tokenBar.classList.contains('flex')) {
    const text = e.clipboardData?.getData('text') ?? ''
    if (text.trim()) {
      hideTokenBar()
      input.value = text
      handleInput()
    }
  }
})

function refreshHistory(savedId?: string): void {
  renderHistoryPanel(
    historyList,
    getHistory(),
    {
      onSelect(raw) {
        hideTokenBar()
        input.value = raw
        handleInput()
      },
      onDelete(id) {
        deleteFromHistory(id)
        refreshHistory()
      },
      onSave(id) {
        saveEntry(id)
        refreshHistory(id)
      },
      onRename(id, name) {
        renameEntry(id, name)
        refreshHistory()
      },
    },
    savedId,
  )
}

function showDecodeView(): void {
  containers.header.classList.remove('hidden')
  containers.signature.classList.remove('hidden')
}

function hideDecodeView(): void {
  containers.header.classList.add('hidden')
  containers.signature.classList.add('hidden')
}

function handleSearch(): void {
  currentQuery = historySearch.value
  if (!currentQuery.trim()) {
    showDecodeView()
    if (currentRaw) {
      renderDecodeOutput(containers, decodeJwt(currentRaw))
    } else {
      clearDecodeOutput(containers)
    }
    return
  }
  hideDecodeView()
  const results = searchHistory(getHistory(), currentQuery)
  renderSearchResults(containers.payload, results, currentQuery, (raw) => {
    historySearch.value = ''
    currentQuery = ''
    showDecodeView()
    hideTokenBar()
    input.value = raw
    handleInput()
  })
}

function handleInput(): void {
  const token = input.value.trim()
  if (!token) {
    hideTokenBar()
    clearDecodeOutput(containers)
    return
  }
  const result = decodeJwt(token)
  renderDecodeOutput(containers, result)
  if (result.ok) {
    saveToHistory(result.value)
    refreshHistory()
    showTokenBar(result.value.raw)
  } else {
    hideTokenBar()
  }
}

input.addEventListener('input', handleInput)
historySearch.addEventListener('input', handleSearch)
pruneTemporaryEntries()
refreshHistory()
