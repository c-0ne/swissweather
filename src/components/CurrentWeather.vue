<template>
  <div class="current-weather card">
    <div class="cw-header">
      <div class="cw-location">
        <h2>{{ location.name }}</h2>
        <span class="cw-sub">{{ [location.admin1, location.country].filter(Boolean).join(', ') }}</span>
      </div>
      <div class="cw-icon">{{ weatherInfo.icon }}</div>
    </div>
    <p class="cw-desc">{{ weatherInfo.label }}</p>

    <div class="cw-temp">
      <span class="temp-main">{{ Math.round(current.temperature_2m) }}°C</span>
      <span class="temp-feels">Feels like {{ Math.round(current.apparent_temperature) }}°C</span>
    </div>

    <div class="cw-grid">
      <div class="cw-stat">
        <span class="stat-icon">💨</span>
        <span class="stat-val">{{ current.wind_speed_10m }} km/h</span>
        <span class="stat-label">Wind</span>
      </div>
      <div class="cw-stat">
        <span class="stat-icon">🌧️</span>
        <span class="stat-val">{{ current.precipitation }} mm</span>
        <span class="stat-label">Rain</span>
      </div>
      <div class="cw-stat">
        <span class="stat-icon">💧</span>
        <span class="stat-val">{{ current.relative_humidity_2m }}%</span>
        <span class="stat-label">Humidity</span>
      </div>
    </div>

    <div v-if="sunrise && sunset" class="cw-sun">
      <div class="sun-item">
        <span class="sun-icon">🌅</span>
        <div class="sun-info">
          <span class="sun-label">Sunrise</span>
          <span class="sun-time">{{ sunrise }}</span>
        </div>
      </div>
      <div class="sun-item">
        <span class="sun-icon">🌇</span>
        <div class="sun-info">
          <span class="sun-label">Sunset</span>
          <span class="sun-time">{{ sunset }}</span>
        </div>
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

const sunrise = computed(() => {
  const sunriseTime = props.forecast.daily?.sunrise?.[0]
  if (!sunriseTime) return null
  return new Date(sunriseTime).toLocaleTimeString('de-CH', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const sunset = computed(() => {
  const sunsetTime = props.forecast.daily?.sunset?.[0]
  if (!sunsetTime) return null
  return new Date(sunsetTime).toLocaleTimeString('de-CH', {
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.current-weather { padding: 24px; }
.cw-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.cw-location h2 { margin: 0; font-size: 1.4rem; }
.cw-sub { font-size: 0.85rem; color: var(--text-muted); }
.cw-icon { font-size: 3rem; }
.cw-desc { margin: 4px 0 16px; color: var(--text-muted); font-size: 0.95rem; }
.cw-temp {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}
.temp-main { font-size: 3.5rem; font-weight: 700; color: var(--accent); line-height: 1; }
.temp-feels { font-size: 0.9rem; color: var(--text-muted); }
.cw-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.cw-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg);
  border-radius: 10px;
  padding: 12px 8px;
  gap: 4px;
}
.stat-icon { font-size: 1.2rem; }
.stat-val { font-weight: 600; font-size: 0.95rem; }
.stat-label { font-size: 0.75rem; color: var(--text-muted); }

.cw-sun {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg);
  border-radius: 10px;
}
.sun-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.sun-icon { font-size: 1.8rem; }
.sun-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sun-label { font-size: 0.75rem; color: var(--text-muted); }
.sun-time { font-size: 1rem; font-weight: 600; color: var(--text); }
</style>
