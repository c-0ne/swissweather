<template>
  <div class="historical card">
    <h3>📅 A Year Ago Today</h3>
    <div v-if="historical && forecast" class="hist-content">
      <div class="hist-row">
        <div class="hist-stat">
          <span class="hist-label">Max temp a year ago</span>
          <span class="hist-val">{{ yearAgoMax }}°C</span>
        </div>
        <div class="hist-arrow">
          <span :class="['arrow', diffClass]">{{ diffIcon }}</span>
        </div>
        <div class="hist-stat">
          <span class="hist-label">Today's max temp</span>
          <span class="hist-val">{{ todayMax }}°C</span>
        </div>
      </div>
      <p class="hist-summary">{{ summary }}</p>
      <div class="hist-details">
        <div class="detail-item">
          <span>Min (year ago)</span>
          <strong>{{ yearAgoMin }}°C</strong>
        </div>
        <div class="detail-item">
          <span>Precip (year ago)</span>
          <strong>{{ yearAgoPrecip }} mm</strong>
        </div>
      </div>
    </div>
    <div v-else class="hist-loading">Loading historical data…</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  historical: { type: Object, default: null },
  forecast: { type: Object, default: null },
})

const yearAgoMax = computed(() => {
  if (!props.historical?.daily?.temperature_2m_max?.[0]) return '—'
  return Math.round(props.historical.daily.temperature_2m_max[0])
})
const yearAgoMin = computed(() => {
  if (!props.historical?.daily?.temperature_2m_min?.[0]) return '—'
  return Math.round(props.historical.daily.temperature_2m_min[0])
})
const yearAgoPrecip = computed(() => props.historical?.daily?.precipitation_sum?.[0] ?? '—')

const todayMax = computed(() => {
  if (!props.forecast?.daily?.temperature_2m_max?.[0]) return '—'
  return Math.round(props.forecast.daily.temperature_2m_max[0])
})

const diff = computed(() => {
  if (typeof yearAgoMax.value === 'string' || typeof todayMax.value === 'string') return null
  return todayMax.value - yearAgoMax.value
})

const diffClass = computed(() => {
  if (diff.value === null) return ''
  return diff.value > 0 ? 'warmer' : diff.value < 0 ? 'cooler' : 'same'
})

const diffIcon = computed(() => {
  if (diff.value === null) return ''
  if (diff.value > 0) return '🌡️↑'
  if (diff.value < 0) return '🌡️↓'
  return '≈'
})

const summary = computed(() => {
  if (diff.value === null) return 'Could not compare.'
  const absDiff = Math.abs(diff.value)
  if (absDiff < 1) return 'About the same temperature as a year ago.'
  const word = diff.value > 0 ? 'warmer' : 'cooler'
  return `It is ${absDiff}°C ${word} today than a year ago.`
})
</script>

<style scoped>
.historical { padding: 24px; }
.historical h3 { margin: 0 0 20px; }
.hist-content { display: flex; flex-direction: column; gap: 16px; }
.hist-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 12px;
}
.hist-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.hist-label { font-size: 0.78rem; color: var(--text-muted); }
.hist-val { font-size: 2rem; font-weight: 700; color: var(--accent); }
.hist-arrow { font-size: 1.8rem; }
.arrow.warmer { color: #f97316; }
.arrow.cooler { color: #60a5fa; }
.arrow.same { color: var(--text-muted); }
.hist-summary {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}
.hist-details {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-muted);
  gap: 2px;
}
.detail-item strong { color: var(--text); font-size: 0.95rem; }
.hist-loading { color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 20px 0; }
</style>
