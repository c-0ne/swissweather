<template>
  <div class="historical card">
    <h3 class="text-lg font-bold mb-4">📅 A Year Ago Today</h3>
    <div v-if="historical && forecast" class="flex flex-col gap-4">

      <!-- Temperature comparison -->
      <div class="comparison-row">
        <div class="comp-stat">
          <span class="comp-label">Max Temp (year ago)</span>
          <span class="comp-val text-blue">{{ yearAgoMax }}°C</span>
        </div>
        <div class="comp-arrow" :class="diffClass">{{ diffIcon }}</div>
        <div class="comp-stat">
          <span class="comp-label">Max Temp (today)</span>
          <span class="comp-val text-accent">{{ todayMax }}°C</span>
        </div>
      </div>

      <p class="summary-text">{{ tempSummary }}</p>

      <!-- Detail grid -->
      <div class="details-grid">
        <div class="detail-card">
          <span class="detail-icon">🌡️</span>
          <span class="detail-label">Min (year ago)</span>
          <strong class="detail-val">{{ yearAgoMin }}°C</strong>
        </div>
        <div class="detail-card">
          <span class="detail-icon">🌧️</span>
          <span class="detail-label">Rain (year ago)</span>
          <strong class="detail-val">{{ yearAgoPrecip }} mm</strong>
        </div>
        <div class="detail-card">
          <span class="detail-icon">💨</span>
          <span class="detail-label">Wind max (year ago)</span>
          <strong class="detail-val">{{ yearAgoWind }} km/h</strong>
        </div>
        <div class="detail-card">
          <span class="detail-icon">{{ yearAgoWeatherInfo.icon }}</span>
          <span class="detail-label">Condition (year ago)</span>
          <strong class="detail-val text-sm">{{ yearAgoWeatherInfo.label }}</strong>
        </div>
        <div class="detail-card">
          <span class="detail-icon">🌅</span>
          <span class="detail-label">Sunrise (year ago)</span>
          <strong class="detail-val">{{ yearAgoSunrise }}</strong>
        </div>
        <div class="detail-card">
          <span class="detail-icon">🌇</span>
          <span class="detail-label">Sunset (year ago)</span>
          <strong class="detail-val">{{ yearAgoSunset }}</strong>
        </div>
      </div>

      <!-- Interesting insight -->
      <div class="insight-box">
        <span class="text-accent font-semibold text-sm">💡 Insight</span>
        <p class="text-sm text-muted mt-1 mb-0">{{ insight }}</p>
      </div>
    </div>
    <div v-else class="text-muted text-sm text-center py-5">Loading historical data…</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getWeatherInfo } from '../utils/weatherCodes.js'

const props = defineProps({
  historical: { type: Object, default: null },
  forecast: { type: Object, default: null },
})

function roundOrDash(value) {
  return value != null ? Math.round(value) : '—'
}

const yearAgoMax = computed(() => roundOrDash(props.historical?.daily?.temperature_2m_max?.[0]))
const yearAgoMin = computed(() => roundOrDash(props.historical?.daily?.temperature_2m_min?.[0]))
const yearAgoPrecip = computed(() => props.historical?.daily?.precipitation_sum?.[0] ?? '—')
const yearAgoWind = computed(() => roundOrDash(props.historical?.daily?.wind_speed_10m_max?.[0]))
const yearAgoWeatherInfo = computed(() => {
  const code = props.historical?.daily?.weather_code?.[0]
  return code != null ? getWeatherInfo(code) : { label: '—', icon: '❓' }
})

function formatLocalTime(isoString) {
  if (!isoString) return '—'
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

const yearAgoSunrise = computed(() => formatLocalTime(props.historical?.daily?.sunrise?.[0]))
const yearAgoSunset = computed(() => formatLocalTime(props.historical?.daily?.sunset?.[0]))

const todayMax = computed(() => roundOrDash(props.forecast?.daily?.temperature_2m_max?.[0]))

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

const tempSummary = computed(() => {
  if (diff.value === null) return 'Could not compare temperatures.'
  const absDiff = Math.abs(diff.value)
  if (absDiff < 1) return 'About the same temperature as a year ago.'
  const word = diff.value > 0 ? 'warmer' : 'cooler'
  return `It is ${absDiff}°C ${word} today than it was exactly one year ago.`
})

const insight = computed(() => {
  const precip = typeof yearAgoPrecip.value === 'number' ? yearAgoPrecip.value : null
  const wind = typeof yearAgoWind.value === 'number' ? yearAgoWind.value : null
  const minTemp = typeof yearAgoMin.value === 'number' ? yearAgoMin.value : null
  const maxTemp = typeof yearAgoMax.value === 'number' ? yearAgoMax.value : null

  const parts = []

  if (precip != null) {
    if (precip === 0) parts.push('A year ago today was completely dry.')
    else if (precip < 2) parts.push(`Only ${precip} mm of rain fell a year ago.`)
    else if (precip >= 10) parts.push(`A year ago was quite wet with ${precip} mm of rain.`)
    else parts.push(`There was ${precip} mm of rain a year ago.`)
  }

  if (maxTemp != null && minTemp != null) {
    const range = maxTemp - minTemp
    if (range >= 15) parts.push('The temperature swung widely throughout the day.')
    else if (range <= 4) parts.push('Temperatures were very stable throughout the day.')
  }

  if (wind != null) {
    if (wind >= 50) parts.push(`It was very windy at ${wind} km/h.`)
    else if (wind <= 10) parts.push('Almost no wind at all.')
  }

  return parts.length > 0 ? parts.join(' ') : 'Compare today\'s weather with the same day last year!'
})
</script>

<style scoped>
.historical { padding: 24px; }
.text-accent { color: var(--accent); }
.text-muted { color: var(--text-muted); }
.text-blue { color: #60a5fa; }

.comparison-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 12px;
}

.comp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.comp-label { font-size: 0.75rem; color: var(--text-muted); }
.comp-val { font-size: 1.8rem; font-weight: 700; line-height: 1; }

.comp-arrow {
  font-size: 1.6rem;
  padding: 0 8px;
}
.comp-arrow.warmer { color: #f97316; }
.comp-arrow.cooler { color: #60a5fa; }
.comp-arrow.same { color: var(--text-muted); }

.summary-text {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.detail-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg);
  border-radius: 10px;
  padding: 10px 8px;
  gap: 3px;
  text-align: center;
}

.detail-icon { font-size: 1.1rem; }
.detail-label { font-size: 0.7rem; color: var(--text-muted); }
.detail-val { font-size: 0.88rem; color: var(--text); }

.insight-box {
  background: var(--accent-soft);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  padding: 12px 14px;
}
</style>
