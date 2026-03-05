<template>
  <div class="min-h-screen bg-bg text-slate-100">
    <!-- Header -->
    <header class="bg-card border-b border-card-border px-6 py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto flex items-center gap-6 flex-wrap">
        <div class="flex items-center gap-2 whitespace-nowrap">
          <span class="text-2xl">🌦️</span>
          <span class="text-lg font-bold">SwissWeather <span class="text-accent">Home</span></span>
        </div>
        <div class="flex-1 min-w-0">
          <LocationSearch :searchFn="searchLocations" @select="loadWeather" />
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-5xl mx-auto px-4 py-6">
      <!-- Hero -->
      <div v-if="!selectedLocation" class="text-center py-20 px-5">
        <div class="text-8xl mb-4">🏔️</div>
        <h1 class="text-3xl font-bold mb-3 text-slate-100">Your Swiss Weather Dashboard</h1>
        <p class="text-muted text-lg">Search for any location above to get started.</p>
      </div>

      <template v-else>
        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center py-20 gap-3 text-muted">
          <div class="text-4xl animate-spin">⟳</div>
          <p>Fetching weather data…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-10 text-red-400">
          <p>⚠️ {{ error }}</p>
          <button
            @click="loadWeather(selectedLocation)"
            class="mt-3 px-5 py-2 rounded-lg font-semibold bg-accent text-bg border-none cursor-pointer"
          >Retry</button>
        </div>

        <!-- Dashboard -->
        <div v-else-if="forecast" class="flex flex-col gap-5">
          <!-- Alerts banner -->
          <StormAlert v-if="stormAlerts.length" :alerts="stormAlerts" />

          <!-- Top row: current weather + score -->
          <div class="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5">
            <CurrentWeather :forecast="forecast" :location="selectedLocation" />
            <OutdoorScore v-if="outdoorScore" :score="outdoorScore" />
          </div>

          <!-- Week forecast (full width) -->
          <WeekForecast :forecast="forecast" />

          <!-- Bottom row: comparison + historical -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LocationComparison v-if="comparisonData.length" :comparisonData="comparisonData" />
            <HistoricalComparison :historical="historicalData" :forecast="forecast" />
          </div>
        </div>
      </template>
    </main>

    <!-- Footer -->
    <footer class="text-center px-6 py-6 text-muted text-xs border-t border-card-border mt-10">
      Data provided by <a href="https://open-meteo.com" target="_blank" rel="noopener" class="text-accent">Open-Meteo</a>
    </footer>
  </div>
</template>

<script setup>
import { useWeather } from './composables/useWeather.js'
import LocationSearch from './components/LocationSearch.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import OutdoorScore from './components/OutdoorScore.vue'
import WeekForecast from './components/WeekForecast.vue'
import LocationComparison from './components/LocationComparison.vue'
import StormAlert from './components/StormAlert.vue'
import HistoricalComparison from './components/HistoricalComparison.vue'

const {
  selectedLocation,
  forecast,
  historicalData,
  comparisonData,
  loading,
  error,
  outdoorScore,
  stormAlerts,
  searchLocations,
  loadWeather,
} = useWeather()
</script>
