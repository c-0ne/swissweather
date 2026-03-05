# SwissWeather 🌦️

Eine moderne Wetter-Anwendung für die Schweiz mit umfassenden Wetterinformationen und historischen Vergleichen.

## Was die App kann

SwissWeather zeigt dir detaillierte Wetterinformationen für jeden Ort in der Schweiz und darüber hinaus. Die Anwendung bietet:

### 🔍 Standortsuche
- Suche nach beliebigen Orten weltweit
- Die gewählte Location wird in der URL gespeichert
- Links können geteilt werden, um direkt einen bestimmten Ort anzuzeigen

### 🌤️ Aktuelles Wetter
- Aktuelle Temperatur und gefühlte Temperatur
- Wetterzustand mit passendem Icon
- Windgeschwindigkeit
- Niederschlagsmenge
- Luftfeuchtigkeit
- **Sonnenaufgang und Sonnenuntergang** mit lokaler Zeitanzeige

### 📊 7-Tage Vorhersage
- Tägliche Höchst- und Tiefsttemperaturen
- Wettersymbole für jeden Tag
- **Regenwahrscheinlichkeit pro Tag** (deutlich sichtbar mit Prozentangabe)
- Niederschlagsmenge in mm
- Interaktive Diagramme für Temperatur und Niederschlag

### 🎯 Outdoor-Score
- Bewertung von 0-100 für Outdoor-Aktivitäten
- Empfehlungen: Regenschirm ☂️, Sonnencreme 🧴, Jacke 🧥
- Farbcodierte Anzeige (Grün = gut, Gelb = mittel, Orange/Rot = schlecht)

### 📅 "Vor einem Jahr heute"
Dies ist eine besonders spannende Funktion! Sie zeigt:

- **Temperaturvergleich**: Max/Min Temperaturen von heute und vor einem Jahr
- **Temperaturdifferenz**: Wie viel wärmer oder kälter ist es heute?
- **Niederschlagsvergleich**: Regenmengen im Vergleich
- **Wetterbedingungen**: Wie war das Wetter vor einem Jahr?
- **Windgeschwindigkeit**: Maximale Windgeschwindigkeit vor einem Jahr
- **Interessante Einblicke**: Automatische Analyse zeigt signifikante Unterschiede

Mit dieser Funktion kannst du herausfinden, ob es in diesem Jahr zur gleichen Zeit wärmer, kälter, nasser oder trockener ist als vor einem Jahr. Perfekt, um Klimatrends zu beobachten!

### ⚠️ Unwetterwarnungen
- Aktive Gewitter, starke Regenfälle oder Schneefälle
- Farbcodierte Warnungen (Rot = Gefahr, Orange = Warnung, Blau = Info)
- Vorhersage für kommende Tage

### 🏔️ Standortvergleich
- Vergleich mit anderen Schweizer Locations (Zürich City, Uetliberg, Zürichsee)
- Temperatur- und Windvergleiche
- Übersichtliche Tabellendarstellung

## Technische Details

Die Anwendung nutzt:
- **Vue 3** - Modernes JavaScript Framework
- **Vite** - Schneller Build-Tool
- **Tailwind CSS** - Utility-First CSS Framework
- **AG-Charts** - Professionelle Diagramme
- **Open-Meteo API** - Kostenlose Wetter- und Geocoding-Daten

## Verwendung

### Entwicklung starten
```bash
npm install
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Produktion Build
```bash
npm run build
```

### Mit Docker
```bash
docker-compose up --build
```

Die Anwendung ist dann unter `http://localhost` erreichbar.

## Features

- ✅ Responsive Design - funktioniert auf Desktop, Tablet und Mobile
- ✅ Dark Theme - angenehm für die Augen
- ✅ Schnelle Ladezeiten
- ✅ Keine Registrierung erforderlich
- ✅ Kostenlos und Open Source
- ✅ URL-basierte Navigation - Links können geteilt werden

## Browser-Unterstützung

Die App funktioniert in allen modernen Browsern:
- Chrome/Edge (letzte 2 Versionen)
- Firefox (letzte 2 Versionen)
- Safari (letzte 2 Versionen)

## Datenquelle

Alle Wetterdaten werden von [Open-Meteo](https://open-meteo.com) bereitgestellt - einem kostenlosen Wetter-API-Service.
