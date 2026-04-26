import './style.css'
import { decodeJwt } from './lib/decode'
import { saveToHistory, getHistory, deleteFromHistory } from './lib/history-store'
import { renderDecodeOutput } from './ui/decode-view'
import { renderHistoryPanel } from './ui/history-panel'

const app = document.getElementById('app')!

app.innerHTML = `
  <div class="flex flex-col-reverse md:flex-row h-screen bg-gray-950 text-gray-100 overflow-hidden">
    <aside class="h-40 md:h-auto md:w-72 md:flex-shrink-0 border-t md:border-t-0 md:border-r border-gray-800 flex flex-col overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-800 flex-shrink-0 hidden md:block">
        <h1 class="text-base font-semibold text-gray-100">JWT Manager</h1>
      </div>
      <div id="history-list" class="flex-1 overflow-y-auto"></div>
    </aside>
    <main class="flex-1 flex flex-col overflow-hidden min-h-0">
      <div class="px-4 pt-4 pb-3 border-b border-gray-800 flex-shrink-0">
        <div class="flex items-center mb-2 md:hidden">
          <h1 class="text-base font-semibold text-gray-100">JWT Manager</h1>
        </div>
        <textarea
          id="jwt-input"
          class="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:border-blue-500 placeholder-gray-600"
          placeholder="Paste your JWT here…"
          spellcheck="false"
          autocomplete="off"
        ></textarea>
      </div>
      <div id="decode-output" class="flex-1 overflow-y-auto p-4"></div>
    </main>
  </div>
`

const input = document.getElementById('jwt-input') as HTMLTextAreaElement
const decodeOutput = document.getElementById('decode-output')!
const historyList = document.getElementById('history-list')!

function refreshHistory(): void {
  renderHistoryPanel(historyList, getHistory(), {
    onSelect(raw) {
      input.value = raw
      handleInput()
    },
    onDelete(id) {
      deleteFromHistory(id)
      refreshHistory()
    },
  })
}

function handleInput(): void {
  const token = input.value.trim()
  if (!token) {
    decodeOutput.innerHTML = ''
    return
  }
  const result = decodeJwt(token)
  renderDecodeOutput(decodeOutput, result)
  if (result.ok) {
    saveToHistory(result.value)
    refreshHistory()
  }
}

input.addEventListener('input', handleInput)
refreshHistory()
