import { ref, computed, onMounted } from 'vue'

const BASE_FORECAST = 'https://api.open-meteo.com/v1/forecast'
const BASE_HISTORICAL = 'https://archive-api.open-meteo.com/v1/archive'
const BASE_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search'

const COMPARISON_LOCATIONS = [
  { name: 'Zürich City', lat: 47.3769, lon: 8.5417 },
  { name: 'Uetliberg', lat: 47.3529, lon: 8.4917 },
  { name: 'Zürichsee', lat: 47.2996, lon: 8.5670 },
]

async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,apparent_temperature',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,sunrise,sunset,wind_speed_10m_max',
    hourly: 'temperature_2m,precipitation_probability,precipitation',
    timezone: 'auto',
    forecast_days: '7',
  })
  const res = await fetch(`${BASE_FORECAST}?${params}`)
  if (!res.ok) throw new Error('Forecast fetch failed')
  return res.json()
}

async function fetchHistorical(lat, lon, date) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: date,
    end_date: date,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max,sunrise,sunset',
    timezone: 'auto',
  })
  const res = await fetch(`${BASE_HISTORICAL}?${params}`)
  if (!res.ok) throw new Error('Historical fetch failed')
  return res.json()
}

function buildLocationFromParams(params) {
  const lat = parseFloat(params.get('lat'))
  const lon = parseFloat(params.get('lon'))
  const name = params.get('name')
  if (!name || isNaN(lat) || isNaN(lon)) return null
  return {
    name,
    lat,
    lon,
    admin1: params.get('admin1') ?? '',
    country: params.get('country') ?? '',
  }
}

function updateURLForLocation(location) {
  const params = new URLSearchParams({
    name: location.name,
    lat: location.lat,
    lon: location.lon,
  })
  if (location.admin1) params.set('admin1', location.admin1)
  if (location.country) params.set('country', location.country)
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({ location }, '', newUrl)
}

export function useWeather() {
  const selectedLocation = ref(null)
  const forecast = ref(null)
  const historicalData = ref(null)
  const comparisonData = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function searchLocations(query) {
    if (!query || query.length < 2) return []
    const params = new URLSearchParams({
      name: query,
      count: '10',
      language: 'de',
      format: 'json',
    })
    const res = await fetch(`${BASE_GEOCODING}?${params}`)
    if (!res.ok) throw new Error('Geocoding failed')
    const data = await res.json()
    return data.results ?? []
  }

  function getYearAgoDate() {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1)
    return d.toISOString().split('T')[0]
  }

  async function loadWeather(location, { updateUrl = true } = {}) {
    selectedLocation.value = location
    loading.value = true
    error.value = null
    forecast.value = null
    historicalData.value = null
    comparisonData.value = []

    if (updateUrl) updateURLForLocation(location)

    try {
      const { lat, lon } = location
      const yearAgo = getYearAgoDate()

      const [forecastRes, historicalRes] = await Promise.all([
        fetchForecast(lat, lon),
        fetchHistorical(lat, lon, yearAgo),
      ])

      forecast.value = forecastRes
      historicalData.value = historicalRes

      // Load comparison locations
      const compResults = await Promise.all(
        COMPARISON_LOCATIONS.map(async (loc) => {
          const data = await fetchForecast(loc.lat, loc.lon)
          return { ...loc, weather: data }
        })
      )
      // Prepend selected location
      comparisonData.value = [
        { name: location.name, lat: location.lat, lon: location.lon, weather: forecastRes },
        ...compResults,
      ]
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // On mount: check URL params and auto-load location
  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const locationFromUrl = buildLocationFromParams(params)
    if (locationFromUrl) {
      loadWeather(locationFromUrl, { updateUrl: false })
    }
  })

  const outdoorScore = computed(() => {
    if (!forecast.value) return null
    const cur = forecast.value.current
    const code = cur.weather_code
    const temp = cur.temperature_2m
    const wind = cur.wind_speed_10m
    const rain = cur.precipitation

    let score = 100

    // Rain deductions
    if (code >= 95) score -= 40
    else if (code >= 80) score -= 30
    else if (code >= 61) score -= 25
    else if (code >= 51) score -= 15

    // Snow deductions
    if (code >= 71 && code <= 77) score -= 20
    if (code === 85 || code === 86) score -= 25

    // Wind deductions
    if (wind > 60) score -= 30
    else if (wind > 40) score -= 20
    else if (wind > 30) score -= 10

    // Temperature comfort
    if (temp >= 15 && temp <= 25) score += 5
    else if (temp < 0) score -= 20
    else if (temp < 5) score -= 10
    else if (temp > 35) score -= 15

    // Precipitation amount
    if (rain > 5) score -= 10
    else if (rain > 2) score -= 5

    score = Math.max(0, Math.min(100, score))

    const umbrella = code >= 51 || rain > 0.5
    const sunscreen = code <= 2 && temp > 20
    const jacket = temp < 12 || wind > 30

    return { score, umbrella, sunscreen, jacket }
  })

  const stormAlerts = computed(() => {
    if (!forecast.value) return []
    const alerts = []
    const cur = forecast.value.current
    const daily = forecast.value.daily

    if (cur.weather_code >= 95) {
      alerts.push({ type: 'danger', message: '⛈️ Active thunderstorm at your location!' })
    } else if (cur.weather_code >= 80) {
      alerts.push({ type: 'warning', message: '🌧️ Heavy showers currently.' })
    }

    if (daily && daily.weather_code) {
      daily.weather_code.forEach((code, i) => {
        if (i === 0) return // skip today (already checked in current weather above)
        const dateLabel = daily.time[i]
        if (code >= 95) {
          alerts.push({ type: 'danger', message: `⛈️ Thunderstorm expected on ${dateLabel}` })
        } else if (code === 85 || code === 86) {
          alerts.push({ type: 'warning', message: `🌨️ Heavy snow showers on ${dateLabel}` })
        } else if (code >= 71 && code <= 77) {
          alerts.push({ type: 'info', message: `❄️ Snowfall expected on ${dateLabel}` })
        }
      })
    }

    return alerts
  })

  return {
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
  }
}
