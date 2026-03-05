<template>
  <div class="week-forecast card">
    <h3 class="text-lg font-bold mb-4">7-Day Forecast</h3>

    <div class="flex flex-col gap-2 mb-5">
      <div v-for="(day, i) in days" :key="i" class="day-row">
        <span class="day-name font-semibold text-sm w-12 shrink-0">{{ day.name }}</span>
        <span class="text-xl w-7 text-center shrink-0">{{ day.icon }}</span>
        <span class="day-range text-sm w-16 shrink-0">
          <span class="text-orange font-semibold">{{ day.max }}°</span>
          <span class="text-blue ml-1">{{ day.min }}°</span>
        </span>
        <!-- Rain probability section -->
        <div class="flex-1 flex items-center gap-2">
          <div class="rain-bar-wrapper flex-1">
            <div
              class="rain-bar"
              :style="{ width: day.precipPct + '%' }"
              :class="rainClasses(day.precipPct).bar"
            ></div>
          </div>
          <span class="rain-pct-label text-xs font-semibold w-8 text-right" :class="rainClasses(day.precipPct).text">
            {{ day.precipPct }}%
          </span>
        </div>
        <span class="text-xs text-muted w-12 text-right shrink-0">{{ day.precip }}mm</span>
      </div>
    </div>

    <div class="chart-wrapper rounded-xl overflow-hidden mt-2">
      <AgCharts :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { AgCharts } from 'ag-charts-vue3'
import { getWeatherInfo } from '../utils/weatherCodes.js'

const props = defineProps({
  forecast: { type: Object, required: true },
})

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const days = computed(() => {
  const d = props.forecast.daily
  return d.time.map((dateStr, i) => {
    const date = new Date(dateStr)
    const info = getWeatherInfo(d.weather_code[i])
    return {
      name: i === 0 ? 'Today' : DAY_NAMES[date.getDay()],
      icon: info.icon,
      max: Math.round(d.temperature_2m_max[i]),
      min: Math.round(d.temperature_2m_min[i]),
      precip: d.precipitation_sum[i] ?? 0,
      precipPct: Math.min(100, (d.precipitation_probability_max[i] ?? 0)),
    }
  })
})

const RAIN_HIGH_THRESHOLD = 70
const RAIN_MED_THRESHOLD = 40

function rainClasses(pct) {
  if (pct >= RAIN_HIGH_THRESHOLD) return { bar: 'bg-rain-high', text: 'text-rain-high' }
  if (pct >= RAIN_MED_THRESHOLD) return { bar: 'bg-rain-med', text: 'text-rain-med' }
  return { bar: 'bg-rain-low', text: 'text-rain-low' }
}

const chartOptions = computed(() => {
  const d = props.forecast.daily
  const labels = d.time.map((t, i) => (i === 0 ? 'Today' : DAY_NAMES[new Date(t).getDay()]))
  const data = labels.map((label, i) => ({
    day: label,
    max: Math.round(d.temperature_2m_max[i]),
    min: Math.round(d.temperature_2m_min[i]),
    precip: d.precipitation_sum[i] ?? 0,
  }))

  return {
    background: { fill: 'transparent' },
    data,
    series: [
      {
        type: 'line',
        xKey: 'day',
        yKey: 'max',
        yName: 'Max Temp (°C)',
        stroke: '#f97316',
        marker: { fill: '#f97316', stroke: '#f97316' },
      },
      {
        type: 'line',
        xKey: 'day',
        yKey: 'min',
        yName: 'Min Temp (°C)',
        stroke: '#60a5fa',
        marker: { fill: '#60a5fa', stroke: '#60a5fa' },
      },
      {
        type: 'bar',
        xKey: 'day',
        yKey: 'precip',
        yName: 'Precipitation (mm)',
        fill: 'rgba(96,165,250,0.35)',
        stroke: '#60a5fa',
        yAxis: 'right',
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left', title: { text: 'Temperature (°C)' } },
      { type: 'number', position: 'right', keys: ['precip'], title: { text: 'Precipitation (mm)' } },
    ],
    legend: { position: 'bottom' },
    height: 280,
  }
})
</script>

<style scoped>
.week-forecast { padding: 24px; }

.day-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--bg);
}

.text-orange { color: #f97316; }
.text-blue { color: #60a5fa; }

.rain-bar-wrapper {
  background: var(--border);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}
.rain-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}
</style>
