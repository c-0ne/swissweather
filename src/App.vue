<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-icon">🌦️</span>
          <span class="logo-text">SwissWeather <span class="logo-accent">Home</span></span>
        </div>
        <LocationSearch :searchFn="searchLocations" @select="loadWeather" />
      </div>
    </header>

    <main class="app-main">
      <div v-if="!selectedLocation" class="hero">
        <div class="hero-icon">🏔️</div>
        <h1>Your Swiss Weather Dashboard</h1>
        <p>Search for any location above to get started.</p>
      </div>

      <template v-else>
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">⟳</div>
          <p>Fetching weather data…</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>⚠️ {{ error }}</p>
          <button @click="loadWeather(selectedLocation)">Retry</button>
        </div>

        <div v-else-if="forecast" class="dashboard">
          <!-- Alerts banner at top -->
          <StormAlert v-if="stormAlerts.length" :alerts="stormAlerts" class="full-width" />

          <!-- Top row: current weather + score -->
          <div class="top-grid">
            <CurrentWeather :forecast="forecast" :location="selectedLocation" />
            <OutdoorScore v-if="outdoorScore" :score="outdoorScore" />
          </div>

          <!-- Week forecast (full width) -->
          <WeekForecast :forecast="forecast" class="full-width" />

          <!-- Bottom row: comparison + historical -->
          <div class="bottom-grid">
            <LocationComparison v-if="comparisonData.length" :comparisonData="comparisonData" />
            <HistoricalComparison :historical="historicalData" :forecast="forecast" />
          </div>
        </div>
      </template>
    </main>

    <footer class="app-footer">
      Data provided by <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>
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

<style>
:root {
  --bg: #0f172a;
  --card-bg: #1e293b;
  --border: #334155;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --accent: #38bdf8;
  --accent-soft: rgba(56, 189, 248, 0.12);
  --radius: 16px;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

a { color: var(--accent); }

/* Header */
.app-header {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.logo-icon { font-size: 1.6rem; }
.logo-text { font-size: 1.15rem; font-weight: 700; }
.logo-accent { color: var(--accent); }

/* Main */
.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 80px 20px;
}
.hero-icon { font-size: 5rem; margin-bottom: 16px; }
.hero h1 { font-size: 2rem; margin: 0 0 12px; color: var(--text); }
.hero p { color: var(--text-muted); font-size: 1.1rem; }

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  gap: 12px;
  color: var(--text-muted);
}
.loading-spinner {
  font-size: 2.5rem;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.error-state {
  text-align: center;
  padding: 40px;
  color: #f87171;
}
.error-state button {
  margin-top: 12px;
  padding: 8px 20px;
  border: none;
  background: var(--accent);
  color: #0f172a;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Dashboard layout */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.full-width { width: 100%; }

.top-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .top-grid { grid-template-columns: 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  font-size: 0.82rem;
  border-top: 1px solid var(--border);
  margin-top: 40px;
}
</style>
