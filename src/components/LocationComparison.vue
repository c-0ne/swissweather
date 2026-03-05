<template>
  <div class="comparison card p-6">
    <h3 class="text-lg font-bold mb-4">📍 Location Comparison</h3>
    <div class="rounded-xl overflow-hidden mb-5">
      <AgCharts :options="chartOptions" />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th class="comp-th">Location</th>
            <th class="comp-th">Temp</th>
            <th class="comp-th">Feels Like</th>
            <th class="comp-th">Wind</th>
            <th class="comp-th">Rain</th>
            <th class="comp-th">Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(loc, i) in rows" :key="i" :class="{ 'selected-row': i === 0 }">
            <td class="comp-td flex items-center gap-1">
              <span v-if="i === 0" class="text-sm">📍</span>
              {{ loc.name }}
            </td>
            <td class="comp-td"><strong>{{ loc.temp }}°C</strong></td>
            <td class="comp-td">{{ loc.feels }}°C</td>
            <td class="comp-td">{{ loc.wind }} km/h</td>
            <td class="comp-td">{{ loc.rain }} mm</td>
            <td class="comp-td">{{ loc.icon }} {{ loc.condition }}</td>
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
.comp-th {
  text-align: left;
  padding: 8px 12px;
  color: var(--text-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.comp-td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

tr:last-child .comp-td { border-bottom: none; }

tr.selected-row .comp-td {
  background: var(--accent-soft);
  font-weight: 500;
}
</style>
