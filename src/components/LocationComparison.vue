<template>
  <div class="comparison card">
    <h3>📍 Location Comparison</h3>
    <div class="comp-chart-wrapper">
      <AgCharts :options="chartOptions" />
    </div>
    <div class="comp-table-wrapper">
      <table class="comp-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Temp</th>
            <th>Feels Like</th>
            <th>Wind</th>
            <th>Rain</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(loc, i) in rows" :key="i" :class="{ 'selected-row': i === 0 }">
            <td class="loc-name-cell">
              <span v-if="i === 0" class="badge">📍</span>
              {{ loc.name }}
            </td>
            <td><strong>{{ loc.temp }}°C</strong></td>
            <td>{{ loc.feels }}°C</td>
            <td>{{ loc.wind }} km/h</td>
            <td>{{ loc.rain }} mm</td>
            <td>{{ loc.icon }} {{ loc.condition }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { AgCharts } from 'ag-charts-vue3'
import { getWeatherInfo } from '../utils/weatherCodes.js'

const props = defineProps({
  comparisonData: { type: Array, required: true },
})

const rows = computed(() =>
  props.comparisonData.map((loc) => {
    const cur = loc.weather?.current ?? {}
    const info = getWeatherInfo(cur.weather_code ?? 0)
    return {
      name: loc.name,
      temp: Math.round(cur.temperature_2m ?? 0),
      feels: Math.round(cur.apparent_temperature ?? 0),
      wind: Math.round(cur.wind_speed_10m ?? 0),
      rain: cur.precipitation ?? 0,
      icon: info.icon,
      condition: info.label,
    }
  })
)

const chartOptions = computed(() => {
  const data = rows.value.map((r) => ({
    location: r.name,
    temp: r.temp,
    wind: r.wind,
  }))
  return {
    background: { fill: 'transparent' },
    data,
    series: [
      {
        type: 'bar',
        xKey: 'location',
        yKey: 'temp',
        yName: 'Temperature (°C)',
        fill: '#f97316',
        cornerRadius: 6,
      },
      {
        type: 'bar',
        xKey: 'location',
        yKey: 'wind',
        yName: 'Wind (km/h)',
        fill: '#60a5fa',
        cornerRadius: 6,
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
    legend: { position: 'bottom' },
    height: 220,
  }
})
</script>

<style scoped>
.comparison { padding: 24px; }
.comparison h3 { margin: 0 0 16px; }

.comp-chart-wrapper {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.comp-table-wrapper { overflow-x: auto; }

.comp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.comp-table th {
  text-align: left;
  padding: 8px 12px;
  color: var(--text-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--border);
}

.comp-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

.comp-table tr:last-child td { border-bottom: none; }

.comp-table tr.selected-row td {
  background: var(--accent-soft);
  font-weight: 500;
}

.loc-name-cell { display: flex; align-items: center; gap: 4px; }
.badge { font-size: 0.9rem; }
</style>
