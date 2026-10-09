# Skycast

Skycast is a responsive weather dashboard that displays current conditions, the previous 24 hours, and the next 24 hours for any searched location. It is built with vanilla JavaScript, Tailwind CSS, and daisyUI, and uses a Vercel serverless function to keep the weather API key out of the browser.

- Live application: https://weather-app-inky-kappa-22.vercel.app
- Repository: https://github.com/amiyshukla1-tech/weather-app
- License: ISC

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)
10. [Error Handling](#error-handling)
11. [Known Limitations](#known-limitations)
12. [Future Improvements](#future-improvements)
13. [Author](#author)
14. [License](#license)

---

## Overview

Skycast lets a user search for a city and view weather data in a single, uncluttered interface. The project was built to practice working with third-party APIs, asynchronous JavaScript, client-side caching, and secure deployment of a frontend application.

The main design goals were:

- Keep the API key private by routing weather requests through a serverless proxy.
- Reduce unnecessary API usage through debounced search and local caching.
- Present clear, specific feedback when something goes wrong.
- Remain fully usable on mobile, tablet, and desktop screens.

---

## Features

**Current conditions**
- Temperature, weather condition, wind speed, and rain probability for the searched location.
- Weather icon that reflects the current condition.

**24-hour timelines**
- Previous 24 hours and next 24 hours displayed as horizontally scrollable hourly cards.
- Each card shows time, icon, temperature, condition, and rain probability.

**Search**
- City autocomplete using the Open-Meteo Geocoding API.
- 300 ms debounce on keystrokes to avoid unnecessary requests.
- Search by clicking the Search button, pressing Enter, or selecting a suggestion.

**Performance and quota protection**
- Results are cached in `localStorage` for 30 minutes per location. Repeat searches within that window do not call the weather API.
- The proxy response is cached at the edge for 30 minutes using `Cache-Control: s-maxage=1800`.
- A confirmation dialog appears before a manual refresh, preventing accidental requests.

**Security**
- The Visual Crossing API key is stored as a server-side environment variable and is never sent to the browser.

**Error handling**
- Dedicated dialogs for empty input, unknown locations, rate limiting, and general failures.

---

## Architecture

```
Browser
   |
   |  1. GET /api/weather?city=London
   v
Vercel Serverless Function (api/weather.js)
   - Reads the API key from environment variables
   - Forwards the request to Visual Crossing
   - Sets Cache-Control headers
   |
   |  2. Authenticated request
   v
Visual Crossing Weather API (Timeline)
```

Autocomplete requests go directly from the browser to the Open-Meteo Geocoding API, which does not require an API key.

---

## Tech Stack

| Area | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Tailwind CSS v4, daisyUI v5 |
| Logic | JavaScript (ES6+), no frameworks |
| Weather data | Visual Crossing Weather API (Timeline) |
| Geocoding | Open-Meteo Geocoding API |
| Backend | Vercel Serverless Function (Node.js) |
| Hosting | Vercel |
| Version control | Git, GitHub |

---

## Project Structure

```
weather-app/
├── api/
│   └── weather.js        Serverless proxy for the weather API
├── src/
│   ├── index.html        Application markup and dialogs
│   ├── input.css         Tailwind and daisyUI source directives
│   ├── output.css        Compiled stylesheet (generated)
│   ├── script.js         Application logic, caching, and DOM updates
│   └── *.jpg             Background image
├── index.html            Root redirect for Vercel routing
├── vercel.json           Vercel configuration
├── package.json          Dependencies and scripts
├── .env.example          Environment variable template
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A free Visual Crossing API key: https://www.visualcrossing.com/weather-api

### Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/amiyshukla1-tech/weather-app.git
   cd weather-app
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a local environment file from the template and add your key.

   ```bash
   cp .env.example .env
   ```

4. Build the stylesheet. Keep this running while you edit.

   ```bash
   npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
   ```

5. Run the project with the Vercel CLI so the serverless function is available locally.

   ```bash
   npm install -g vercel
   vercel dev
   ```

Opening `src/index.html` directly with a static server will load the interface, but weather requests will fail because the `/api/weather` route requires the serverless runtime.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VISUAL_CROSSING_KEY` | Yes | API key used by the serverless proxy |

Never commit a real key. The `.env` file must be listed in `.gitignore`. Use `.env.example` to document the variable names only.

---

## API Reference

### GET /api/weather

Returns timeline data for a location, including current conditions and hourly data for the previous, current, and next day.

**Query parameters**

| Parameter | Required | Description |
|---|---|---|
| `city` | Yes | Location name, for example `London` or `Lucknow, India` |

**Responses**

| Status | Meaning |
|---|---|
| 200 | Weather data returned as JSON |
| 400 or 404 | Location missing or not found |
| 429 | Daily quota of the upstream weather API has been reached |
| 500 | Unexpected server or upstream error |

---

## Deployment

The application is deployed on Vercel.

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Under Project Settings, open Environment Variables and add `VISUAL_CROSSING_KEY`.
4. Deploy. Vercel will serve the static files and register the `api/weather.js` function automatically.
5. After changing environment variables, redeploy so the new values take effect.

---

## Error Handling

| Situation | Behavior |
|---|---|
| Empty search input | Dialog asking the user to enter a location |
| Location not found | Dialog stating that no weather data was found for the entered name |
| Rate limit reached (429) | Dialog stating the weather service limit has been reached |
| Network failure or server error | Generic error dialog with a retry suggestion |

---

## Known Limitations

- The free Visual Crossing plan has a daily record limit. Hourly requests consume more records than daily summaries.
- The `localStorage` cache is per browser and per device. It is not shared between users.
- Time zones follow the searched location, not the visitor's local time.
- There is no offline mode.

---

## Future Improvements

- Toggle between Celsius and Fahrenheit.
- Save recent searches and favorite locations.
- Geolocation-based default city, requested only with user permission.
- Automated tests for the data-filtering functions.
- Accessibility improvements, including visually hidden form labels and keyboard navigation for suggestions.

---

## Author

Amiy Shukla

- GitHub: https://github.com/amiyshukla1-tech

---

## License

This project is licensed under the ISC License.
