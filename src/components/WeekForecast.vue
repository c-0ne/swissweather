<template>
  <div class="week-forecast card">
    <h3>7-Day Forecast</h3>

    <div class="daily-list">
      <div v-for="(day, i) in days" :key="i" class="day-row">
        <span class="day-name">{{ day.name }}</span>
        <span class="day-icon">{{ day.icon }}</span>
        <span class="day-range">
          <span class="day-max">{{ day.max }}°</span>
          <span class="day-min">{{ day.min }}°</span>
        </span>
        <div class="day-bar-wrapper">
          <div class="day-bar" :style="{ width: day.precipPct + '%' }"></div>
        </div>
        <span class="day-precip">{{ day.precip }}mm</span>
      </div>
    </div>

    <div class="chart-wrapper">
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
.week-forecast h3 { margin: 0 0 16px; }

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.day-row {
  display: grid;
  grid-template-columns: 50px 30px 70px 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--bg);
}

.day-name { font-weight: 600; font-size: 0.9rem; }
.day-icon { font-size: 1.2rem; text-align: center; }
.day-range { display: flex; gap: 6px; font-size: 0.85rem; }
.day-max { color: #f97316; font-weight: 600; }
.day-min { color: #60a5fa; }

.day-bar-wrapper {
  background: var(--border);
  border-radius: 4px;
  height: 6px;
  overflow: hidden;
}
.day-bar {
  height: 100%;
  background: #60a5fa;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.day-precip { font-size: 0.78rem; color: var(--text-muted); text-align: right; }

.chart-wrapper {
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}
</style>
