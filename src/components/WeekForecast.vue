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
        <div class="rain-info">
          <div class="day-bar-wrapper">
            <div class="day-bar" :style="{ width: day.precipPct + '%' }"></div>
          </div>
          <span class="rain-chance">{{ day.precipPct }}%</span>
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
  grid-template-columns: 60px 35px 80px 1fr 50px;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--bg);
}

.day-name { font-weight: 600; font-size: 0.9rem; }
.day-icon { font-size: 1.3rem; text-align: center; }
.day-range { display: flex; gap: 8px; font-size: 0.9rem; }
.day-max { color: #f97316; font-weight: 600; }
.day-min { color: #60a5fa; }

.rain-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.day-bar-wrapper {
  background: var(--border);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  flex: 1;
}
.day-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.rain-chance {
  font-size: 0.85rem;
  font-weight: 600;
  color: #60a5fa;
  min-width: 36px;
  text-align: right;
}

.day-precip {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-align: right;
  min-width: 50px;
}

.chart-wrapper {
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}

@media (max-width: 600px) {
  .day-row {
    grid-template-columns: 50px 30px 70px 1fr 45px;
    gap: 8px;
    padding: 8px 10px;
  }
  .day-name { font-size: 0.85rem; }
  .day-icon { font-size: 1.1rem; }
  .day-range { font-size: 0.85rem; gap: 6px; }
  .rain-chance { font-size: 0.8rem; min-width: 32px; }
  .day-precip { font-size: 0.78rem; min-width: 45px; }
}
</style>
