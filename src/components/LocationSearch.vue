<template>
  <div class="relative w-full max-w-lg">
    <div
      class="flex items-center bg-card border-2 border-card-border rounded-xl px-3 gap-2 transition-colors"
      :class="focused ? 'border-accent' : ''"
    >
      <span class="text-base opacity-50">🔍</span>
      <input
        v-model="query"
        type="text"
        placeholder="Search for a location..."
        class="flex-1 border-none outline-none bg-transparent text-slate-100 text-base py-3 placeholder:text-muted"
        @input="onInput"
        @focus="focused = true"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="closeDropdown"
        @blur="onBlur"
        autocomplete="off"
      />
      <span v-if="loading" class="animate-spin inline-block text-lg opacity-60">⟳</span>
    </div>

    <ul v-if="results.length" class="dropdown-list" ref="dropdownEl">
      <li
        v-for="(r, i) in results"
        :key="r.id ?? i"
        :class="['dropdown-item', { 'highlighted': i === highlightedIndex }]"
        @mousedown.prevent="selectResult(r)"
        @mouseover="highlightedIndex = i"
      >
        <span class="font-semibold text-slate-100">{{ r.name }}</span>
        <span class="text-xs text-muted">{{ [r.admin1, r.country].filter(Boolean).join(', ') }}</span>
      </li>
    </ul>
    <p v-if="noResults" class="no-results-box">No results found.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const DEBOUNCE_DELAY = 300

const props = defineProps({
  searchFn: { type: Function, required: true },
})
const emit = defineEmits(['select'])

const query = ref('')
const results = ref([])
const loading = ref(false)
const noResults = ref(false)
const highlightedIndex = ref(-1)
const focused = ref(false)
const dropdownEl = ref(null)

let debounceTimer = null

function onInput() {
  noResults.value = false
  highlightedIndex.value = -1
  clearTimeout(debounceTimer)
  if (!query.value || query.value.length < 2) {
    results.value = []
    return
  }
  debounceTimer = setTimeout(async () => {
    loading.value = true
    try {
      const res = await props.searchFn(query.value)
      results.value = res
      noResults.value = res.length === 0
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }, DEBOUNCE_DELAY)
}

function closeDropdown() {
  results.value = []
  noResults.value = false
}

function onBlur() {
  focused.value = false
  setTimeout(closeDropdown, 150)
}

function highlightNext() {
  if (results.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value + 1) % results.value.length
}

function highlightPrev() {
  if (results.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value - 1 + results.value.length) % results.value.length
}

function selectHighlighted() {
  if (highlightedIndex.value >= 0 && results.value[highlightedIndex.value]) {
    selectResult(results.value[highlightedIndex.value])
  }
}

function selectResult(r) {
  query.value = [r.name, r.admin1, r.country].filter(Boolean).join(', ')
  results.value = []
  noResults.value = false
  emit('select', { name: r.name, lat: r.latitude, lon: r.longitude, country: r.country, admin1: r.admin1 })
}
</script>

<style scoped>
.dropdown-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  list-style: none;
  margin: 0; padding: 4px;
  z-index: 999;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  gap: 8px;
}

.dropdown-item.highlighted,
.dropdown-item:hover {
  background: var(--accent-soft);
}

.no-results-box {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}
</style>
