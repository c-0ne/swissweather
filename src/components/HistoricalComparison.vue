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

      <div class="hist-grid">
        <div class="hist-detail">
          <div class="detail-header">
            <span class="detail-icon">🌡️</span>
            <span class="detail-title">Temperature</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Min (year ago)</span>
            <strong class="detail-value">{{ yearAgoMin }}°C</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">Min (today)</span>
            <strong class="detail-value">{{ todayMin }}°C</strong>
          </div>
          <div v-if="minDiff !== null" class="detail-row">
            <span class="detail-label">Difference</span>
            <strong :class="['detail-value', minDiff > 0 ? 'warmer' : minDiff < 0 ? 'cooler' : '']">
              {{ minDiff > 0 ? '+' : '' }}{{ minDiff }}°C
            </strong>
          </div>
        </div>

        <div class="hist-detail">
          <div class="detail-header">
            <span class="detail-icon">💧</span>
            <span class="detail-title">Precipitation</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Year ago</span>
            <strong class="detail-value">{{ yearAgoPrecip }} mm</strong>
          </div>
          <div class="detail-row">
            <span class="detail-label">Today</span>
            <strong class="detail-value">{{ todayPrecip }} mm</strong>
          </div>
          <div v-if="precipDiff !== null" class="detail-row">
            <span class="detail-label">Difference</span>
            <strong :class="['detail-value', precipDiff > 0 ? 'wetter' : precipDiff < 0 ? 'drier' : '']">
              {{ precipDiff > 0 ? '+' : '' }}{{ precipDiff }} mm
            </strong>
          </div>
        </div>

        <div v-if="yearAgoWeather || yearAgoWind" class="hist-detail">
          <div class="detail-header">
            <span class="detail-icon">🌤️</span>
            <span class="detail-title">Conditions</span>
          </div>
          <div v-if="yearAgoWeather" class="detail-row">
            <span class="detail-label">Weather</span>
            <strong class="detail-value">{{ yearAgoWeather }}</strong>
          </div>
          <div v-if="yearAgoWind !== null" class="detail-row">
            <span class="detail-label">Max wind</span>
            <strong class="detail-value">{{ yearAgoWind }} km/h</strong>
          </div>
        </div>
      </div>

      <div class="hist-insight">
        <span class="insight-icon">💡</span>
        <p class="insight-text">{{ insight }}</p>
      </div>
    </div>
    <div v-else class="hist-loading">Loading historical data…</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getWeatherInfo } from '../utils/weatherCodes.js'

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
const yearAgoPrecip = computed(() => {
  const precip = props.historical?.daily?.precipitation_sum?.[0]
  return precip !== undefined ? precip.toFixed(1) : '—'
})
const yearAgoWind = computed(() => {
  const wind = props.historical?.daily?.wind_speed_10m_max?.[0]
  return wind !== undefined ? Math.round(wind) : null
})
const yearAgoWeather = computed(() => {
  const code = props.historical?.daily?.weather_code?.[0]
  return code !== undefined ? getWeatherInfo(code).label : null
})

const todayMax = computed(() => {
  if (!props.forecast?.daily?.temperature_2m_max?.[0]) return '—'
  return Math.round(props.forecast.daily.temperature_2m_max[0])
})
const todayMin = computed(() => {
  if (!props.forecast?.daily?.temperature_2m_min?.[0]) return '—'
  return Math.round(props.forecast.daily.temperature_2m_min[0])
})
const todayPrecip = computed(() => {
  const precip = props.forecast?.daily?.precipitation_sum?.[0]
  return precip !== undefined ? precip.toFixed(1) : '—'
})

const diff = computed(() => {
  if (typeof yearAgoMax.value === 'string' || typeof todayMax.value === 'string') return null
  return todayMax.value - yearAgoMax.value
})

const minDiff = computed(() => {
  if (typeof yearAgoMin.value === 'string' || typeof todayMin.value === 'string') return null
  return todayMin.value - yearAgoMin.value
})

const precipDiff = computed(() => {
  if (yearAgoPrecip.value === '—' || todayPrecip.value === '—') return null
  return (parseFloat(todayPrecip.value) - parseFloat(yearAgoPrecip.value)).toFixed(1)
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

const insight = computed(() => {
  const parts = []

  if (diff.value !== null && Math.abs(diff.value) >= 5) {
    parts.push(`Significant temperature change of ${Math.abs(diff.value)}°C compared to last year`)
  }

  if (precipDiff.value !== null) {
    const pDiff = parseFloat(precipDiff.value)
    if (Math.abs(pDiff) >= 5) {
      parts.push(`${pDiff > 0 ? 'much wetter' : 'much drier'} with ${Math.abs(pDiff).toFixed(1)}mm ${pDiff > 0 ? 'more' : 'less'} rain`)
    }
  }

  if (parts.length === 0) {
    return 'Weather conditions are similar to last year at this time.'
  }

  return parts.join(', ') + '.'
})
</script>

<style scoped>
.historical { padding: 24px; }
.historical h3 { margin: 0 0 20px; }
.hist-content { display: flex; flex-direction: column; gap: 20px; }
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

.hist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.hist-detail {
  background: var(--bg);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.detail-icon { font-size: 1.2rem; }
.detail-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}

.detail-label { color: var(--text-muted); }
.detail-value { color: var(--text); }
.detail-value.warmer { color: #f97316; }
.detail-value.cooler { color: #60a5fa; }
.detail-value.wetter { color: #60a5fa; }
.detail-value.drier { color: #fbbf24; }

.hist-insight {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(56, 189, 248, 0.1);
  border-radius: 10px;
  border-left: 3px solid var(--accent);
}

.insight-icon { font-size: 1.4rem; flex-shrink: 0; }
.insight-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text);
  line-height: 1.5;
}

.hist-loading {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 20px 0;
}
</style>
