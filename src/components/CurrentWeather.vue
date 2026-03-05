<template>
  <div class="current-weather card">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold m-0">{{ location.name }}</h2>
        <span class="text-sm text-muted">{{ [location.admin1, location.country].filter(Boolean).join(', ') }}</span>
      </div>
      <div class="text-5xl leading-none">{{ weatherInfo.icon }}</div>
    </div>
    <p class="text-muted text-sm mt-1 mb-4">{{ weatherInfo.label }}</p>

    <div class="flex items-baseline gap-3 mb-5">
      <span class="text-6xl font-bold text-accent leading-none">{{ Math.round(current.temperature_2m) }}°C</span>
      <span class="text-sm text-muted">Feels like {{ Math.round(current.apparent_temperature) }}°C</span>
    </div>

    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="stat-tile">
        <span class="text-xl">💨</span>
        <span class="font-semibold text-sm">{{ current.wind_speed_10m }} km/h</span>
        <span class="text-xs text-muted">Wind</span>
      </div>
      <div class="stat-tile">
        <span class="text-xl">🌧️</span>
        <span class="font-semibold text-sm">{{ current.precipitation }} mm</span>
        <span class="text-xs text-muted">Rain</span>
      </div>
      <div class="stat-tile">
        <span class="text-xl">💧</span>
        <span class="font-semibold text-sm">{{ current.relative_humidity_2m }}%</span>
        <span class="text-xs text-muted">Humidity</span>
      </div>
    </div>

    <div v-if="sunriseTime || sunsetTime" class="flex gap-4 pt-3 border-t border-card-border">
      <div v-if="sunriseTime" class="flex items-center gap-2 text-sm text-muted">
        <span class="text-base">🌅</span>
        <span>Sunrise <strong class="text-slate-100">{{ sunriseTime }}</strong></span>
      </div>
      <div v-if="sunsetTime" class="flex items-center gap-2 text-sm text-muted">
        <span class="text-base">🌇</span>
        <span>Sunset <strong class="text-slate-100">{{ sunsetTime }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getWeatherInfo } from '../utils/weatherCodes.js'

const props = defineProps({
  forecast: { type: Object, required: true },
  location: { type: Object, required: true },
})

const current = computed(() => props.forecast.current)
const weatherInfo = computed(() => getWeatherInfo(current.value.weather_code))

function formatLocalTime(isoString) {
  if (!isoString) return null
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return null
  }
}

const sunriseTime = computed(() => formatLocalTime(props.forecast.daily?.sunrise?.[0]))
const sunsetTime = computed(() => formatLocalTime(props.forecast.daily?.sunset?.[0]))
</script>

<style scoped>
.current-weather { padding: 24px; }
.stat-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg);
  border-radius: 10px;
  padding: 12px 8px;
  gap: 4px;
}
</style>
