# 🌦️ SwissWeather Home

**SwissWeather Home** is a beautiful, real-time weather dashboard for any location — optimised for Switzerland, but works worldwide.

---

## What can it do?

### 🔍 Location Search
Search for any city, village, or region. The location you select is automatically reflected in the URL so you can bookmark it or share it with others. Opening the link brings you straight to the weather for that location.

### 🌡️ Current Conditions
See at a glance what the weather is like right now:
- Temperature and "feels like" temperature
- Wind speed, precipitation and humidity
- Weather icon and description (e.g. "Partly cloudy")
- **Sunrise and sunset times** in your local time zone

### 📅 7-Day Forecast
A clean daily overview showing:
- Weather icon, max and min temperatures
- **Rain probability bar** — colour-coded from blue (low) → orange (medium) → red (high) so you can spot rainy days immediately
- Precipitation in millimetres
- Interactive temperature and precipitation chart for the week

### 📍 Location Comparison
Compare your chosen location with nearby points of interest (like Zürich City, Uetliberg, and Zürichsee). See side-by-side temperatures, wind, precipitation, and conditions at a glance.

### 📅 A Year Ago Today
Find out what the weather was like exactly one year ago at the same location:
- Max and min temperatures, with a comparison to today
- Precipitation and wind speed
- Weather condition (was it sunny? rainy? snowy?)
- Sunrise and sunset from a year ago
- A smart **💡 Insight** that highlights interesting facts (e.g. "A year ago was very wet with 18 mm of rain")

### 🧭 Should I Go Outside?
A smart outdoor score (0–100) that weighs temperature, wind, rain, and weather conditions to tell you whether it's a good day to head out — plus gear recommendations (umbrella, sunscreen, jacket).

### ⛈️ Weather Alerts
If a thunderstorm, heavy snow, or severe rain is forecast in the next 7 days, a clear alert banner appears at the top of the dashboard.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser, then search for your location.

To build for production:

```bash
npm run build
```

---

## Technology

- [Vue 3](https://vuejs.org/) — reactive UI framework
- [Vite](https://vitejs.dev/) — fast build tool
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [AG Charts](https://www.ag-grid.com/charts/) — interactive charts
- [Open-Meteo](https://open-meteo.com/) — free weather & geocoding API (no API key needed)
